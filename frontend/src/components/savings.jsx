import React, { useEffect, useState } from 'react';
import OptionsManager from './options';
import { FaEdit } from 'react-icons/fa';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { FaPlus, FaTrash } from 'react-icons/fa';

// Set API base URL from environment only (define outside component for stable reference)
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export default function SavingsTracker({ month, showNullDate }) {
    const [Savings, setSavings] = useState([]);
    const [editedRows, setEditedRows] = useState(new Set());
    const [particularOptions, setParticularOptions] = useState([]);
    const [showParticularsManager, setShowParticularsManager] = useState(false);

    function fetchParticularOptions() {
        fetch(`${API_BASE_URL}/savings/particular-options/?type=saving`)
            .then(res => res.json())
            .then(data => setParticularOptions(data))
            .catch(() => setParticularOptions([]));
    }

    useEffect(() => {
        fetch(`${API_BASE_URL}/savings/list/`)
            .then(res => res.json())
            .then(data => setSavings(data))
            .catch(() => setSavings([]));
        fetchParticularOptions();
    }, []);

    function onSavingEdit(value, key, index) {
        const savings = [...Savings];
        savings[index][key] = value;
        setSavings(savings);
        setEditedRows(prev => new Set(prev).add(index));
    }

    function onSavingAdd(e, index) {
        const newSaving = { date: '', particular: '', amount: '' };
        const savings = [...Savings];
        savings.splice(index + 1, 0, newSaving);
        setSavings(savings);
        setEditedRows(prev => {
            const next = new Set(prev);
            next.add(index + 1);
            return next;
        });
    }

    function onSavingDelete(index) {
        const saving = Savings[index];
        if (saving && saving.id) {
            fetch(`${API_BASE_URL}/savings/delete/${saving.id}/`, {
                method: 'DELETE',
            })
                .then(() => {
                fetch(`${API_BASE_URL}/savings/list/`)
                        .then(res => res.json())
                        .then(data => setSavings(data));
                });
        } else {
            const newSavings = [...Savings];
            newSavings.splice(index, 1);
            setSavings(newSavings);
        }
    }

    function onSavingsSave(index) {
        const saving = Savings[index];
        if (!saving || (!saving.particular && !saving.amount)) return;
        let date = saving.date;
        if (date && typeof date === 'string' && date.length > 0) {
            const match = date.match(/^\d{4}-\d{2}-\d{2}$/);
            if (!match) date = null;
        } else {
            date = null;
        }
        const payload = { ...saving, date };
        if (saving.id) payload.id = saving.id;
        fetch(`${API_BASE_URL}/savings/save/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        })
            .then(() => {
            fetch(`${API_BASE_URL}/savings/list/`)
                    .then(res => res.json())
                    .then(data => setSavings(data));
                setEditedRows(prev => {
                    const next = new Set(prev);
                    next.delete(index);
                    return next;
                });
            });
    }

    const filteredSavings = month
        ? Savings.filter(s => (s.date && s.date.startsWith(month)) || (showNullDate && (!s.date || s.date === '')))
        : Savings;

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
      <Card.Title as="h2" className="text-center mb-3" style={{ fontWeight: 800, letterSpacing: 0.5, color: '#2d3748', textShadow: '0 1px 4px #e0e7ef', fontSize: 20 }}>Savings Tracker</Card.Title>
      <div style={{ width: '100%', overflowX: 'auto' }}>
        <Table
          bordered
          hover
          responsive
          className="mb-3 savings-table"
          style={{
            background: '#fff',
            borderRadius: 14,
            border: '1px solid #e2e8f0',
            minWidth: 420,
            tableLayout: 'auto',
            boxShadow: '0 1px 8px 0 rgba(60,72,100,0.07)',
            fontFamily: 'Inter, sans-serif',
            fontSize: 14,
            overflow: 'hidden',
          }}
        >
          <thead style={{ background: 'linear-gradient(90deg, #e0e7ef 60%, #f8fafc 100%)' }}>
            <tr style={{ fontWeight: 800, color: '#2d3748', fontSize: 15, letterSpacing: 0.5 }}>
              <th style={{ borderTopLeftRadius: 12, padding: '8px 2px', minWidth: 36, maxWidth: 40, width: 36, textAlign: 'center' }}>#</th>
              <th style={{ padding: '8px 4px', minWidth: 60, maxWidth: 80, width: 70 }}>Date</th>
              <th style={{ padding: '8px 10px', minWidth: 120 }} className="d-flex align-items-center">
                <span>Particulars</span>
                <Button
                  variant="link"
                  size="sm"
                  className="p-0 ms-1 align-middle"
                  style={{ lineHeight: 1, verticalAlign: 'middle', fontSize: 15 }}
                  onClick={() => setShowParticularsManager(true)}
                  title="Manage particulars"
                >
                  <FaEdit style={{ fontSize: 15 }} />
                </Button>
              </th>
              <th style={{ padding: '8px 14px', minWidth: 90, maxWidth: 120, width: 90 }}>Amount</th>
              <th style={{ borderTopRightRadius: 12, padding: '8px 4px', minWidth: 60, maxWidth: 70, width: 60, textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSavings.map((saving, filteredIndex) => {
              const actualIndex = Savings.indexOf(saving);
              const rowKey = saving.id || `new-${filteredIndex}`;
              return (
                <tr key={rowKey} style={{ fontSize: 13 }}>
                  <td style={{ padding: '6px 2px', verticalAlign: 'middle', textAlign: 'center', fontWeight: 700, color: '#64748b', background: '#f1f5fa' }}>{filteredIndex + 1}</td>
                  <td style={{ padding: '6px 8px', verticalAlign: 'middle' }}>
                    <Form.Control
                      type="date"
                      value={saving.date}
                      onChange={(e) => { onSavingEdit(e.target.value, 'date', actualIndex); }}
                      className="rounded-pill px-2"
                      style={{ fontSize: 13, fontFamily: 'Inter, sans-serif', background: '#f8fafc', border: '1px solid #cbd5e1', minWidth: 0, height: 28, width: 90, maxWidth: 110, padding: '0 2px' }}
                    />
                  </td>
                  <td style={{ padding: '6px 8px', verticalAlign: 'middle' }}>
                    <Form.Select
                      value={saving.particular || ''}
                      onChange={e => onSavingEdit(e.target.value, 'particular', actualIndex)}
                      className="rounded-pill px-2 mb-1"
                      style={{ fontSize: 13, fontFamily: 'Inter, sans-serif', background: '#f8fafc', border: '1px solid #cbd5e1', minWidth: 0, height: 28, width: '100%' }}
                    >
                      <option value="">Select</option>
                      {particularOptions.map(opt => (
                        <option key={opt.id} value={opt.name}>{opt.name}</option>
                      ))}
                    </Form.Select>
                  </td>
                  <td style={{ padding: '6px 8px', verticalAlign: 'middle' }}>
                    <Form.Control
                      value={saving.amount}
                      onChange={(e) => { onSavingEdit(e.target.value, "amount", actualIndex); }}
                      placeholder="Amount"
                      className="rounded-pill px-2"
                      type="number"
                      min={0}
                      style={{ fontSize: 14, fontFamily: 'Inter, sans-serif', background: '#f8fafc', border: '1px solid #cbd5e1', minWidth: 0, height: 32, width: '100%' }}
                    />
                  </td>
                  <td style={{ padding: '4px 2px', verticalAlign: 'middle', textAlign: 'center', width: 60 }}>
                    <div className="d-flex align-items-center gap-1 justify-content-center">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="p-1"
                        style={{ fontSize: 12, minWidth: 22, height: 22, borderRadius: 7 }}
                        onClick={(e) => { onSavingAdd(e, actualIndex); }}
                        title="Add row below"
                      >
                        <FaPlus />
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        className="p-1"
                        style={{ fontSize: 12, minWidth: 22, height: 22, borderRadius: 7 }}
                        onClick={() => onSavingDelete(actualIndex)}
                        title="Delete row"
                      >
                        <FaTrash />
                      </Button>
                      <Button
                        variant="success"
                        size="sm"
                        className="p-1"
                        style={{ fontSize: 12, minWidth: 28, height: 22, borderRadius: 7 }}
                        onClick={() => onSavingsSave(actualIndex)}
                        disabled={!editedRows.has(actualIndex)}
                        title="Save row"
                      >
                        Save
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>
      {/* Add New Row button below the table */}
      <div className="d-flex justify-content-center mt-3">
        <Button
          variant="primary"
          size="md"
          className="rounded-pill px-3"
          style={{ fontSize: 15, height: 36, borderRadius: 18 }}
          onClick={(e) => { onSavingAdd(e, Savings.length - 1) }}
        >
          <FaPlus className="me-2" /> Add New Row
        </Button>
      </div>
      <OptionsManager
        show={showParticularsManager}
        onHide={() => setShowParticularsManager(false)}
        type="saving"
        options={particularOptions}
        onOptionsChange={fetchParticularOptions}
      />
    </Card.Body>
  </Card>
);
}
