


import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
// Set API base URL from environment only (define outside component for stable reference)
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

// Pivot table for Expense Tracker: shows total amount per particular for a given month
export default function ExpensePivotTable({ month, refreshKey }) {
    const [particulars, setParticulars] = useState([]);
    const [pivot, setPivot] = useState({});

    useEffect(() => {
        if (!month) {
            setParticulars([]);
            setPivot({});
            return;
        }
        fetch(`${API_BASE_URL}/savings/expense-pivot/?month=${month}`)
            .then(res => res.json())
            .then(data => {
                const particularsArr = Object.keys(data).sort();
                setParticulars(particularsArr);
                setPivot(data);
            });
    }, [month, refreshKey]);

    return (
      <Card
        className="tracker-card tracker-card-hover shadow-lg border-0"
        style={{
          background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ef 100%)',
          borderRadius: 18,
          boxShadow: '0 2px 12px 0 rgba(60,72,100,0.10)',
          padding: 0,
          width: '100%',
          minWidth: 0,
          maxWidth: '100%',
          border: '1px solid #e2e8f0',
          margin: 0,
        }}
      >
        <Card.Body style={{ padding: '1.1rem 0.5rem 0.7rem 0.5rem', borderRadius: 18, width: '100%' }}>
          <h3 className="mb-3 text-center" style={{ fontWeight: 800, color: '#2d3748', letterSpacing: 0.5, fontSize: 20, textShadow: '0 1px 4px #e0e7ef', textAlign: 'center' }}>Expense Summary</h3>
          <div style={{ width: '100%' }}>
            <Table
              bordered
              hover
              responsive
              className="pivot-table mb-3"
              style={{
                background: '#fff',
                borderRadius: 14,
                minWidth: 320,
                boxShadow: '0 1px 8px 0 rgba(60,72,100,0.07)',
                fontFamily: 'Inter, sans-serif',
                fontSize: 14,
                overflow: 'hidden',
              }}
            >
              <thead style={{ background: 'linear-gradient(90deg, #e0e7ef 60%, #f8fafc 100%)' }}>
                <tr style={{ fontWeight: 800, color: '#2d3748', fontSize: 15, letterSpacing: 0.5 }}>
                  <th style={{ borderTopLeftRadius: 12, padding: '8px 10px', minWidth: 120 }}>Particular</th>
                  <th style={{ borderTopRightRadius: 12, textAlign: 'right', padding: '8px 14px', minWidth: 90, maxWidth: 120, width: 90 }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {particulars.map(particular => (
                  <tr key={particular} style={{ fontSize: 13 }}>
                    <td style={{ padding: '6px 8px', fontWeight: 700, color: '#374151' }}>{particular}</td>
                    <td style={{ textAlign: 'right', fontWeight: 600, padding: '6px 8px', fontSize: 14 }}>
                      {(pivot[particular] != null && !isNaN(Number(pivot[particular]))) ? Number(pivot[particular]).toLocaleString() : ''}
                    </td>
                  </tr>
                ))}
                {particulars.length > 0 && (
                  <tr style={{ fontWeight: 800, background: 'linear-gradient(90deg, #f8fafc 60%, #e0e7ef 100%)', color: '#2d3748', fontSize: 15 }}>
                    <td style={{ borderBottomLeftRadius: 12, padding: '6px 8px' }}>Total</td>
                    <td style={{ borderBottomRightRadius: 12, textAlign: 'right', padding: '6px 8px', fontSize: 14 }}>
                      {(() => { const total = particulars.reduce((sum, p) => sum + (pivot[p] && !isNaN(Number(pivot[p])) ? Number(pivot[p]) : 0), 0); return (!isNaN(total) ? total.toLocaleString() : ''); })()}
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>
    );
}
