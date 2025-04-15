"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  RiMenuLine,
  RiCloseLine,
  RiHomeLine,
  RiChat1Line,
  RiSettingsLine,
  RiUserLine,
  RiLogoutBoxLine,
  RiBarChartLine,
  RiMoneyDollarCircleLine,
  RiBook3Line,
} from "react-icons/ri";

const MainLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { data: session } = useSession();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const navItems = [
    { href: "/", icon: <RiHomeLine />, label: "Home" },
    { href: "/lessons", icon: <RiBook3Line />, label: "Lessons" },
    { href: "/stats", icon: <RiBarChartLine />, label: "Stats" },
    { href: "/chat", icon: <RiChat1Line />, label: "Chat" },
    { href: "/settings", icon: <RiSettingsLine />, label: "Settings" },
    { href: "/upgrade", icon: <RiMoneyDollarCircleLine />, label: "Upgrade" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-black text-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                onClick={toggleSidebar}
                className="p-2 rounded-md text-gray-500 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 lg:hidden"
              >
                {isSidebarOpen ? (
                  <RiCloseLine size={24} />
                ) : (
                  <RiMenuLine size={24} />
                )}
              </button>
              <Link
                href="/"
                className="ml-4 text-xl font-bold text-primary-main"
              >
                <img src={"/images/logo.png"} width={"170"} height={"75"} />
              </Link>
            </div>
            <div className="flex items-center">
              {session ? (
                <div className="flex items-center space-x-4">
                  <span className="text-white text-bold">
                    {session.user.name}
                  </span>
                  <div className="h-8 w-8 rounded-full bg-primary-main flex items-center justify-center">
                    <RiUserLine className="text-white" />
                  </div>
                </div>
              ) : (
                <Link
                  href="/api/auth/signin"
                  className="text-primary-main hover:text-blue-700"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 transform ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0 lg:static lg:inset-auto lg:z-0 z-40 transition-transform duration-200 ease-in-out`}
        >
          <div className="h-full w-64 bg-white shadow-lg">
            <nav className="h-full flex flex-col">
              <div className="flex-1 px-3 py-6 mt-5 space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center px-4 py-3 text-foreground hover:bg-primary-light hover:text-primary-dark rounded-md transition-colors"
                  >
                    <span className="mr-3 text-primary-main text-xl">
                      {item.icon}
                    </span>
                    {item.label}
                  </Link>
                ))}
              </div>
              {session && (
                <div className="px-3 py-4 border-t border-gray-200">
                  <Link
                    href="/api/auth/signout"
                    className="flex items-center px-4 py-2 text-gray-700 hover:bg-primary-light hover:text-primary-dark rounded-md transition-colors"
                  >
                    <span className="mr-3">
                      <RiLogoutBoxLine />
                    </span>
                    Sign Out
                  </Link>
                </div>
              )}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {children}
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} AI Assistant. All rights reserved.
            </p>
            <div className="flex space-x-4">
              <Link
                href="/privacy"
                className="text-gray-500 hover:text-gray-700 text-sm"
              >
                Privacy
              </Link>
              <Link
                href="/terms"
                className="text-gray-500 hover:text-gray-700 text-sm"
              >
                Terms
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
