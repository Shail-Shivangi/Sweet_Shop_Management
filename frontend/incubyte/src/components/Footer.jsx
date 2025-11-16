import React from 'react';
import { Link } from 'react-router-dom';


export default function Footer() {
  // Use lucide-react icons here if available in the environment, otherwise use placeholders/text.
  const Year = new Date().getFullYear();

  return (
    <footer className="app-footer">
      <div className="container footer-content">
        <div className="footer-section">
          <h3 className="brand">Sweet Shop</h3>
          <p className="footer-contact">
            Indulge your senses with the finest traditional and modern confections.
          </p>
          <p className="footer-copyright">
            &copy; {Year} Sweet Shop. All rights reserved.
          </p>
        </div>

        <div className="footer-section">
          <h4>Navigation</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/dashboard">Shop</Link></li>
            {/* Admin link will appear in Navbar, but here for structure */}
            <li><Link to="/login">Account</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Contact & Info</h4>
          <ul>
            <li>Privacy Policy</li>
            <li>Terms of Service</li>
            <li><a href="mailto:info@sweetshop.com">info@sweetshop.com</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}