//หน้าลงทะเบียนสำหรับผู้ใช้ที่ยังไม่มีบัญชี มีให้กรอก username & password & confirm password

import React, { useState } from 'react';
import '../css/register.css';
import Character from '../../assets/character.gif';
import Error from '../../assets/error.png';

function Register({ onClose, openLoginModal, onLoginSuccess }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    //เช็คว่าลงทะเบียนสำเร็จหรือไม่
    const handleSubmit = async (e) => {
        e.preventDefault();

        //เช็ค password & confirm password ว่าตรงกันมั้ย
        if (password !== confirmPassword) {
            setErrorMessage('รหัสผ่านไม่ตรงกัน');
            return;
        }

        //เชื่อมต่อกับ API สำหรับการทำงานของฟังก์ชันลงทะเบียน
        try {
            const response = await fetch('http://localhost:5000/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (response.ok) {
                setErrorMessage('');
                onLoginSuccess(username);
                onClose();
            } else {
                setErrorMessage(data.message || 'เกิดข้อผิดพลาดในการลงทะเบียน');
            }
        } catch (error) {
            console.error('Error:', error);
            setErrorMessage('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้');
        }
    };

    //หน้าเว็บ
    return (
      <div className="rmodal-overlay">
          <div className="rmodal-content">
              <button className="close-button" onClick={onClose}>×</button>
              <div className="rmodal-body">
                  <img src={Character} alt="Character" className="rmodal-image"/>
                  <form className="register-form" onSubmit={handleSubmit}>
                      <h2 style={{fontWeight: 'bold'}}>ลงทะเบียน</h2>

                      {errorMessage && <p className='errormessage'><img src={Error} style={{width: '17px', marginRight: '10px'}}/>{errorMessage}</p>}

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

                      <div className="form-group">
                          <label htmlFor="cfpassword">ยืนยันรหัสผ่าน</label>
                          <input
                              type="password"
                              id="cfpassword"
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              required
                          />
                      </div>

                      <button type="submit" className="register-button">ลงทะเบียน</button>
                      
                      <div className='haveaccount'>
                        <p className='login'>มีบัญชีอยู่แล้ว? <button className='tologin' onClick={openLoginModal}>เข้าสู่ระบบ</button></p>
                      </div>
                  </form>
              </div>
          </div>
      </div>
    );
}

export default Register;
