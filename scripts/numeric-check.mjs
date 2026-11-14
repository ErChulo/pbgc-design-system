#!/usr/bin/env node
// Unit gate for the numeric field's pure parse/format functions (no browser needed).
// The rules under test: never silently change what was typed; digits handled as strings; max 15 digits so the
// numeric value is exact; strict comma grouping; clear "Error:" text per design.md section 10.1.
import { formatNumber, parseNumber } from '../src/behaviors/index.js';

let n = 0;
const failures = [];
const eq = (what, got, want) => {
  n++;
  if (JSON.stringify(got) !== JSON.stringify(want)) failures.push(`${what}\n     got:  ${JSON.stringify(got)}\n     want: ${JSON.stringify(want)}`);
};
const ok = (text, opts, valueText, value = Number(valueText)) =>
  eq(`parse ${JSON.stringify(text)} ${opts.kind}`, (({ ok: k, valueText: v, value: x, error }) => ({ ok: k, valueText: v, value: x, error }))(parseNumber(text, opts)), { ok: true, valueText, value, error: null });
const bad = (text, opts, error) => {
  const r = parseNumber(text, opts);
  eq(`reject ${JSON.stringify(text)} ${opts.kind}`, { ok: r.ok, error: r.error, valueText: r.valueText, value: r.value }, { ok: false, error, valueText: '', value: null });
};
const cur = { kind: 'currency' };
const SHAPE = 'Enter a number such as 1,234.56.';

// --- empty and required
ok('', cur, '', null);
ok('   ', cur, '', null);
bad('', { kind: 'currency', required: true, label: 'Annual salary' }, 'Enter a value for Annual salary.');
bad('', { kind: 'currency', required: true }, 'Enter a value.');

// --- accepted shapes
ok('0', cur, '0'); ok('0.00', cur, '0'); ok('.5', cur, '0.5'); ok('5.', cur, '5'); ok('007', cur, '7');
ok('1234.5', cur, '1234.5'); ok('1,234.50', cur, '1234.5'); ok('$1,234.50', cur, '1234.5');
ok('1,234,567.89', cur, '1234567.89'); ok('1234567.89', cur, '1234567.89'); ok('1 234', cur, '1234');
ok('999,999,999,999,999', { kind: 'integer' }, '999999999999999');

// --- malformed (strict grouping, no exponent, no junk)
for (const t of ['12,34', '1,2345', ',5', '1,234,5', '1e5', 'abc', '1.2.3', '.', '-', '$', '1,234,', '1.2,3', '5 %']) bad(t, cur, SHAPE);

// --- sign
bad('-5', cur, 'Enter a number that is not negative.');
bad('$-5', cur, 'Enter a number that is not negative.');
ok('-0', cur, '0'); ok('-0.00', cur, '0');
const neg = { kind: 'decimal', allowNegative: true };
ok('-1,234.5', neg, '-1234.5'); ok('−5', neg, '-5'); ok('$-5', { kind: 'currency', allowNegative: true }, '-5');
bad('-abc', neg, 'Enter a number such as 1,234.56.');

// --- decimals: never round, never silently truncate
bad('1.005', cur, 'Enter no more than 2 decimal places.'); bad('0.001', cur, 'Enter no more than 2 decimal places.');
ok('1.50', cur, '1.5'); ok('1.500', cur, '1.5'); ok('1.2345', { kind: 'decimal' }, '1.2345');
bad('1.23456', { kind: 'decimal' }, 'Enter no more than 4 decimal places.');
bad('12.5', { kind: 'integer' }, 'Enter a whole number.'); ok('12.0', { kind: 'integer' }, '12'); ok('1,234', { kind: 'integer' }, '1234');
bad('x', { kind: 'integer' }, 'Enter a number such as 1,234.');
bad('1.5', { kind: 'decimal', decimals: 0 }, 'Enter a whole number.');
bad('1.23', { kind: 'decimal', decimals: 1 }, 'Enter no more than 1 decimal place.');

// --- digit limit (keeps the numeric value exact in a double)
ok('123456789012345', { kind: 'integer' }, '123456789012345');
bad('1234567890123456', { kind: 'integer' }, 'Enter no more than 15 digits.');
ok('0.123456789012345', { kind: 'decimal', decimals: 15 }, '0.123456789012345');
bad('1234567890.123456', { kind: 'decimal', decimals: 6 }, 'Enter no more than 15 digits.');
bad('1234567', { kind: 'integer', maxDigits: 6 }, 'Enter no more than 6 digits.');

// --- bounds and percent
const pct = { kind: 'percent', min: 0, max: 100 };
ok('100', pct, '100'); ok('0', pct, '0'); ok('5.25%', pct, '5.25'); ok('5.25', pct, '5.25');
bad('100.0001', pct, 'Enter a number between 0% and 100%.'); bad('101%', pct, 'Enter a number between 0% and 100%.');
bad('1,000', { kind: 'currency', min: 5000 }, 'Enter a number that is $5,000 or more.');
bad('5000.01', { kind: 'currency', max: 5000 }, 'Enter a number that is $5,000 or less.');
bad('0', { kind: 'currency', min: 1, max: 1000000 }, 'Enter a number between $1 and $1,000,000.');
ok('1000000', { kind: 'currency', min: 1, max: 1000000 }, '1000000');
ok('3', { kind: 'decimal', min: null, max: undefined }, '3'); // null/undefined bounds mean "none"
bad('%5', pct, SHAPE); // a % belongs at the end
bad('5%', cur, SHAPE); // % is not valid in a currency field

// --- formatting
eq('format currency pads', formatNumber('1234.5', cur), '1,234.50');
eq('format currency whole', formatNumber('7', cur), '7.00');
eq('format negative', formatNumber('-1234567.891', { kind: 'decimal' }), '-1,234,567.891');
eq('format percent no pad', formatNumber('5.25', { kind: 'percent' }), '5.25');
eq('format empty', formatNumber('', cur), '');
eq('format small', formatNumber('999', cur), '999.00'); eq('format 1000', formatNumber('1000', { kind: 'integer' }), '1,000');

// --- property: format then parse returns the same canonical text; digits <= 15 stay exact in a double
let seed = 12345;
const rnd = (k) => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed % k; };
const digit = () => String(rnd(10));
for (let i = 0; i < 3000; i++) {
  const intLen = 1 + rnd(11);
  let int = String(1 + rnd(9)) + Array.from({ length: intLen - 1 }, digit).join('');
  if (rnd(8) === 0) int = '0';
  const fracLen = rnd(5);
  let frac = Array.from({ length: fracLen }, digit).join('').replace(/0+$/, '');
  const isNeg = rnd(2) === 1 && (int !== '0' || frac !== '');
  const vt = `${isNeg ? '-' : ''}${int}${frac ? `.${frac}` : ''}`;
  const o = { kind: 'decimal', decimals: 4, allowNegative: true };
  const r = parseNumber(formatNumber(vt, o), o);
  eq(`roundtrip ${vt}`, [r.ok, r.valueText], [true, vt]);
  if (int.length + frac.length <= 15 && r.ok) eq(`double exact ${vt}`, Number(vt).toFixed(frac.length), vt);
}

console.log(`${n} numeric checks, ${failures.length} failed.`);
failures.slice(0, 15).forEach((f) => console.log(`FAIL ${f}`));
process.exit(failures.length ? 1 : 0);
