import React from 'react'
import Image from 'next/image';
import Link from 'next/link';

const Footer = () => (
  <footer className="bg-gray-900 text-white pt-12 pb-6 mt-16">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-b border-gray-700 pb-8">
        <div className="col-span-2 md:col-span-1">
          <Link href="/">
            <Image
              src="/images/LOGO (2).jpg"
              alt="Brand Logo"
              width={150}
              height={50}
              objectFit="contain"
            />
          </Link>
          <p className="mt-4 text-gray-400 text-sm max-w-xs">
            Helping citizens connect with government services efficiently and transparently.
          </p>
        </div>
        <div>
          <h4 className="text-lg font-semibold text-[#3ab4ff] mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/about" className="text-gray-400 hover:text-white">About Us</Link></li>
            <li><Link href="/contact" className="text-gray-400 hover:text-white">Contact</Link></li>
            <li><Link href="/faq" className="text-gray-400 hover:text-white">FAQ</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-lg font-semibold text-[#3ab4ff] mb-4">Resources</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/complaints" className="text-gray-400 hover:text-white">File Complaint</Link></li>
            <li><Link href="/insights" className="text-gray-400 hover:text-white">Insights</Link></li>
            <li><Link href="/ngo-listing" className="text-gray-400 hover:text-white">NGO Directory</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-lg font-semibold text-[#3ab4ff] mb-4">Contact</h4>
          <p className="text-gray-400 text-sm">Email: support@govserve.com</p>
          <p className="text-gray-400 text-sm">Phone: +91 98765 43210</p>
          <p className="text-gray-400 text-sm">123 Civic Center, New Delhi, India</p>
        </div>
      </div>
      <div className="mt-6 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} GovServe. All rights reserved.
      </div>
    </div>
  </footer>
);
export default Footer
