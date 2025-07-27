import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import SIP from './components/sip.jsx';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from './components/index.jsx'
import Budget from './components/budget.jsx'
import Container from 'react-bootstrap/Container';

function App() {
  return (
    <Container fluid>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Budget />} />
          <Route path="index" element={<Index />} />
          <Route path="sip" element={<SIP />} />
          <Route path="budget" element={<Budget />} />
        </Routes>
      </BrowserRouter>
    </Container>
  )
}



export default App;
