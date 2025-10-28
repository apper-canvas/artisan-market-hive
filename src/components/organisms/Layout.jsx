import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import React from "react";
import Header from "@/components/organisms/Header";
import Footer from "@/components/organisms/Footer";
const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        className="z-[9999]"
      />
    </div>
  );
};

export default Layout;