import React, { useId, useMemo, useState } from 'react';

/**
 * DataTable. The v1.0.0 spec listed DataTable as an organism and the workbench never built it.
 * Pension apps are table-heavy, so this is the component that matters most.
 *
 * - <caption> names the table; scope="col" on headers; numeric columns right-aligned with tabular figures.
 * - Sortable headers are real buttons with aria-sort on the <th>; a polite live region announces the result.
 * - Horizontal overflow lives in a focusable, labelled region so keyboard users can scroll it (WCAG 2.1.1).
 *
 * columns: [{ key, label, numeric?, sortable?, format?(value, row) }]
 */
export function DataTable({ caption, note, columns, rows, rowKey = (_, i) => i, initialSort }) {
  const captionId = useId();
  const [sort, setSort] = useState(initialSort ?? null); // { key, dir: 'ascending' | 'descending' }
  const [announce, setAnnounce] = useState('');

  const sorted = useMemo(() => {
    if (!sort) return rows;
    const { key, dir } = sort;
    const factor = dir === 'ascending' ? 1 : -1;
    return [...rows].sort((a, b) => {
      const x = a[key];
      const y = b[key];
      if (typeof x === 'number' && typeof y === 'number') return (x - y) * factor;
      return String(x).localeCompare(String(y), 'en') * factor;
    });
  }, [rows, sort]);

  const toggleSort = (col) => {
    const dir = sort?.key === col.key && sort.dir === 'ascending' ? 'descending' : 'ascending';
    setSort({ key: col.key, dir });
    setAnnounce(`Sorted by ${col.label}, ${dir}`);
  };

  return (
    <div className="pbgc-table-region" role="region" aria-labelledby={captionId} tabIndex={0}>
      <table className="pbgc-table">
        <caption id={captionId}>
          {caption}
          {note && <span className="pbgc-small">{note}</span>}
        </caption>
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                scope="col"
                className={col.numeric ? 'pbgc-num' : undefined}
                aria-sort={sort?.key === col.key ? sort.dir : col.sortable ? 'none' : undefined}
              >
                {col.sortable ? (
                  <button type="button" className="pbgc-table__sort" onClick={() => toggleSort(col)}>
                    {col.label}
                    <span aria-hidden="true">{sort?.key === col.key ? (sort.dir === 'ascending' ? '▲' : '▼') : '↕'}</span>
                  </button>
                ) : (
                  col.label
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((row, i) => (
            <tr key={rowKey(row, i)}>
              {columns.map((col) => (
                <td key={col.key} className={col.numeric ? 'pbgc-num' : undefined}>
                  {col.format ? col.format(row[col.key], row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pbgc-sr-only" role="status" aria-live="polite">{announce}</div>
    </div>
  );
}
