import React, { ReactNode } from 'react';
import Image from "next/image";

const Layout = ({children}:{children:ReactNode}) => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 overflow-hidden">
      {/* Form Section */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-10 lg:p-16 order-2 md:order-1">
        <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 hover:shadow-3xl">
          <div className="p-6 sm:p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Chancellors Cup</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">Sign in to your account</p>
            </div>

            <div className="space-y-6">
              {children}
            </div>

            <div className="mt-8 text-center text-xs text-gray-500 dark:text-gray-400">
              &copy; {new Date().getFullYear()} Chancellors Cup. All rights reserved.
            </div>
          </div>
        </div>
      </div>

      {/* Image Section */}
      <div className="relative w-full h-60 md:h-screen md:w-1/2 order-1 md:order-2">
        <Image
          src="/sign_upLayout.png"
          alt="Authentication Background"
          fill
          priority
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 to-indigo-600/30"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="px-6 py-4 bg-white/10 backdrop-blur-md rounded-xl text-white text-center md:hidden">
            <h2 className="text-xl font-bold">Welcome to Chancellors Cup</h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
