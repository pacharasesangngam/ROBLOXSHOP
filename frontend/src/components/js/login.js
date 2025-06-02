//หน้าต่างเข้าสู่ระบบ ให้ผู้ใช้กรอก username & password

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import '../css/login.css';
import Character from '../../assets/character.gif';
import Error from '../../assets/error.png';

function Login({ onClose, openRegisterModal, onLoginSuccess }) {
  //กำหนดตัวแปร
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  //ดึงข้อมูลการทำงานของระบบ login จาก API
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (response.ok) {
        onLoginSuccess(username);
      } else {
        setErrorMessage(data.message || 'เกิดข้อผิดพลาด');
      }
    } catch (error) {
      setErrorMessage('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้');
    }
  };

  //หน้าเว็บ
  return (
    <motion.div
      className="modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}>
      <motion.div
        className="modal-content"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.8 }}
        transition={{ duration: 0.3 }}>
        <button className="close-button" onClick={onClose}>×</button>
        <div className="modal-body">
          <img src={Character} alt="Character" className="modal-image"/>
          <form className="login-form" onSubmit={handleSubmit}>
            {/*หัวข้อ เข้าสู่ระบบ*/}
            <h2 style={{ fontWeight: 'bold' }}>เข้าสู่ระบบ</h2>
            {errorMessage && (
              <p className='errormessage'>
                <img src={Error} style={{ width: '17px', marginRight: '10px' }} alt="error" />
                {errorMessage}
              </p>
            )}
            {/*กรอกชื่อผู้ใช้*/}
            <div className="form-group">
              <label htmlFor="username">ชื่อผู้ใช้</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            {/*กรอกรหัสผ่าน*/}
            <div className="form-group">
              <label htmlFor="password">รหัสผ่าน</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="login-button">เข้าสู่ระบบ</button>
            <p className='register'>
              ยังไม่มีบัญชี? <button className='register' onClick={openRegisterModal}>ลงทะเบียน</button>
            </p>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default Login;
