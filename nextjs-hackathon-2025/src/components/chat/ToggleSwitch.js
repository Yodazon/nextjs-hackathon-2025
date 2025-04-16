"use client";

import React, { useState } from "react";

const ToggleSwitch = ({
  initialState = false,
  onChange,
  label,
  activeColor = "bg-primary-main",
  inactiveColor = "bg-gray-300",
}) => {
  const [isActive, setIsActive] = useState(initialState);

  const handleToggle = () => {
    const newState = !isActive;
    setIsActive(newState);
    if (onChange) {
      onChange(newState);
    }
  };

  return (
    <div className="flex items-center space-x-2 ">
      {label && <span className="text-md text-gray-700">{label}</span>}
      <button
        type="button"
        onClick={handleToggle}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none hover:cursor-pointer focus:ring-2 focus:ring-primary-main/50 ${
          isActive ? activeColor : inactiveColor
        }`}
        role="switch"
        aria-checked={isActive}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            isActive ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
};

export default ToggleSwitch;
