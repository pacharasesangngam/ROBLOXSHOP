//หน้าแสดงรายละเอียดสินค้า หลังจากผู้ใช้กดเลือกรายการสินค้านั้นๆแล้ว
//สามารถทำการสั่งซื้อสินค้าได้ที่หน้านี้

import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Swal from 'sweetalert2';
import '../../layouts/App';
import "../css/product.css";

function Product() {
  const { loggedInUser, currMoney, setCurrMoney } = useOutletContext();
  const location = useLocation();
  const { product } = location.state || {};
  const [stock, setStock] = useState(product?.stock || 0);

  //ฟังก์ชันสำหรับดึงข้อมูลสินค้าจากเซิร์ฟเวอร์
  const fetchProductStock = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/products/${product?.id}`);
      if (response.ok) {
        const updatedProduct = await response.json();
        return updatedProduct;
      }
    } catch (error) {
      console.error("Error fetching product stock:", error);
    }
    return null;
  };
  
  //โหลดข้อมูลสินค้าที่ถูกเลือก
  useEffect(() => {
    if (product?.id) {
      fetchProductStock();
    }
  }, [product?.id]);

  //ถ้ากดเลือกสินค้าโดยที่ยังไม่เข้าสู่ระบบจะมีข้อความแจ้งเตือน และไม่สามารถเข้าถึงหน้านี้ได้
  const openModal = () => {
    if (!loggedInUser) {
      Swal.fire({
        icon: "warning",
        title: "กรุณาเข้าสู่ระบบก่อนทำการสั่งซื้อ",
        showConfirmButton: true,
      });
      return;
    }

    //หน้าต่างยืนยันคำสั่งซื้อ
    Swal.fire({
      title: "ยืนยันการสั่งซื้อ",
      text: `คุณต้องการสั่งซื้อ ${product?.name} จำนวน 1 รายการ หรือไม่?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก",
    }).then((result) => {
      if (result.isConfirmed) {
        checkFundsAndPurchase();
      }
    });
  };

  //เช็คยอดเงินที่มีว่าเพียงพอต่อการซื้อสินค้าหรือไม่
  const checkFundsAndPurchase = () => {
    if (parseFloat(currMoney) < parseFloat(product?.price)) {
      Swal.fire({
        icon: "warning",
        title: "ยอดเงินไม่เพียงพอ",
        text: "กรุณาเติมเงินก่อนทำการสั่งซื้อ",
        showConfirmButton: true,
      });
      return;
    }

    handleConfirmOrder();
  };

  //ถ้าซื้อสินค้าสำเร็จก็ให้เก็บข้อมูลสินค้า และชื่อผู้ซื้อไว้ในไฟล์ buyhistory.json
  const handleConfirmOrder = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/buyhistory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: loggedInUser,
          name: product?.name,
          price: product?.price,
          amount: 1,
          usergame: product?.idPasses?.[0]?.usergame || '',
          passwordgame: product?.idPasses?.[0]?.passwordgame || '',
        }),
      });

      const result = await response.json();

      //แสดงข้อความ success
      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: result?.message || "สั่งซื้อสินค้าสำเร็จ",
          showConfirmButton: true,
        });

        //ลดจำนวนสสินค้า
        setStock((prevStock) => prevStock - 1);

        //โหลดข้อมูลสินค้าใหม่มาแสดงในหน้าเว็บใหม่
        await fetchProductStock();

        //หักยอดเงิน
        setCurrMoney((prev) => (parseFloat(prev) - parseFloat(product?.price)).toFixed(2));
      } else {
        Swal.fire({
          icon: "error",
          title: result?.message || "เกิดข้อผิดพลาด",
          showConfirmButton: true,
        });
      }
    } catch (error) {
      console.error("Error during submission:", error);
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        showConfirmButton: true,
      });
    }
  };

  if (!product) {
    return <div>ไม่พบข้อมูลสินค้า</div>;
  }

  //หน้าเว็บ
  return (
    <div className="container">
      <div className="left-section">
        <img
          src={`http://localhost:5000/assets${product.image}`}
          alt={product.name}
          className="productpic"
        />
      </div>
      <div className="right-detail">
        <div className="right-section">
          <h1>{product.name}</h1>
          <hr />
          <p className="note">{product.shortDescription}</p>
          <p
            className="note"
            dangerouslySetInnerHTML={{ __html: product.longDescription.replace(/\n/g, "<br />") }}
          ></p>
          <p
            className="note"
            style={{ color: "red", marginTop: "20px", marginBottom: "15px" }}
          >
            หมายเหตุ : สามารถซื้อสินค้าได้ครั้งละ 1 รายการเท่านั้น
          </p>
        </div>
        <div className="price">
          <span>ราคา : </span>
          <span style={{ color: "#7fff00", marginLeft: "10px" }}>{product.price} บาท</span>
          <span style={{ float: "right", color: "#fff" }}>เหลือ {stock} รายการ</span>
        </div>
        <button className="buy-button" onClick={openModal}>
          สั่งซื้อสินค้า
        </button>
      </div>
    </div>
  );
}

export default Product;
