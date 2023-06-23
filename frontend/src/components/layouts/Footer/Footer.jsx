import React from 'react';
import playStore from '../../../images/playstore.png';
import appStore from '../../../images/appstore.png';
import './Footer.css';

const Footer = () => {
  return (
    <footer id="footer">
        <div className="leftFooter">
          <h4>Download Our App</h4>
          <p>Download App for Android & IOS</p>
          <img src={playStore} alt="playStore" />
          <img src={appStore} alt="appStore" />
        </div>
        <div className="midFooter">
          <h1>E-Commerce</h1>
          <p>Value product is our first priority</p>
          <p>Copyrights 2023 &copy; ShubhSiroliya</p>
        </div>
        <div className="rightFooter">
          <h4>Follow Us</h4>
          <a href="https://github.com/shubhsiroliya">Instagram</a>
          <a href="https://github.com/shubhsiroliya">Youtube</a>
          <a href="https://github.com/shubhsiroliya">Facebook</a>
        </div>
    </footer>
  )
}

export default Footer