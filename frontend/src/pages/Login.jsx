import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-background px-4 py-8 transition-colors duration-200">
      <div className="bg-surface border border-outline-variant p-8 rounded-2xl shadow-lg w-full max-w-md transition-colors duration-200">
        <h2 className="text-2xl font-bold text-center text-on-surface mb-8 tracking-tight">Welcome to TaskFlow</h2>
        
        {error && (
          <div className="bg-error-container text-on-error-container px-4 py-3 rounded-xl text-sm border border-error/20 mb-6 font-medium">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-on-surface-variant">Email</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              className="bg-background border border-outline-variant text-on-surface text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-sm"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-on-surface-variant">Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              className="bg-background border border-outline-variant text-on-surface text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-sm"
            />
          </div>
          
          <button type="submit" className="mt-2 bg-primary text-on-primary font-bold text-sm rounded-xl py-3 shadow-md hover:shadow-lg hover:opacity-90 active:scale-[0.98] transition-all">
            Login
          </button>
        </form>
        
        <p className="mt-8 text-center text-sm text-on-surface-variant">
          Don't have an account? <Link to="/signup" className="text-primary font-bold hover:underline">Sign up here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
