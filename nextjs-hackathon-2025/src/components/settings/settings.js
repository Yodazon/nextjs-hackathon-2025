"use client";

import React, { useState, useEffect } from "react";
import MainLayout from "../layout/MainLayout";
import ToggleSwitch from "../chat/ToggleSwitch";

const SettingsPage = () => {
  const { darkMode, toggleDarkMode } = useState();

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Settings</h1>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 my-2">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-medium">Appearance</h2>
              <p className="text-gray-500 dark:text-gray-400">
                Toggle between light and dark mode (Coming Soon...)
              </p>
            </div>
            <ToggleSwitch
              initialState={darkMode}
              onChange={toggleDarkMode}
              label="Dark Mode"
            />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 my-2">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-medium">Default language</h2>
              <p className="text-gray-500 dark:text-gray-400">
                Switch between default langauge in app (Coming Soon...)
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 my-2">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-medium">Default Response Voice</h2>
              <p className="text-gray-500 dark:text-gray-400">
                Change default response voice (Coming Soon...)
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default SettingsPage;
