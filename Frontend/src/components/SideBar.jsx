

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 
import { faAnglesRight, faListCheck, faNoteSticky , faSliders , faRightFromBracket } from '@fortawesome/free-solid-svg-icons'; 
import { faCalendarDays } from '@fortawesome/free-regular-svg-icons'; 
import { faSquare } from '@fortawesome/free-regular-svg-icons'; 
import { useNavigate } from 'react-router-dom';
import '../CSS/SideBar.css';

const SideBar = () => {
  const navigate = useNavigate(); 
  const [selectedItem, setSelectedItem] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // State for sidebar toggle

  // Handle item click for bold styling
  const handleHighlight = (item) => {
    setSelectedItem(item);
  };

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className={`app-container ${isSidebarOpen ? '' : 'sidebar-closed'}`}>
      {/* Sidebar */}
      <div className="sidebar">
        <h2 style={{ fontFamily: 'Cabin, serif' ,}}>Menu</h2>
        <h4>TASKS</h4>
        <ul>
          <li 
            onClick={() => handleHighlight('upcoming')} 
            style={{ fontWeight: selectedItem === 'upcoming' ? 'bold' : '400' }}>
            <button 
              onClick={() => navigate('/home')} 
              style={{ all: 'unset', cursor: 'pointer', textDecoration: 'none' }}>
              <span><FontAwesomeIcon icon={faAnglesRight} /></span> Upcoming
            </button>
          </li>
          <li 
            onClick={() => handleHighlight('today')} 
            style={{ fontWeight: selectedItem === 'today' ? 'bold' : '400' }}>
            <button 
              onClick={() => navigate('/tasks')} 
              style={{ all: 'unset', cursor: 'pointer', textDecoration: 'none' }}>
              <span><FontAwesomeIcon icon={faListCheck} /></span> Tasks
            </button>
          </li>
          <li 
            onClick={() => handleHighlight('calendar')} 
            style={{ fontWeight: selectedItem === 'calendar' ? 'bold' : '400' }}>
            <button 
              onClick={() => navigate('/calendar')} 
              style={{ all: 'unset', cursor: 'pointer', textDecoration: 'none' }}>
              <span><FontAwesomeIcon icon={faCalendarDays} /></span> Calendar
            </button>
          </li>
          <li 
            onClick={() => handleHighlight('stickyWall')} 
            style={{ fontWeight: selectedItem === 'stickyWall' ? 'bold' : '400' }}>
            <button 
              onClick={() => navigate('/sticky-wall')} 
              style={{ all: 'unset', cursor: 'pointer', textDecoration: 'none' }}>
              <span><FontAwesomeIcon icon={faNoteSticky} /></span> Sticky Wall
            </button>
          </li>
        </ul>

        {/* LISTS Section */}
        <h4>LISTS</h4>
        <ul>
          <li onClick={() => handleHighlight('personal')} style={{ fontWeight: selectedItem === 'personal' ? 'bold' : '400' }}>
            <a href="#home">
              <span>
                <FontAwesomeIcon icon={faSquare} style={{ backgroundColor: '#E17564' }} />
              </span> Personal
            </a>
          </li>
          <li onClick={() => handleHighlight('work')} style={{ fontWeight: selectedItem === 'work' ? 'bold' : '400' }}>
            <a href="#reports">
              <span>
                <FontAwesomeIcon icon={faSquare} style={{ backgroundColor: '#A1E3F9' }} />
              </span> Work
            </a>
          </li>
          <li>
            <button onClick={() => { window.location.href = '#analytics'; }}>
              <span style={{ fontSize: '20px' }}>+</span> Add New List
            </button>
          </li>
        </ul>

        {/* TAGS Section */}
        <h4>TAGS</h4>
        <ul>
          <li>
            <button onClick={() => { window.location.href = '#analytics'; }}>
              <span style={{ fontSize: '20px' }}>+</span> Add New Tag
            </button>
          </li>
        </ul>

        {/* Settings and Sign Out */}
        <div style={{ marginTop: '85px' }}>
          <h4><span style={{ paddingRight: '12px' }}><FontAwesomeIcon icon={faSliders} /></span>Settings</h4>
          <h4><span style={{ paddingRight: '12px' }}><FontAwesomeIcon icon={faRightFromBracket} /></span>Sign out</h4>
        </div>
      </div>

      {/* Content Area */}
      <div className="content">
        <div className="hamburger" onClick={toggleSidebar}>
          ☰
        </div>
      </div>
    </div>
  );
};

export default SideBar;
