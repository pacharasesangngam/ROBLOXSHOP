//หน้าหลักแสดงภาพโปรโมทร้าน & สถิติยอดขาย ผู้ใช้ และรายการสินค้าทั้งหมด & เมนูเติมเงิน & เมนูประวัติการซื้อ & สินค้าแนะนำ

import React, { useState, useEffect, useRef } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import banner1 from '../../assets/banner1.png';
import banner2 from '../../assets/banner2.png';
import banner3 from '../../assets/banner3.png';
import topup from '../../assets/topup.png';
import history from '../../assets/history.png';
import '../css/home.css';

function Home() {
  //กำหนดตัวแปร
  const banners = [banner1, banner2, banner3];
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const trackRef = useRef(null);
  const { handleRestrictedAccess } = useOutletContext();
  
  const [products, setProducts] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalSale, setTotalSale] = useState(0);

  const navigate = useNavigate();

  //ดึงข้อมูลเกี่ยวกับสินค้า และผู้ใช้ทั้งหมด
  useEffect(() => {
    //ข้อมูลสินค้า
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/product');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    //ข้อมูลผู้ใช้
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/users');
        const data = await response.json();
        setTotalUsers(data.length || 0);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    //นับจำนวนสินค้า
    const fetchProductCount = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/products/count');
        const data = await response.json();
        setTotalProducts(data.total || 0);
      } catch (error) {
        console.error('Error fetching product count:', error);
      }
    };

    //นับจำนวนยอดขาย
    const fetchTotalSale = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/total-sale');
        const data = await response.json();
        setTotalSale(data.totalSale || 0);
      } catch (error) {
        console.error('Error fetching total sale:', error);
      }
    };

    fetchProducts();
    fetchUsers();
    fetchProductCount();
    fetchTotalSale();
  }, []);

  //effectสำหรับเลื่อนBanner
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBannerIndex((prevIndex) => (prevIndex + 1) % banners.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [banners.length]);
  const recommendedProducts = products.filter((product) => product.recommend === 'yes');
  const handleProductClick = (product, e) => {
    e.preventDefault();
    console.log('Selected product:', product);
    handleRestrictedAccess(e, '/product', { product });
  };

  //หน้าเว็บ
  return (
    <div className="Home">
      {/*การเลื่อน banner*/}
      <div className="banner-slider">
        <div
          className="banner-track"
          ref={trackRef}
          style={{ transform: `translateX(-${currentBannerIndex * 100}%)` }}>
          {banners.map((banner, index) => (
            <img key={index} src={banner} alt={`banner${index}`} className="banner" />
          ))}
        </div>
      </div>

      {/*จำนวนผู้ใช้ ยอดขาย และจำนวนสินค้าทั้งหมด*/}
      <div className="static">
        <div className="total-user">
          <p style={{ fontWeight: 'bold' }}>ผู้ใช้งาน</p>
          <p style={{ fontSize: '19px' }}>{totalUsers} คน</p>
        </div>
        <div className="total-sale">
          <p style={{ fontWeight: 'bold' }}>ยอดขาย</p>
          <p style={{ fontSize: '19px' }}>{totalSale.toLocaleString()} บาท</p>
        </div>
        <div className="total-stock">
          <p style={{ fontWeight: 'bold' }}>สินค้าทั้งหมด</p>
          <p style={{ fontSize: '19px' }}>{totalProducts} รายการ</p>
        </div>
      </div>

      <div className="submenu">
        {/*เมนูเติมเงิน*/}
        <button className="topupbtn">
          <a href="/topup" onClick={(e) => handleRestrictedAccess(e, '/topup')}>
            <img src={topup} className="topup" alt="topup" />
          </a>
        </button>
        {/*เมนูประวัติการซื้อ*/}
        <button className="htrbtn">
          <a href="/buyhistory" onClick={(e) => handleRestrictedAccess(e, '/buyhistory')}>
            <img src={history} className="history" alt="history" />
          </a>
        </button>
      </div>

      {/*แสดงสินค้าแนะนำ*/}
      <div className="recommend">
        <p>สินค้าแนะนำ<hr /></p>
        <div className="recommend-content">
          {recommendedProducts.length > 0 ? (
            recommendedProducts.map((product) => (
              <button
                key={product.id}
                className={`product-box ${product.stock === 0 ? 'disabled-box' : ''}`}
                disabled={product.stock === 0}
                onClick={(e) => handleProductClick(product, e)}
              >
                <img
                  src={`http://localhost:5000/assets${product.image}`}
                  alt={product.name}
                  className="product-image"
                />
                <div className="product-title">{product.name}</div>
                <div className="product-description">{product.shortDescription}</div>
                <div className="product-price">{product.price} บาท</div>
                <div>
                  {product.stock > 0 ? (
                    <button className="order-button">สั่งซื้อสินค้า</button>
                  ) : (
                    <button className="order-button" disabled>สินค้าหมด</button>
                  )}
                </div>
                <div className="product-stock">คงเหลือ {product.stock} ชิ้น</div>
              </button>
            ))
          ) : (
            <p>กำลังโหลดข้อมูล...</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
