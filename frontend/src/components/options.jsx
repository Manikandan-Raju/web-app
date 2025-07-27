import React, { useState } from 'react';
import { Modal, Button, Form, Table } from 'react-bootstrap';

export default function OptionsManager({ show, onHide, type, options, onOptionsChange }) {
    const [newName, setNewName] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editingName, setEditingName] = useState('');

// Set API base URL from environment only (define outside component for stable reference)
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

    function handleAdd() {
        if (!newName.trim()) return;
        fetch(`${API_BASE_URL}/savings/particular-options/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: newName, type })
        })
            .then(res => res.json())
            .then(() => {
                setNewName('');
                onOptionsChange();
            });
    }

    function handleEdit(id, name) {
        setEditingId(id);
        setEditingName(name);
    }

    function handleEditSave() {
        fetch(`${API_BASE_URL}/savings/particular-options/`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: editingId, name: editingName, type })
        })
            .then(res => res.json())
            .then(() => {
                setEditingId(null);
                setEditingName('');
                onOptionsChange();
            });
    }

    function handleDelete(id) {
        fetch(`${API_BASE_URL}/savings/particular-options/`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
        })
            .then(() => onOptionsChange());
    }

    return (
        <Modal show={show} onHide={onHide} centered dialogClassName="modern-modal">
            <Modal.Header closeButton style={{ background: 'linear-gradient(90deg, #e0e7ef 60%, #f8fafc 100%)', borderTopLeftRadius: 18, borderTopRightRadius: 18, border: 0, boxShadow: '0 2px 8px #e0e7ef' }}>
                <Modal.Title style={{ fontWeight: 900, fontSize: 22, color: '#2d3748', letterSpacing: 1, textShadow: '0 2px 8px #e0e7ef' }}>Manage Options</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ef 100%)', borderRadius: 18, boxShadow: '0 4px 24px 0 rgba(60,72,100,0.10)', padding: '1.5rem 1.2rem' }}>
                <Form className="mb-3 d-flex gap-2 align-items-center" style={{ justifyContent: 'center' }}>
                    <Form.Control
                        type="text"
                        placeholder="Add new option"
                        value={newName}
                        onChange={e => setNewName(e.target.value)}
                        maxLength={100}
                        style={{ borderRadius: 16, fontSize: 16, padding: '7px 16px', minWidth: 0, background: '#fff', border: '1px solid #e2e8f0', boxShadow: '0 1px 4px #e0e7ef' }}
                    />
                    <Button variant="primary" style={{ borderRadius: 16, fontWeight: 700, padding: '7px 22px', fontSize: 16, boxShadow: '0 2px 8px #e0e7ef' }} onClick={handleAdd}>Add</Button>
                </Form>
                <div style={{ width: '100%', overflowX: 'auto' }}>
                    <style>{`
                        @media (max-width: 1024px) {
                            .options-table th, .options-table td {
                                font-size: 13px !important;
                                padding: 6px 4px !important;
                            }
                            .options-table {
                                min-width: 320px !important;
                            }
                        }
                        @media (max-width: 820px) {
                            .options-table th, .options-table td {
                                font-size: 12px !important;
                                padding: 5px 2px !important;
                            }
                            .options-table {
                                min-width: 260px !important;
                            }
                        }
                    `}</style>
                    <Table size="sm" bordered hover className="mb-0 options-table" style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', boxShadow: '0 2px 12px 0 rgba(60,72,100,0.08)', fontFamily: 'Inter, sans-serif', fontSize: 16, minWidth: 400 }}>
                    <tbody>
                        {options.map(opt => (
                            <tr key={opt.id} style={{ verticalAlign: 'middle' }}>
                                <td style={{ width: '60%', fontSize: 16, padding: '8px 14px', background: editingId === opt.id ? '#e0e7ef' : undefined, borderRadius: 10 }}>
                                    {editingId === opt.id ? (
                                        <Form.Control
                                            value={editingName}
                                            onChange={e => setEditingName(e.target.value)}
                                            size="sm"
                                            maxLength={100}
                                            style={{ borderRadius: 12, fontSize: 16, padding: '4px 10px', background: '#fff', border: '1px solid #cbd5e1', boxShadow: '0 1px 4px #e0e7ef' }}
                                            autoFocus
                                        />
                                    ) : (
                                        <span style={{ fontWeight: 600, color: '#2d3748' }}>{opt.name}</span>
                                    )}
                                </td>
                                <td style={{ width: '40%', textAlign: 'right', padding: '8px 10px', background: editingId === opt.id ? '#e0e7ef' : undefined, borderRadius: 10 }}>
                                    <div className="d-flex justify-content-end align-items-center gap-2">
                                        {editingId === opt.id ? (
                                            <Button variant="success" size="sm" style={{ borderRadius: 12, fontWeight: 700, padding: '4px 18px', fontSize: 15, boxShadow: '0 2px 8px #e0e7ef' }} onClick={handleEditSave}>Save</Button>
                                        ) : (
                                            <Button variant="outline-secondary" size="sm" style={{ borderRadius: 12, fontWeight: 700, padding: '4px 18px', fontSize: 15 }} onClick={() => handleEdit(opt.id, opt.name)}>Edit</Button>
                                        )}
                                        <Button variant="outline-danger" size="sm" style={{ borderRadius: 12, fontWeight: 700, padding: '4px 18px', fontSize: 15 }} onClick={() => handleDelete(opt.id)}>Delete</Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {options.length === 0 && (
                            <tr>
                                <td colSpan={2} className="text-center text-muted" style={{ fontSize: 16, padding: '14px 0' }}>
                                    No options yet.
                                </td>
                            </tr>
                        )}
                    </tbody>
                    </Table>
                </div>
            </Modal.Body>
            <Modal.Footer style={{ background: 'linear-gradient(90deg, #e0e7ef 60%, #f8fafc 100%)', borderBottomLeftRadius: 18, borderBottomRightRadius: 18, border: 0 }}>
                <Button variant="secondary" style={{ borderRadius: 16, fontWeight: 700, padding: '7px 28px', fontSize: 16 }} onClick={onHide}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
}
