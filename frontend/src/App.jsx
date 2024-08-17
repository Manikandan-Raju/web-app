import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import SIP from './components/sip.jsx';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Gold from './components/gold.jsx'
import Index from './components/index.jsx'
function App() {
  return(
  <BrowserRouter>
    <Routes>
            <Route path="/" element={<Index />} />
            <Route path="sip" element={<SIP />} />
            <Route path="gold" element={<Gold />} />
            {/* <Route path="blogs" element={<Blogs />} />
            <Route path="contact" element={<Contact />} />
            <Route path="*" element={<NoPage />} /> */}
      </Routes>
    </BrowserRouter>
  )
}



export default App;
