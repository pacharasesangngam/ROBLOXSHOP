//หน้าต่างแสดงช่องทางการติดต่อ

import React from 'react';
import '../css/contact.css';
import IG from '../../assets/instagram.png';
import Facebook from '../../assets/facebook.png';
import Line from '../../assets/line.png';
import Discord from '../../assets/discord.png';
import Logo from '../../assets/logo.png';

//หน้าเว็บ
function Contact({ onClose }) {
  return (
    <div className="modaloverlay">
      <div className="modalcontent">
        <button className="close-button" onClick={onClose}>×</button>
        <h2 class="logoclass"><img src={Logo} className="logoicon" alt="logo"/>ช่องทางการติดต่อ</h2>
        <div className='modalbody'>
          <ul className="contact-list">
            <div className="iconcontact"><img src={Facebook} className="iconcontact" alt="facebook" /><li>Facebook : Shroom Shop</li></div>
            <div className="iconcontact"><img src={Line} className="iconcontact" alt="line" /><li>Line : @shroomOfficial</li></div>
            <div className="iconcontact"><img src={IG} className="iconcontact" alt="instragram" /><li>Instragram : ShroomShop</li></div>
            <div className="iconcontact"><img src={Discord} className="iconcontact" alt="discord" /><li>Discord : ShroomShop</li></div>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Contact;