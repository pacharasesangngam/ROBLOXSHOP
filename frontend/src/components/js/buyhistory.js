//หน้าแสดงประวัติการซื้อสินค้าของผู้ใช้คนนั้นๆ

import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import Swal from 'sweetalert2';
import { motion } from 'framer-motion';
import '../../layouts/App';
import '../css/history.css';
import Bin from '../../assets/bin.png';

function BuyHistory() {
  const [buyhtr, setBuyHistory] = useState([]); //เก็บข้อมูลประวัติการซื้อ
  const { loggedInUser } = useOutletContext(); //ดึงค่าชื่อผู้ใช้จาก App.js

  //ดึงข้อมูลประวัติการสั่งซื้อสินค้าจากไฟล์ buyhistory.json เฉพาะของผู้ใช้ที่กำลังเข้าสู่ระบบอยู่
  useEffect(() => {
    if (!loggedInUser) return;

    fetch('http://localhost:5000/api/buyhistory')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        const filteredData = data.filter(item => item.username === loggedInUser);
        setBuyHistory(filteredData);
      })
      .catch((error) => console.error('Error fetching buy history:', error));
  }, [loggedInUser]);

  //ลบประวัติการสั่งซื้อ 
  //การลบนี้แค่จะลบออกจากหน้าเว็บเฉยๆ ไม่ได้ลบออกจาก backend มีไว้เผื่อผู้ใช้ไม่ต้องการเห็น
  const handleDelete = async (usergame) => {
    if (!usergame) {
      console.error('Invalid usergame');
      return;
    }

    //ถาม confirmation ก่อนลบ
    Swal.fire({
      title: 'ยืนยันการลบ',
      text: 'คุณต้องการลบข้อมูลนี้หรือไม่?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'ยกเลิก',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(`http://localhost:5000/api/buyhistory/${encodeURIComponent(usergame)}`, {
            method: 'DELETE',
          });

          //ลบข้อมูลสำเร็จ
          if (response.ok) {
            Swal.fire({
              icon: 'success',
              title: 'ลบข้อมูลสำเร็จ',
              showConfirmButton: false,
              timer: 1500,
            });

            setBuyHistory((prevHistory) => prevHistory.filter((item) => item.usergame !== usergame));
          } else {
            //ลบไม่สำเร็จ
            Swal.fire({
              icon: 'error',
              title: 'ไม่สามารถลบข้อมูลได้',
              text: 'เกิดข้อผิดพลาดในเซิร์ฟเวอร์',
            });
          }
        } catch (error) {
          console.error('Error deleting buy history:', error);
          Swal.fire({
            icon: 'error',
            title: 'เกิดข้อผิดพลาด',
            text: 'ไม่สามารถลบข้อมูลได้',
          });
        }
      }
    });
  };

  //หน้าเว็บ
  return (
    <div className="buy-history-container">
      <h1 className="title">ประวัติการซื้อ</h1>
      <div className="title-container">
        {loggedInUser ? (
          <p className="user-name">ผู้ใช้ : <span>{loggedInUser}</span></p>
        ) : (
          <p className="user-name">กรุณาเข้าสู่ระบบ</p>
        )}
      </div>

      {/*ตารางแสดงประวัติการสั่งซื้อ*/}
      <div className="table-container">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <table className="order-table">
            <thead>
              <tr>
                <th>รายการ</th>
                <th>ราคา</th>
                <th>วันที่</th>
                <th>ID เกม</th>
                <th>รหัสผ่าน</th>
                <th>จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {buyhtr.length > 0 ? (
                buyhtr.map((buyhistory) => (
                  <motion.tr
                    key={buyhistory.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <td>{buyhistory.name}</td>
                    <td>{buyhistory.price} บาท</td>
                    <td>{new Date(buyhistory.date).toLocaleString()}</td>
                    <td>{buyhistory.usergame}</td>
                    <td>{buyhistory.passwordgame}</td>
                    <td>
                      <button
                        className="delete-button"
                        onClick={() => handleDelete(buyhistory.usergame)}>
                        <img src={Bin} alt='binicon'/>  
                      </button>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="no-data">ไม่มีข้อมูล</td>
                </tr>
              )}
            </tbody>
          </table>
        </motion.div>
      </div>
    </div>
  );
}

export default BuyHistory;
