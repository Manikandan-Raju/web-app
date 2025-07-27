
import React, { useState } from 'react';


import { Container, Form, Button } from 'react-bootstrap';
import SavingsTracker from './savings';
import CreditTracker from './credit';
import ExpenseTracker from './expense';
import Summary from './summary';
import ExpensePivotTable from './pivot';

export default function Budget() {
    // Default to current month and year
    const today = new Date();
    const defaultMonth = today.getMonth(); // 0-indexed
    const defaultYear = today.getFullYear();
    const [selectedMonth, setSelectedMonth] = useState(defaultMonth);
    const [selectedYear, setSelectedYear] = useState(defaultYear);
    // Refresh key for summary and pivot
    const [refreshKey, setRefreshKey] = useState(0);
    // Handler to trigger refresh
    const handleDataSaved = () => setRefreshKey(k => k + 1);
    // Handle month navigation
    function handlePrevMonth() {
        let newMonth = selectedMonth - 1;
        let newYear = selectedYear;
        if (newMonth < 0) {
            newMonth = 11;
            newYear--;
        }
        setSelectedMonth(newMonth);
        setSelectedYear(newYear);
    }

    function handleNextMonth() {
        let newMonth = selectedMonth + 1;
        let newYear = selectedYear;
        if (newMonth > 11) {
            newMonth = 0;
            newYear++;
        }
        setSelectedMonth(newMonth);
        setSelectedYear(newYear);
    }

    // Month names
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    // Years: 25 years before and after current year
    const yearRange = 3;
    const yearOptions = [];
    for (let y = defaultYear - yearRange; y <= defaultYear + yearRange; y++) {
        yearOptions.push(y);
    }

    // Compose YYYY-MM string for children
    // Pass both the month string and a flag to show null/empty date rows
    const month = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}`;
    const showNullDate = true;

    return (
      <ErrorBoundary>
        <Container fluid className="d-flex flex-column justify-content-center align-items-center p-0" style={{ minHeight: '100vh', minWidth: '100%', padding: 0, margin: 0, flex: 1 }}>
          <div className="d-flex justify-content-center align-items-center mb-2" style={{ background: 'linear-gradient(90deg, #f1f5fa 60%, #e0e7ef 100%)', borderRadius: 16, padding: '0.3rem 0.5rem', boxShadow: '0 2px 12px 0 rgba(60,72,100,0.08)', width: '100%', maxWidth: 480, minWidth: 0, marginBottom: 0, border: '1.5px solid #e2e8f0', overflowX: 'auto', gap: 4 }}>
            <Button variant="light" className="px-1 py-0" style={{ fontWeight: 900, fontSize: 20, border: '1.5px solid #cbd5e1', borderRadius: 7, background: '#f8fafc', color: '#2d3748', boxShadow: '0 2px 8px 0 rgba(60,72,100,0.06)', minWidth: 32, minHeight: 32 }} onClick={handlePrevMonth} aria-label="Previous Month">
              <span aria-hidden="true" style={{ display: 'inline-block', fontSize: 20, fontWeight: 900 }}>&#8592;</span>
            </Button>
            <Form.Select
              id="month-select"
              value={selectedMonth}
              onChange={e => setSelectedMonth(Number(e.target.value))}
              className="w-auto mx-1"
              style={{ minWidth: 90, maxWidth: 120, fontWeight: 700, fontSize: 15, borderRadius: 8, border: '1.5px solid #cbd5e1', background: '#fff', boxShadow: '0 1px 4px 0 rgba(60,72,100,0.04)', padding: '2px 8px' }}
            >
              {monthNames.map((name, idx) => (
                <option key={idx} value={idx}>{name}</option>
              ))}
            </Form.Select>
            <span style={{ fontWeight: 700, color: '#4a5568', fontSize: 15, margin: '0 2px' }}>/</span>
            <Form.Select
              id="year-select"
              value={selectedYear}
              onChange={e => setSelectedYear(Number(e.target.value))}
              className="w-auto mx-1"
              style={{ minWidth: 60, maxWidth: 80, fontWeight: 700, fontSize: 15, borderRadius: 8, border: '1.5px solid #cbd5e1', background: '#fff', boxShadow: '0 1px 4px 0 rgba(60,72,100,0.04)', padding: '2px 8px' }}
            >
              {yearOptions.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </Form.Select>
            <Button variant="light" className="px-1 py-0" style={{ fontWeight: 900, fontSize: 20, border: '1.5px solid #cbd5e1', borderRadius: 7, background: '#f8fafc', color: '#2d3748', boxShadow: '0 2px 8px 0 rgba(60,72,100,0.06)', minWidth: 32, minHeight: 32 }} onClick={handleNextMonth} aria-label="Next Month">
              <span aria-hidden="true" style={{ display: 'inline-block', fontSize: 20, fontWeight: 900 }}>&#8594;</span>
            </Button>
          </div>
          <div style={{ position: 'absolute', right: -20, top: -20, opacity: 0.06, fontSize: 90, fontWeight: 900, color: '#4a5568', pointerEvents: 'none', userSelect: 'none', filter: 'blur(1.5px)' }}>₹</div>
          {/* Single column layout: stack all sections vertically */}
          <Container fluid className="h-100 d-flex flex-column" style={{ minHeight: 0, minWidth: '100%', maxWidth: 480, padding: 0, margin: 0, gap: 10, overflowX: 'auto' }}>
            <div style={{ width: '100%', marginBottom: 8 }}>
              <Summary month={month} refreshKey={refreshKey} />
            </div>
            <div style={{ width: '100%', marginBottom: 8 }}>
              <CreditTracker month={month} showNullDate={showNullDate} onDataSaved={handleDataSaved} />
            </div>
            <div style={{ width: '100%', marginBottom: 8 }}>
              <SavingsTracker month={month} showNullDate={showNullDate} onDataSaved={handleDataSaved} />
            </div>
            <div style={{ width: '100%', marginBottom: 8 }}>
              <ExpensePivotTable month={month} refreshKey={refreshKey} />
            </div>
            <div style={{ width: '100%', marginBottom: 8 }}>
              <ExpenseTracker month={month} showNullDate={showNullDate} onDataSaved={handleDataSaved} />
            </div>
          </Container>
        </Container>
      </ErrorBoundary>
    );
}

// Simple error boundary for runtime errors in children
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    // Optionally log error
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ color: '#b91c1c', background: '#fef2f2', border: '1.5px solid #fecaca', borderRadius: 12, padding: 24, margin: 24, textAlign: 'center', fontWeight: 700 }}>
          <div style={{ fontSize: 22, marginBottom: 8 }}>Something went wrong.</div>
          <div style={{ fontSize: 15 }}>{this.state.error?.message || 'Unknown error.'}</div>
        </div>
      );
    }
    return this.props.children;
  }
}