

import React, { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export default function Summary({ month, refreshKey }) {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const url = month
      ? `${API_BASE_URL}/savings/summary/?month=${month}`
      : `${API_BASE_URL}/savings/summary/`;
    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch summary');
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          const row = data[0];
          setSummary({
            'Opening Balance': row.opening_balance ?? 0,
            'Savings': row.savings ?? 0,
            'Credit': row.credit ?? 0,
            'Expenses': row.expenses ?? 0,
            'Net Balance': row.net_balance ?? 0,
            'Closing Balance': row.closing_balance ?? 0,
          });
        } else {
          setSummary(null);
        }
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [month, refreshKey]);

  return (
    <div
      className="tracker-card tracker-card-hover shadow-lg border-0"
      style={{
        background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ef 100%)',
        borderRadius: 18,
        boxShadow: '0 2px 12px 0 rgba(60,72,100,0.10)',
        padding: '1.1rem 0.5rem 0.7rem 0.5rem',
        width: '100%',
        minWidth: 0,
        maxWidth: '100%',
        border: '1px solid #e2e8f0',
        margin: 0,
      }}
    >
      <h2 className="text-center mb-3" style={{ fontWeight: 800, color: '#2d3748', fontSize: 20, letterSpacing: 0.5, textShadow: '0 1px 4px #e0e7ef' }}>Budget Summary</h2>
      {loading ? (
        <div className="text-center">Loading...</div>
      ) : error ? (
        <div className="text-danger text-center">{error}</div>
      ) : (
        <div style={{ width: '100%' }}>
          <Table
            bordered
            hover
            responsive
            className="mb-3 summary-table"
            style={{
              background: '#fff',
              borderRadius: 14,
              border: '1px solid #e2e8f0',
              minWidth: 320,
              tableLayout: 'auto',
              boxShadow: '0 1px 8px 0 rgba(60,72,100,0.07)',
              fontFamily: 'Inter, sans-serif',
              fontSize: 14,
              overflow: 'hidden',
            }}
          >
            <thead style={{ background: 'linear-gradient(90deg, #e0e7ef 60%, #f8fafc 100%)' }}>
              <tr style={{ fontWeight: 800, color: '#2d3748', fontSize: 15, letterSpacing: 0.5 }}>
                {summary ? Object.keys(summary).map((cat, idx) => (
                  <th
                    key={cat}
                    style={{
                      padding: '8px 10px',
                      minWidth: 90,
                      textAlign: 'center',
                      borderTopLeftRadius: idx === 0 ? 12 : 0,
                      borderTopRightRadius: idx === Object.keys(summary).length - 1 ? 12 : 0,
                    }}
                  >
                    {cat}
                  </th>
                )) : (
                  <th colSpan={6} style={{ textAlign: 'center', color: '#64748b', fontStyle: 'italic', padding: '10px 0' }}>
                    No data available for this month.
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {summary && (
                <tr>
                  {Object.values(summary).map((amt, idx) => (
                    <td
                      key={idx}
                      style={{
                        padding: '6px 8px',
                        verticalAlign: 'middle',
                        textAlign: 'right',
                        fontWeight: 600,
                        fontSize: 14,
                      }}
                    >
                      {Number(amt).toLocaleString()}
                    </td>
                  ))}
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      )}
    </div>
  );
}
