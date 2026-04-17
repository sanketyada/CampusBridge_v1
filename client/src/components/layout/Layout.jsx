import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = () => {
  return (
    <div className="min-h-screen bg-[#FDFDFF] flex flex-col">
      {/* Fixed Navbar takes space, so we use a wrapper with padding-top */}
      <Navbar />
      
      {/* Content Area */}
      <main className="flex-grow pt-20">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Layout;
