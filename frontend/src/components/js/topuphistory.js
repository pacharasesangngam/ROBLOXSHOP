//หน้าแสดงประวัติการเติมเงิน โดยจะแสดงช่องทางการเติม จำนวนเงิน และวันเวลาที่เติมเงิน

import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { motion } from 'framer-motion';
import '../../layouts/App';
import '../css/history.css';

function TopupHistory() {
  const [topuphtr, setTopup] = useState([]);
  const { loggedInUser, currMoney } = useOutletContext();
  
  //ดึงข้อมูลประวัติการเติมเงินจากไฟล์ topuphistory โดยดึงเฉพาะของผู้ใช้คนนั้นๆ
  useEffect(() => {
    const fetchTopupHistory = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/topuphistory?username=${loggedInUser}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setTopup(data);
      } catch (error) {
        console.error('Error fetching topup history:', error);
      }
    };

    if (loggedInUser) {
      fetchTopupHistory();
    }
  }, [loggedInUser]);

  //หน้าเว็บ
  return (
    <div className="topup-history-container">
      <h1 className="title">ประวัติการเติมเงิน</h1>
      <div className="title-container">
        {/*แสดงชื่อผู้ใช้*/}
        <p className="user-name">ผู้ใช้ : <span>{loggedInUser}</span></p>
        {/*แสดงยอดเงินปัจจุบัน*/}
        <p className="currmoney">ยอดเงินปัจจุบัน : <span>{currMoney}</span></p> 
      </div>
      <div className="table-container">
      <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
        {/*ตารางแสดงประวัติการเติมเงิน*/}
        <table className="order-table">
          <thead>
            <tr>
              <th>ช่องทาง</th>
              <th>จำนวน</th>
              <th>วันที่</th>
            </tr> 
          </thead>
          <tbody>
            {topuphtr.length > 0 ? (
              topuphtr.map((topuphistory, index) => (
              <motion.tr
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                <td>{topuphistory.via}</td>
                <td>{topuphistory.amount} บาท</td>
                <td>{topuphistory.date}</td>
                </motion.tr>  
                
              ))
            ) : (
              <tr>
                <td colSpan="3" className="no-data">ไม่มีข้อมูล</td>
              </tr>
            )}
          </tbody>
        </table> 
        </motion.div>
      </div>
    </div>
  );
}

export default TopupHistory;
