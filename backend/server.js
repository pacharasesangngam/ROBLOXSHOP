const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs'); 
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use('/assets', express.static(path.join(__dirname, 'assets')));

const getUsers = () => {
    const data = fs.readFileSync(path.join(__dirname, 'users.json'), 'utf-8');
    return JSON.parse(data);
};

const saveUsers = (users) => {
    fs.writeFileSync(path.join(__dirname, 'users.json'), JSON.stringify(users, null, 2));
};

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const users = getUsers();
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        return res.json({ message: 'เข้าสู่ระบบสำเร็จ', token: 'sample-token' });
    } else {
        return res.status(401).json({ message: 'ชื่อผู้ใช้ หรือรหัสผ่านไม่ถูกต้อง' });
    }
});

app.post('/api/register', (req, res) => {
    const { username, password } = req.body;
    
    // ดึงข้อมูลผู้ใช้งานปัจจุบัน
    const users = getUsers();
    
    // ตรวจสอบว่าชื่อผู้ใช้งานซ้ำหรือไม่
    const userExists = users.some(u => u.username === username);
    if (userExists) {
        return res.status(400).json({ message: 'ชื่อผู้ใช้นี้มีอยู่แล้ว' });
    }
    
    const newUser = { username, password};
    users.push(newUser);
    
    // บันทึกข้อมูลผู้ใช้
    saveUsers(users);

    // ส่งคำตอบกลับ
    res.status(201).json({ message: 'ลงทะเบียนสำเร็จ', user: newUser });
});


app.get('/api/product', (req, res) => {
  try {
      //อ่านข้อมูลสินค้า
      const products = JSON.parse(fs.readFileSync('./product.json', 'utf-8'));

      //คำนวณ stock ตามจำนวน idPasses
      const updatedProducts = products.map(product => ({
          ...product,
          stock: product.idPasses ? product.idPasses.length : 0, //ใช้ idPasses.length เป็น stock
      }));

      //ส่งข้อมูลกลับ
      res.json(updatedProducts);
  } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ message: 'Error fetching products' });
  }
});

app.post('/api/addidpass', (req, res) => {
  const { productId, usergame, passwordgame, validity, guarantee, details } = req.body;

  // ตรวจสอบว่าได้รับข้อมูลครบถ้วนหรือไม่
  if (!productId || !usergame || !passwordgame || !validity || !guarantee || !details) {
      return res.status(400).json({ message: 'ข้อมูลไม่ครบถ้วน' });
  }

  // อ่านข้อมูลสินค้าใน product.json
  const products = JSON.parse(fs.readFileSync('./product.json', 'utf-8') || '[]');

  // ค้นหาสินค้าที่ตรงกับ productId
  const product = products.find((item) => item.id === productId);

  if (!product) {
      return res.status(404).json({ message: 'ไม่พบสินค้าที่เลือก' });
  }

  // สร้าง ID Pass ใหม่
  const newIdPass = { usergame, passwordgame, validity, guarantee, details };

  // เพิ่ม idPass ลงในรายการ idPasses ของสินค้านั้น
  if (product.idPasses) {
      product.idPasses.push(newIdPass);
  } else {
      product.idPasses = [newIdPass];
  }

  // เขียนข้อมูลกลับไปในไฟล์ product.json
  fs.writeFileSync('./product.json', JSON.stringify(products, null, 2));

  // ส่งคำตอบกลับ
  res.status(201).json({ message: 'เพิ่มรายการสินค้าเรียบร้อย', idPass: newIdPass });
});


app.get('/api/topuphistory', (req, res) => {
    //อ่านข้อมูลจากไฟล์ topuphistory.json
    const topuphtr = JSON.parse(fs.readFileSync('./topuphistory.json', 'utf-8'));
    
    //ดึงค่า username จาก query parameters
    const username = req.query.username;
  
    //ถ้าไม่มี username หรือไม่พบข้อมูล
    if (!username) {
      return res.status(400).json({ message: 'Username is required' });
    }
  
    //กรองข้อมูลที่ตรงกับ username
    const filteredHistory = topuphtr.filter(item => item.username === username);
  
    //ถ้าไม่มีข้อมูลสำหรับ username นั้นๆ
    if (filteredHistory.length === 0) {
      return res.status(404).json({ message: 'No topup history found for this user' });
    }
  
    //ส่งข้อมูลประวัติการเติมเงินกลับไป
    res.json(filteredHistory);
  });
  
  app.get('/api/total-sale', (req, res) => {
    try {
        //อ่านข้อมูลจากไฟล์ buyhistory.json
        const buyHistory = JSON.parse(fs.readFileSync('./buyhistory.json', 'utf-8') || '[]');

        //คำนวณยอดขายรวมจาก price * amount
        const totalSale = buyHistory.reduce((total, order) => {
            return total + (order.price * order.amount);
        }, 0);

        //ส่งข้อมูลยอดขายรวมกลับไป
        res.json({ totalSale });
    } catch (error) {
        console.error("Error reading buyhistory.json:", error);
        res.status(500).json({ message: 'ไม่สามารถดึงยอดขายได้' });
    }
});

app.get('/api/buyhistory', (req, res) => {
    try {
      const buyhistory = JSON.parse(fs.readFileSync('./buyhistory.json', 'utf-8'));
      res.status(200).json(buyhistory);
    } catch (error) {
      console.error("Error reading buy history:", error);
      res.status(500).json({ message: 'Failed to fetch buy history' });
    }
  });

//API สำหรับเติมเงิน
app.post('/api/topup', (req, res) => {
    const { username, amount } = req.body;
  
    //ตรวจสอบข้อมูลที่ส่งมา
    if (!username || !amount || amount <= 0) {
      return res.status(400).json({ message: 'กรุณากรอกข้อมูลที่ถูกต้อง' });
    }
  
    //อ่านข้อมูลจากไฟล์ topuphistory.json
    fs.readFile(path.join(__dirname, 'topuphistory.json'), 'utf8', (err, data) => {
      if (err) {
        //ถ้าไฟล์ไม่มี หรือเกิดข้อผิดพลาดในการอ่านไฟล์
        return res.status(500).json({ message: 'เกิดข้อผิดพลาดในการอ่านข้อมูล' });
      }
  
      let topupHistory = [];
      try {
        //แปลงข้อมูล JSON
        topupHistory = JSON.parse(data);
      } catch (parseErr) {
        //ถ้าไฟล์ JSON ไม่สามารถแปลงเป็น JSON ได้
        return res.status(500).json({ message: 'ข้อมูลไม่ถูกต้อง' });
      }
  
      //คำนวณยอดเงินใหม่
      let newBalance = amount; //ถ้าไม่เคยมีการเติมเงินมาก่อน
  
      //ตรวจสอบประวัติการเติมเงินของผู้ใช้
      const userHistory = topupHistory.filter(record => record.username === username);
      if (userHistory.length > 0) {
        newBalance = userHistory.reduce((total, record) => total + record.amount, 0) + amount;
      }
  
      //เพิ่มข้อมูลการเติมเงินใหม่ลงในประวัติ
      const newTopup = {
        via: "เว็บไซต์ ShroomShop",
        username: username,
        amount: amount,
        date: new Date().toLocaleString(),
      };
      topupHistory.push(newTopup);
  
      //เขียนข้อมูลกลับไปในไฟล์
      fs.writeFile(path.join(__dirname, 'topuphistory.json'), JSON.stringify(topupHistory, null, 2), (err) => {
        if (err) {
          return res.status(500).json({ message: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล' });
        }
  
        //ส่งข้อมูลกลับไปยัง client
        res.json({ message: 'เติมเงินสำเร็จ'});
      });
    });
  });
  
  app.post('/api/buyhistory', (req, res) => {
    const { username, name, price, amount, usergame, passwordgame } = req.body;

    if (!username || !name || !price || !amount || !usergame || !passwordgame) {
        return res.status(400).json({ message: "ข้อมูลไม่ครบถ้วน" });
    }

    try {
        // อ่านข้อมูลผู้ใช้
        const users = JSON.parse(fs.readFileSync('./users.json', 'utf-8') || '[]');
        const userIndex = users.findIndex(user => user.username === username);

        if (userIndex === -1) {
            console.log('ไม่พบผู้ใช้:', username);
            return res.status(404).json({ message: "ไม่พบผู้ใช้งาน" });
        }

        const user = users[userIndex];

        // อ่านข้อมูลสินค้า
        const products = JSON.parse(fs.readFileSync('./product.json', 'utf-8') || '[]');
        const productIndex = products.findIndex(product => product.name === name);

        if (productIndex === -1) {
            console.log('ไม่พบสินค้า:', name);
            return res.status(404).json({ message: "ไม่พบสินค้านี้ในระบบ" });
        }

        const product = products[productIndex];

        if (!product.idPasses || product.idPasses.length < amount) {
            console.log('สินค้ามีไม่เพียงพอ:', product.idPasses.length, 'ต้องการ:', amount);
            return res.status(400).json({ message: "สินค้ามีไม่เพียงพอ" });
        }

        // ลบ idPass และหักยอดเงิน
        const removedIdPasses = product.idPasses.splice(0, amount);

        // บันทึกข้อมูลใหม่
        fs.writeFileSync('./users.json', JSON.stringify(users, null, 2));
        fs.writeFileSync('./product.json', JSON.stringify(products, null, 2));

        // บันทึกประวัติการซื้อ
        const buyHistory = JSON.parse(fs.readFileSync('./buyhistory.json', 'utf-8') || '[]');
        const newOrder = {
            username,
            name,
            price,
            amount,
            usergame,
            passwordgame,
            date: new Date(),
        };
        buyHistory.push(newOrder);
        fs.writeFileSync('./buyhistory.json', JSON.stringify(buyHistory, null, 2));

        console.log('การสั่งซื้อสำเร็จ:', newOrder);
        return res.status(200).json({
            message: "สั่งซื้อสำเร็จ กรุณารับไอดีและรหัสในหน้าประวัติการซื้อ",
            order: newOrder,
            removedIdPasses,
        });
    } catch (error) {
        console.error('Error processing order:', error);
        return res.status(500).json({ message: 'เกิดข้อผิดพลาดในการสั่งซื้อ' });
    }
});


  app.get('/api/users', (req, res) => {
    try {
        const users = getUsers();
        res.json(users); //ส่งข้อมูลผู้ใช้ทั้งหมดพร้อมยอดเงิน
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Error fetching users' });
    }
});

app.get('/api/products/count', (req, res) => {
    try {
        const products = JSON.parse(fs.readFileSync('./product.json', 'utf-8'));
        const totalProducts = products.length;
        res.json({ total: totalProducts });
    } catch (error) {
        console.error('Error fetching product count:', error);
        res.status(500).json({ message: 'Error fetching product count' });
    }
});

//นับจำนวน IdPasses
app.post('/api/buyhistory', (req, res) => {
  try {
      const products = JSON.parse(fs.readFileSync('./product.json', 'utf-8'));
      const product = products.find(p => p.id === parseInt(req.body.productId));

      if (!product || product.stock <= 0) {
          return res.status(400).json({ message: 'สินค้าหมด' });
      }

      // ลด stock และอัปเดต idPasses
      product.stock -= 1;
      if (product.idPasses && product.idPasses.length > 0) {
          product.idPasses.pop(); // ลบรายการล่าสุดใน idPasses
      }

      // เขียนกลับไปที่ไฟล์ product.json
      fs.writeFileSync('./product.json', JSON.stringify(products, null, 2), 'utf-8');

      res.json({ message: 'สั่งซื้อสินค้าสำเร็จ', stock: product.stock });
  } catch (error) {
      console.error('Error processing order:', error);
      res.status(500).json({ message: 'Error processing order' });
  }
});
app.delete('/api/buyhistory/:usergame', (req, res) => {
  const { usergame } = req.params;

  if (!usergame) {
    return res.status(400).json({ message: 'usergame is required' });
  }

  try {
    let buyHistory = JSON.parse(fs.readFileSync('./buyhistory.json', 'utf-8'));

    // Filter out the item by matching usergame
    const filteredHistory = buyHistory.filter(item => item.usergame !== usergame);

    // Write the filtered data back to the file
    fs.writeFileSync('./buyhistory.json', JSON.stringify(filteredHistory));

    res.status(200).json({ message: 'Deleted successfully' });
  } catch (error) {
    console.error('Error deleting data:', error);
    res.status(500).json({ message: 'Error while processing delete' });
  }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
