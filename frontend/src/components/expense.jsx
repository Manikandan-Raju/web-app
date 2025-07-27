
import React, { useEffect, useState, useCallback } from 'react';
import OptionsManager from './options';
import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

// Set API base URL from environment only (define outside component for stable reference)
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export default function ExpenseTracker({ month, showNullDate, onDataSaved }) {
    const [Expenses, setExpenses] = useState([]);
    const [editedRows, setEditedRows] = useState(new Set());
    const [particularOptions, setParticularOptions] = useState([]);
    const [showParticularsManager, setShowParticularsManager] = useState(false);

    const fetchParticularOptions = useCallback(() => {
        fetch(`${API_BASE_URL}/savings/particular-options/?type=expense`)
            .then(res => res.json())
            .then(data => setParticularOptions(data))
            .catch(() => setParticularOptions([]));
    }, []);

    useEffect(() => {
        fetch(`${API_BASE_URL}/savings/expense/list/`)
            .then(res => res.json())
            .then(data => setExpenses(data))
            .catch(() => setExpenses([]));
        fetchParticularOptions();
    }, [fetchParticularOptions]);

    function onExpenseEdit(value, key, index) {
        const expenses = [...Expenses];
        expenses[index][key] = value;
        setExpenses(expenses);
        setEditedRows(prev => new Set(prev).add(index));
    }

    function onExpenseAdd(e, index) {
        const newExpense = { date: '', particular: '', amount: '' };
        const expenses = [...Expenses];
        expenses.splice(index + 1, 0, newExpense);
        setExpenses(expenses);
        setEditedRows(prev => {
            const next = new Set(prev);
            next.add(index + 1);
            return next;
        });
    }

    function onExpenseDelete(index) {
        const expense = Expenses[index];
        if (expense && expense.id) {
            fetch(`${API_BASE_URL}/savings/expense/delete/${expense.id}/`, {
                method: "DELETE"
            })
                .then(() => {
                    fetch(`${API_BASE_URL}/savings/expense/list/`)
                        .then(res => res.json())
                        .then(data => setExpenses(data));
                    if (onDataSaved) onDataSaved();
                });
        } else {
            const newExpenses = [...Expenses];
            newExpenses.splice(index, 1);
            setExpenses(newExpenses);
            if (onDataSaved) onDataSaved();
        }
    }

    function onExpenseSave(index) {
        const expense = Expenses[index];
        if (!expense || (!expense.particular && !expense.amount)) return;
        let date = expense.date;
        if (date && typeof date === 'string' && date.length > 0) {
            const match = date.match(/^\d{4}-\d{2}-\d{2}$/);
            if (!match) date = null;
        } else {
            date = null;
        }
        const payload = { ...expense, date };
        if (expense.id) payload.id = expense.id;
        fetch(`${API_BASE_URL}/savings/expense/save/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        })
            .then(() => {
                fetch(`${API_BASE_URL}/savings/expense/list/`)
                    .then(res => res.json())
                    .then(data => setExpenses(data));
                setEditedRows(prev => {
                    const next = new Set(prev);
                    next.delete(index);
                    return next;
                });
                if (onDataSaved) onDataSaved();
            });
    }

    const filteredExpenses = month
        ? Expenses.filter(e => (e.date && e.date.startsWith(month)) || (showNullDate && (!e.date || e.date === '')))
        : Expenses;

    return (
      <Card
        className="tracker-card tracker-card-hover shadow-lg border-0"
        style={{
          background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ef 100%)',
          borderRadius: 18
        }}
      >
        <Card.Body style={{ padding: '1.1rem 0.5rem 0.7rem 0.5rem', borderRadius: 18, width: '100%' }}>
          <Card.Title as="h2" className="text-center mb-3" style={{ fontWeight: 800, letterSpacing: 0.5, color: '#2d3748', textShadow: '0 1px 4px #e0e7ef', fontSize: 20 }}>Expense Tracker</Card.Title>
          <div style={{ width: '100%' }}>
            <Table
              bordered
              hover
              responsive
              className="mb-3 expense-table"
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
                {filteredExpenses.map((expense, filteredIndex) => {
                  const actualIndex = Expenses.indexOf(expense);
                  const rowKey = expense.id || `new-${filteredIndex}`;
                  return (
                    <tr key={rowKey} style={{ fontSize: 13 }}>
                      <td style={{ padding: '6px 2px', verticalAlign: 'middle', textAlign: 'center', fontWeight: 700, color: '#64748b', background: '#f1f5fa' }}>{filteredIndex + 1}</td>
                      <td style={{ padding: '6px 8px', verticalAlign: 'middle' }}>
                        <Form.Control
                          type="date"
                          value={expense.date}
                          onChange={(e) => { onExpenseEdit(e.target.value, 'date', actualIndex); }}
                          className="rounded-pill px-2"
                          style={{ fontSize: 13, fontFamily: 'Inter, sans-serif', background: '#f8fafc', border: '1px solid #cbd5e1', minWidth: 0, height: 28, width: 90, maxWidth: 110, padding: '0 2px' }}
                        />
                      </td>
                      <td style={{ padding: '6px 8px', verticalAlign: 'middle' }}>
                        <Form.Select
                          value={expense.particular || ''}
                          onChange={e => onExpenseEdit(e.target.value, 'particular', actualIndex)}
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
                          value={expense.amount}
                          onChange={(e) => { onExpenseEdit(e.target.value, "amount", actualIndex); }}
                          placeholder="Amount"
                          className="rounded-pill px-2"
                          type="number"
                          min={0}
                          style={{ fontSize: 14, fontFamily: 'Inter, sans-serif', background: '#f8fafc', border: '1px solid #cbd5e1', minWidth: 0, height: 32, width: '100%' }}
                        />
                      </td>
                      <td style={{ padding: '4px 2px', verticalAlign: 'middle', textAlign: 'center', width: 60 }}>
                        <div className="d-flex align-items-center gap-2 justify-content-center">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            className="p-1"
                            style={{ fontSize: 13, minWidth: 28, height: 28, borderRadius: 8 }}
                            onClick={(e) => { onExpenseAdd(e, actualIndex); }}
                            title="Add row below"
                          >
                            <FaPlus />
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            className="p-1"
                            style={{ fontSize: 13, minWidth: 28, height: 28, borderRadius: 8 }}
                            onClick={() => onExpenseDelete(actualIndex)}
                            title="Delete row"
                          >
                            <FaTrash />
                          </Button>
                          <Button
                            variant="success"
                            size="sm"
                            className="p-1"
                            style={{ fontSize: 13, minWidth: 36, height: 28, borderRadius: 8 }}
                            onClick={() => onExpenseSave(actualIndex)}
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
          <div className="d-flex justify-content-center mt-3">
            <Button
              variant="primary"
              size="md"
              className="rounded-pill px-3"
              style={{ fontSize: 15, height: 36, borderRadius: 18 }}
              onClick={e => onExpenseAdd(e, Expenses.length - 1)}
            >
              <FaPlus className="me-2" /> Add New Row
            </Button>
          </div>
          <OptionsManager
            show={showParticularsManager}
            onHide={() => setShowParticularsManager(false)}
            type="expense"
            options={particularOptions}
            onOptionsChange={fetchParticularOptions}
          />
        </Card.Body>
      </Card>
    );

}