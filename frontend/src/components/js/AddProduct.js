//หน้าเพิ่มรายการสินค้า สำหรับแอดมิน หรือผู้ขาย สามารถเพิ่มจำนวนของรายการสินค้าที่ต้องการได้

import React, { useState, useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import {
  Container,
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Typography,
  Box,
  Alert,
  Card,
  CardContent,
  CardActions,
} from '@mui/material';

function AddIdPass() {
  //ประกาศตัวแปร
  const [products, setProducts] = useState([]);
  const [productId, setProductId] = useState('');
  const [usergame, setUsergame] = useState('');
  const [passwordgame, setPasswordgame] = useState('');
  const [validity, setValidity] = useState('');
  const [guarantee, setGuarantee] = useState('');
  const [details, setDetails] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);

  //ดึงข้อมูลสินค้าจากไฟล์ product.json
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/product');
        setProducts(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        setError('ไม่สามารถดึงข้อมูลสินค้าได้');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  //แสดงข้อความแจ้งเตือน error หรือ success
  const handleMessage = (type, message) => {
    if (type === 'error') {
      setError(message);
      setTimeout(() => setError(''), 5000);
    } else {
      setSuccess(message);
      setTimeout(() => setSuccess(''), 5000);
    }
  };

  //เมื่อกดเพิ่มรายการให้เช็คว่ากรอกข้อมูลครบทุกช่องมั้ย
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!productId || !usergame || !passwordgame || !validity || !guarantee || !details) {
      handleMessage('error', 'กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }
    const newIdPass = { productId, usergame, passwordgame, validity, guarantee, details };
    try {
      await axios.post('http://localhost:5000/api/addidpass', newIdPass);
      //ถ้าเพิ่มรายการสำเร็จจะมีข้อความ success
      handleMessage('success', 'ID Pass ถูกเพิ่มเรียบร้อยแล้ว');
      //set ทุกช่องเป็นค่าว่าง
      setUsergame('');
      setPasswordgame('');
      setValidity('');
      setGuarantee('');
      setDetails('');
      setProductId('');
    } catch (error) {
      //ถ้าไม่สำเร็จจะมีข้อความ error
      handleMessage('error', 'ไม่สามารถเพิ่ม ID Pass ได้');
    }
  };

  //กำหนดเพื่อให้ทุกองค์ประกอบใช้ฟ้อนต์ prompt
  const theme = createTheme({
    typography: {
      fontFamily: 'Prompt',
    },
  });

  //หน้าเว็บ
  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Card>
          <CardContent>
            {/*หัวข้อ เพิ่มรายการสินค้า*/}
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
              เพิ่มรายการสินค้า
            </Typography>
            {/*error message & success message*/}
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <FormControl fullWidth>
                {/*เลือกรายการสินค้าที่ต้องการเพิ่มจำนวน*/}
                <InputLabel id="product-select-label">เลือกรายการสินค้า</InputLabel>
                <Select
                  labelId="product-select-label"
                  value={productId}
                  onChange={(e) => setProductId(e.target.value)}
                  disabled={loading}
                >
                  {loading ? (
                    <MenuItem value="">กำลังโหลด...</MenuItem>
                  ) : (
                    products.map((product) => (
                      <MenuItem key={product.id} value={product.id}>{product.name}</MenuItem>
                    ))
                  )}
                </Select>
              </FormControl>
              {/*กรอกไอดีเกม*/}
              <TextField
                label="ไอดีเกม"
                value={usergame}
                onChange={(e) => setUsergame(e.target.value)}
                fullWidth
              />
              {/*กรอกรหัสผ่านของไอดีเกมนั้นๆ*/}
              <TextField
                label="รหัสผ่านเกม"
                value={passwordgame}
                onChange={(e) => setPasswordgame(e.target.value)}
                fullWidth
                type="password"
              />
              {/*กรอกระยะเวลาการใข้งานของไอดี*/}
              <TextField
                label="ระยะเวลาการใช้งาน"
                value={validity}
                onChange={(e) => setValidity(e.target.value)}
                fullWidth
              />
              {/*กรอกระยะเวลารับประกันว่าไอดีจะใช้งานได้ตามระยะเวลาที่บอกไว้*/}
              <TextField
                label="การรับประกัน"
                value={guarantee}
                onChange={(e) => setGuarantee(e.target.value)}
                fullWidth
              />
              {/*กรอกรายละเอียดเพิ่มเติม*/}
              <TextField
                label="รายละเอียด"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                fullWidth
                multiline
                rows={4}
              />
            </Box>
          </CardContent>
          <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
            {/*ปุ่ม เพิ่มรายการ*/}
            <Button
              type="submit"
              variant="contained"
              sx={{
                backgroundColor: '#282c34',
                color: 'white',
                fontSize: '15px',
                '&:hover': {
                  backgroundColor: '#ffe600',
                  color: '#282c34',
                  transform: 'scale(1.04)',
                  transition: 'transform 0.3s ease',
                },
              }}
              onClick={handleSubmit}
            >
              เพิ่มรายการ
            </Button>
          </CardActions>
        </Card>
      </Container>
    </ThemeProvider>
  );
}

export default AddIdPass;
