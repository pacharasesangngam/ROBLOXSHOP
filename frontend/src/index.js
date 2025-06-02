//หน้าหลักที่แสดงเส้นทางการเข้าถึงของแต่ละหน้าเว็บ

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import './index.css';
import App from './layouts/App';
import Home from './components/js/home';
import Store from './components/js/store';
import BuyHistory from './components/js/buyhistory';
import TopupHistory from './components/js/topuphistory';
import Topup from './components/js/topup';
import Product from './components/js/product';
import AddProduct from './components/js/AddProduct';
import reportWebVitals from './reportWebVitals';


function AppWithAnimation() {
  const location = useLocation();

  return (
    <AnimatePresence>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<App />} >
          <Route index element={<Home />} />
          <Route path="store" element={<Store />} />
          <Route path="buyhistory" element={<BuyHistory />} />
          <Route path="topuphistory" element={<TopupHistory />} />
          <Route path="topup" element={<Topup />} />
          <Route path="product" element={<Product />} />
          <Route path="addproduct" element={<AddProduct />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Router>
    <AppWithAnimation />
  </Router>
);

reportWebVitals();
