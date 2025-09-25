import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer id="footer" className="border-t border-gray-200 bg-white">
      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Logo + About */}
        <div>
          <h2 className="text-xl font-bold text-gray-900">Where is my bus?</h2>
          <p className="mt-3 text-gray-600 text-sm">
            Track buses in real time and plan your travel with ease. 
            Stay informed and save time on your daily commute.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Quick Links</h3>
          <ul className="mt-3 space-y-2 text-gray-600">
            <li><a href="/" className="hover:text-gray-900">Home</a></li>
            <li><a href="/buses" className="hover:text-gray-900">Buses</a></li>
            <li><a href="/bookings" className="hover:text-gray-900">My Bookings</a></li>
            <li><a href="#newsletter" className="hover:text-gray-900">Newsletter</a></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Support</h3>
          <ul className="mt-3 space-y-2 text-gray-600">
            <li><a href="#" className="hover:text-gray-900">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-gray-900">Terms of Service</a></li>
            <li><a href="#" className="hover:text-gray-900">FAQs</a></li>
            <li><a href="#" className="hover:text-gray-900">Help Center</a></li>
          </ul>
        </div>

        {/* Contact + Socials */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Contact Us</h3>
          <p className="mt-3 text-gray-600 text-sm">Email: support@whereismybus.com</p>
          <p className="text-gray-600 text-sm">Phone: +91 0000000000</p>
          <div className="flex mt-4 gap-4 text-gray-600">
            <a href="#" className="hover:text-gray-900"><FaFacebook size={20} /></a>
            <a href="#" className="hover:text-gray-900"><FaTwitter size={20} /></a>
            <a href="#" className="hover:text-gray-900"><FaInstagram size={20} /></a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-200 mt-8">
        <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between text-sm text-gray-600">
          <p>© {new Date().getFullYear()} Where is my bus? All rights reserved.</p>
          <p>BIET JHANSI</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
