
// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate, Link } from 'react-router-dom';  // Add the Link import here
// import Login from '/Login.avif';
// import '../CSS/Sign.css';

// function SignUp() {
//   const [formData, setFormData] = useState({
//     username: '',
//     email: '',
//     password: '',
//   });
//   const [message, setMessage] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const togglePasswordVisibility = () => {
//     setShowPassword(!showPassword);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post('http://localhost:8081/api/signup', formData);
//       setMessage(response.data.message);
//       navigate('/home');
//     } catch (error) {
//       setMessage(error.response?.data?.message || 'An error occurred');
//     }
//   };

//   return (
//     <div className="container">
//       <div className="box">
//         <img src={Login} alt="Login Illustration" />
//       </div>
//       <div className="box" style={{ textAlign: 'left' }}>
//         <h3 style={{ textAlign: 'right' }}>
//           Already have an account ?{' '}
//           <Link to="/signin" style={{ textDecoration: 'none' }}>
//             <span style={{ color: 'blue' }}>Log In</span>
//           </Link>
//         </h3>
//         <h2 style={{ fontWeight: 'bolder',letterSpacing:'2px',fontFamily: 'Kanit, sans-serif' }}>Registration Form</h2>
//         <form onSubmit={handleSubmit} className='input'>
//           <div>
//             <input
//               type="text"
//               name="username"
//               placeholder="Username"
//               value={formData.username}
//               onChange={handleChange}
//               required
//             />
//           </div>
//           <div>
//             <input
//               type="email"
//               name="email"
//               placeholder="Email"
//               value={formData.email}
//               onChange={handleChange}
//               required
//             />
//           </div>
//           <div>
//             <input
//               type={showPassword ? 'text' : 'password'}
//               name="password"
//               placeholder="Password"
//               value={formData.password}
//               onChange={handleChange}
//               required
//             />
//           </div>
//           <div className="checkbox-container">
//             <input
//               type="checkbox"
//               onClick={togglePasswordVisibility}
//               aria-label="Toggle password visibility"
//             />
//             <label>Show Password</label>
//           </div>
//           <button type="submit">Sign Up</button>
//         </form>
        
//         {message && <p>{message}</p>}
//       </div>
//     </div>
//   );
// }

// export default SignUp;
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import LoginImage from '/Login.avif';
import '../CSS/Sign.css';

function SignUp() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

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
      const response = await axios.post('http://localhost:8081/api/signup', formData);
      setMessage(response.data.message);
      navigate('/signin');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Signup failed. Please try again.');
    }
  };

  return (
    <div className="container">
      <div className="box">
        <img src={LoginImage} alt="Login Illustration" />
      </div>
      <div className="box" style={{ textAlign: 'left' }}>
        <h3 style={{ textAlign: 'right' }}>
          Already have an account? 
          <Link to="/signin" style={{ textDecoration: 'none' }}>
            <span style={{ color: 'blue' }}>Log In</span>
          </Link>
        </h3>
        <h2 style={{ fontWeight: 'bolder', letterSpacing: '2px', fontFamily: 'Kanit, sans-serif' }}>
          Registration Form
        </h2>
        <form onSubmit={handleSubmit} className="input">
          <div>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
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
          <button type="submit">Sign Up</button>
        </form>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
}

export default SignUp;
