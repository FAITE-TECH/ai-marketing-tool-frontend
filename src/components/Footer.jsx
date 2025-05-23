import React from 'react'
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa'

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white text-sm py-2 px-4">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Contact Info */}
        <div>
          <h2 className="text-lg font-semibold mb-2">Contact Us</h2>
          <p className="flex items-center gap-2"><FaEnvelope />faiteplus1@gmail.com</p>
          <p className="flex items-center gap-2"><FaPhone /> +94 (234) 567-8901</p>
          <p className="flex items-center gap-2"><FaMapMarkerAlt />Colombo, Sri Lanka</p>
        </div>

        {/* Navigation */}
        <div>
          <h2 className="text-lg font-semibold mb-2">Quick Links</h2>
          <ul className="space-y-1">
            <li><a href="/contact" className="hover:text-gray-400">Contact</a></li>
            <li><a href="/terms" className="hover:text-gray-400">Terms of Service</a></li>
            <li><a href="/privacy" className="hover:text-gray-400">Privacy Policy</a></li>
          </ul>
        </div>

        {/* Branding or Description */}
        <div>
          <h2 className="text-lg font-semibold mb-2">About</h2>
          <p className="text-sm text-gray-300">
            AI Marketing Tools helps businesses automate campaigns, score leads, and grow smarter.
            Built with AI, styled with passion.
          </p>
        </div>
      </div>

      <hr className="my-4 border-gray-700" />
      <p className="text-center text-sm text-gray-400">&copy; {new Date().getFullYear()} AI Marketing Tools. All rights reserved.</p>
    </footer>
  )
}

export default Footer
