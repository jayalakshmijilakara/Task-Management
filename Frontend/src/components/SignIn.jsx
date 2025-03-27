
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';  
import Login from "/Login.avif";
import "../CSS/Sign.css";

function SignIn() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8081/api/login', formData);
      setMessage(response.data.message);
      console.log('API Response:', response.data);  // Add this line to debug the response

      if (response.data.success) {
        console.log('Login successful, redirecting to /home');
        navigate('/home');
      } else {
        console.log('Login failed, staying on current page');
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Login failed. Please try again.');
      console.error('Error response:', error.response);  // Add error log for debugging
    }
  };

  return (
    <div className="container">
      <div className="box">
        <img src={Login} alt="Login Illustration" />
      </div>
      <div className="box" style={{ textAlign: 'left' }}>
        <h3 style={{ textAlign: 'right' }}>
          New User? 
          <Link to="/signup" style={{ textDecoration: 'none' }}>
            <span style={{ color: 'blue' }}> Sign Up</span>
          </Link>
        </h3>
        <h2 style={{ fontFamily: 'Kanit, sans-serif', letterSpacing: '3px' }}>Welcome Back!</h2>
        <h6>Login to continue</h6>
        <form onSubmit={handleSubmit} className='input'>
          <div>
            <input
              type="email"
              name="email"
              placeholder='Email'
              value={formData.email}
              
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder='Password'
             
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="checkbox-container">
            <input 
              type="checkbox" 
              onClick={togglePasswordVisibility} 
              aria-label="Toggle password visibility"
            />
            <label>Show Password</label>
          </div>

          <button type="submit">Sign In</button>
        </form>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
}

export default SignIn;
