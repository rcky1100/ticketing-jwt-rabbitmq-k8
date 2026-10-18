import React from "react";

const Input = ({ name, stateData, label, error, type = "text", onChange }) => {
  return (
    <div>
      <label htmlFor={name} className="block text-gray-700 mb-2">
        {label}
      </label>
      <input
        value={stateData}
        onChange={(e) => onChange(e)}
        type={type}
        id={name}
        name={name}
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
      {error && <div>{error}</div>}
    </div>
  );
};

export default Input;
