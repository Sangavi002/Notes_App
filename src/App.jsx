import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import RegisterPage from './Auth/RegisterPage';
import LoginPage from './Auth/LoginPage';
import HomePage from './Homepage';
import Favoritepage from './Favoritepage';

const App = () => {
  const location = useLocation(); 

  return (
    <div className="min-h-screen max-w-full overflow-x-hidden">
      {(location.pathname === '/' || location.pathname === '/login') && (
        <nav className="bg-blue-600 p-4 text-white flex justify-between">
          <h1 className="text-2xl font-bold">Notes App</h1>
          <div>
            <Link to="/" className="mr-4 hover:underline">Sign up</Link>
            <Link to="/login" className="hover:underline">Login</Link>
          </div>
        </nav>
      )}
      <Routes>
        <Route path="/" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/favorite" element={<Favoritepage />} />
      </Routes>
    </div>
  );
};

export default App;
