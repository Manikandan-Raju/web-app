import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import SIP from './components/sip.jsx';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Gold from './components/gold.jsx'
import Index from './components/index.jsx'
import Savings from './components/savings.jsx'
import Container from 'react-bootstrap/Container';

function App() {
  return (
    <Container>
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="sip" element={<SIP />} />
          <Route path="gold" element={<Gold />} />
          <Route path="savings" element={<Savings />} />
        </Routes>
      </BrowserRouter>
    </Container>
  )
}



export default App;
