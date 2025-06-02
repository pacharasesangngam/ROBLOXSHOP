  //หน้าเติมเงินเข้าเว็บไซต์
  //มีให้ผู้ใช้กรอกจำนวนเงินที่ต้องการเติม โดยต้องกรอกเป็นตัวเลขเท่านั้น
  
  import React, { useState } from 'react';
  import { Input, Button, Card, Typography, message } from 'antd';
  import '../css/topup.css';
  import Topupicon from '../../assets/topupicon.png'

  const { Title, Text } = Typography;

  function Topup() {
    const [amount, setAmount] = useState('');
    const [isValid, setIsValid] = useState(false);

    const handleAmountChange = (e) => {
      const value = e.target.value;
      if (value.trim() === '' || isNaN(Number(value)) || Number(value) <= 0) {
        setIsValid(false);
      } else {
        setIsValid(true);
      }
      setAmount(value);
    };

    const handleTopup = async () => {
      const username = localStorage.getItem('loggedInUser');
      if (!username) {
        message.error('กรุณาเข้าสู่ระบบก่อนการเติมเงิน');
        return;
      }

      try {
        //เชื่อมต่อกับ API topup เพื่อเรียกใช้การทำงานของระบบเติมเงิน
        const response = await fetch('http://localhost:5000/api/topup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username,
            amount: Number(amount),
          }),
        });

        const result = await response.json();
        if (response.ok) {
          message.success(`เติมเงินสำเร็จ!`);
          setAmount('');
        } else {
          message.error('Error: ' + result.message);
        }
      } catch (error) {
        console.error('Error during request:', error);
        message.error('เกิดข้อผิดพลาดระหว่างการส่งคำขอ');
      }
    };
    
    //หน้าเว็บ
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
        <Card
          title={<Title level={3}>เติมเงิน</Title>}
          style={{ width: 400, textAlign: 'center', paddingTop: '20px'}}>
          <img src={Topupicon} alt="topupicon"/>
          <Text>กรอกจำนวนเงินที่ต้องการเติม</Text>
          <Input
            type="number"
            placeholder="กรอกจำนวนเงิน"
            value={amount}
            onChange={handleAmountChange}
            style={{ margin: '15px 0', textAlign: 'center' }}
          />
          <Button
            disabled={!isValid}
            onClick={handleTopup}
            className="topup-btn">
            ยืนยันการเติมเงิน
          </Button>
        </Card>
      </div>
    );
  }

  export default Topup;
