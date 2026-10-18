import React, { useRef, useState } from "react";
import Input from "./common/Input";
import * as userService from "../services/userService";

const RegisterForm = () => {
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validate = () => {
    const errors = {};
    if (formData.username.trim() === "")
      errors.username = "Username is requried";
    if (formData.password.trim() === "")
      errors.password = "Password is requried";

    return Object.keys(errors).length === 0 ? null : errors;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate();
    setErrors(errors || {});
    if (errors) return;
    try {
      const { data: response } = await userService.register(formData);
      localStorage.setItem("token", response.token);
      window.location.href = "/";
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        let error = { username: ex.response.data.message };
        setErrors(error);
      }
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Register
        </h2>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <Input
            name="username"
            stateData={formData.username}
            label="Username"
            onChange={handleChange}
            error={errors.username}
          />
          <Input
            name="password"
            stateData={formData.password}
            label="Password"
            onChange={handleChange}
            error={errors.password}
            type="password"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
