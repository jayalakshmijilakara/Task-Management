
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignUp from './components/SignUp';  // Make sure the import paths are correct
import SignIn from './components/SignIn';
import Home from './components/Home';
import Tasks from './components/Tasks';

function App() {
  return (
    <Router>
      <div>
        {/* <h1>Welcome to React App</h1> */}
        <Routes>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/" element={<SignIn />} />
          <Route path="/home" element={<Home />} />
          <Route path="/tasks" element={<Tasks />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
