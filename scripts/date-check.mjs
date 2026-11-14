// Pure-function checks for DateField parsing. No browser. Includes an exhaustive test against the JS calendar.
import { parseDate, formatDate, daysInMonth, isLeapYear } from '../src/behaviors/index.js';
let n = 0, bad = 0;
const eq = (a, b, m) => { n++; if (JSON.stringify(a) !== JSON.stringify(b)) { bad++; if (bad < 25) console.log(`FAIL ${m}: got ${JSON.stringify(a)}, want ${JSON.stringify(b)}`); } };
const ok = (t, iso, o) => eq(parseDate(t, o).iso, iso, `parse ${t}`);
const err = (t, msg, o) => { const r = parseDate(t, o); eq([r.ok, r.error], [false, msg], `error ${t}`); };

// Accepted forms all give the same ISO date.
for (const t of ['01/05/1960', '1/5/1960', '1-5-1960', '01.05.1960', '01051960', '1960-01-05', '  1/5/1960  ']) ok(t, '1960-01-05');
eq(parseDate('1/5/1960').text, '01/05/1960', 'display form is zero padded');
eq(parseDate('').ok, true, 'empty is fine when not required');
eq(parseDate('').iso, '', 'empty has no value');
err('', 'Enter a date.', { required: true });
err('', 'Enter the date of birth.', { required: true, label: 'Date of birth' });

// Never guess.
err('1/5/60', 'Enter the year with 4 digits, for example 1960.');
err('1/5/960', 'Enter the year with 4 digits, for example 1960.');
err('1/5/19600', 'Enter the year with 4 digits, for example 1960.');
err('01/05/0960', 'Enter the year with 4 digits, for example 1960.');
err('13/01/1960', 'Enter a month from 01 to 12.');
err('00/10/1960', 'Enter a month from 01 to 12.');
err('01/00/1960', 'Enter a day from 01 to 31.');
err('02/30/2024', 'February 2024 has 29 days.');
err('02/29/2023', 'February 2023 has 28 days.');
err('04/31/2023', 'April 2023 has 30 days.');
err('02/29/1900', 'February 1900 has 28 days.');
ok('02/29/2000', '2000-02-29');
ok('02/29/2024', '2024-02-29');
err('January 5, 1960', 'Enter a date as MM/DD/YYYY, for example 01/15/1960.');
err('1960/01/05', 'Enter a date as MM/DD/YYYY, for example 01/15/1960.');
err('1/5', 'Enter a date as MM/DD/YYYY, for example 01/15/1960.');
err('1/5/1960x', 'Enter a date as MM/DD/YYYY, for example 01/15/1960.');
err('105/1960', 'Enter a date as MM/DD/YYYY, for example 01/15/1960.');
eq(parseDate('12/11/2000').iso, '2000-12-11', 'month first: 12/11 is December 11, never November 12');
eq(parseDate('11/12/2000').iso, '2000-11-12', 'month first: 11/12 is November 12');

// Limits name themselves.
const lim = { min: '1900-01-01', max: '2099-12-31' };
err('12/31/1899', 'Enter a date from 01/01/1900 to 12/31/2099.', lim);
err('01/01/2100', 'Enter a date from 01/01/1900 to 12/31/2099.', lim);
ok('01/01/1900', '1900-01-01', lim);
ok('12/31/2099', '2099-12-31', lim);
err('12/31/1899', 'Enter a date on or after 01/01/1900.', { min: '1900-01-01' });
err('01/02/2020', 'Enter a date on or before 01/01/2020.', { max: '2020-01-01' });

// Helpers.
eq(formatDate('1960-01-05'), '01/05/1960', 'formatDate');
eq(formatDate('1960-02-30'), '', 'formatDate rejects an impossible date');
eq(formatDate('garbage'), '', 'formatDate rejects garbage');
eq([isLeapYear(1900), isLeapYear(2000), isLeapYear(2024), isLeapYear(2023)], [false, true, true, false], 'leap years');
eq(daysInMonth(2024, 2), 29, 'Feb 2024');

// Exhaustive: every month/day/year-combination from 1900 to 2100, checked against the JavaScript calendar.
// A date is real exactly when UTC Date round-trips it. Also format -> parse round trip for every real date.
let real = 0, fake = 0;
for (let y = 1900; y <= 2100; y++) {
  for (let m = 1; m <= 12; m++) {
    for (let d = 1; d <= 31; d++) {
      const dt = new Date(Date.UTC(y, m - 1, d));
      const isReal = dt.getUTCFullYear() === y && dt.getUTCMonth() === m - 1 && dt.getUTCDate() === d;
      const text = `${String(m).padStart(2, '0')}/${String(d).padStart(2, '0')}/${y}`;
      const r = parseDate(text);
      n++;
      if (r.ok !== isReal) { bad++; if (bad < 25) console.log(`FAIL calendar ${text}: parse ok=${r.ok}, calendar says ${isReal}`); continue; }
      if (isReal) {
        real++;
        const iso = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        if (r.iso !== iso || formatDate(iso) !== text || parseDate(formatDate(iso)).iso !== iso) { bad++; if (bad < 25) console.log(`FAIL round trip ${text}`); }
      } else fake++;
    }
  }
}
eq([real, fake], [73414, 1 * 0 + (201 * 372 - 73414)], 'every day from 1900 to 2100 was checked (73,414 real dates)');
console.log(`${n} checks, ${bad} failed.`);
process.exit(bad ? 1 : 0);
