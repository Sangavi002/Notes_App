import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const [formData, setFormData] = useState({ 
    firstname: '',
    lastname: '',
    username:'',
    password: '', 
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://notesapp-be-lphc.onrender.com/user/register', formData);
      navigate("/login");
    } catch (error) {
      alert(error.response.data.msg);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-80">
        <h2 className="text-2xl font-bold mb-4">Sign up</h2>
        <input type="text" name="firstname" placeholder="Firstname" onChange={handleChange} className="w-full p-2 border rounded mb-4" required />
        <input type="text" name="lastname" placeholder="Lastname" onChange={handleChange} className="w-full p-2 border rounded mb-4" required />
        <input type="text" name="username" placeholder="Username" onChange={handleChange} className="w-full p-2 border rounded mb-4" required />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} className="w-full p-2 border rounded mb-4" required />
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">Sign up</button>
      </form>
    </div>
  );
};

export default RegisterPage;