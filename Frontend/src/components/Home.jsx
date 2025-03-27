
import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import SideBar from './SideBar';
import { faTrash,faPen } from '@fortawesome/free-solid-svg-icons';
import '../CSS/Home.css';

const Home = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    deadline: '',
    status: '',
    priority: ''
  });
  const [tasks, setTasks] = useState([]);
  const [editingTaskId, setEditingTaskId] = useState(null);

  const toggleSidebar = () => {
    setSidebarOpen(prevState => !prevState);
  };

  const openModal = (task = null) => {
    if (task) {
      setTaskData(task);
      setEditingTaskId(task.id);
    } else {
      setTaskData({
        title: '',
        description: '',
        deadline: '',
        status: '',
        priority: ''
      });
      setEditingTaskId(null);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTaskData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const taskRequest = {
      title: taskData.title,
      description: taskData.description,
      deadline: taskData.deadline,
      status: taskData.status,
      priority: taskData.priority
    };

    if (editingTaskId) {
      axios.put(`http://localhost:8081/api/updateTask/${editingTaskId}`, taskRequest)
        .then(response => {
          setTasks(prevTasks => prevTasks.map(task =>
            task.id === editingTaskId ? { ...task, ...taskRequest } : task
          ));
          closeModal();
        })
        .catch(error => {
          console.error('Error updating task:', error.response || error.message);
          alert('Failed to update task. Please try again.');
        });
    } else {
      axios.post('http://localhost:8081/api/addTask', taskRequest)
        .then(response => {
          setTasks(prevTasks => [...prevTasks, { ...taskRequest, id: response.data.taskId }]);
          closeModal();
        })
        .catch(error => {
          console.error('Error adding task:', error.response || error.message);
          alert('Failed to add task. Please try again.');
        });
    }
  };

  useEffect(() => {
    axios.get('http://localhost:8081/api/getTasks')
      .then(response => {
        setTasks(response.data);
      })
      .catch(error => {
        console.error('Error fetching tasks:', error);
        alert('Failed to fetch tasks. Please try again.');
      });
  }, []);

  const deleteTask = (taskId) => {
    axios.delete(`http://localhost:8081/api/deleteTask/${taskId}`)
      .then(() => {
        setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
        alert('Task deleted successfully');
      })
      .catch(error => {
        console.error('Error deleting task:', error);
        alert('Failed to delete task. Please try again.');
      });
  };

  // Helper function to format date in dd-mm-yyyy format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // Helper function to get today's date in YYYY-MM-DD format (used for comparison)
  const getToday = () => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    return `${year}-${month}-${day}`;
  };

  // Helper function to normalize date string to YYYY-MM-DD format
  const normalizeDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  };

  // Separate tasks into today, upcoming, and missed
  const todayDate = getToday();
  const todayTasks = tasks.filter(task => normalizeDate(task.deadline) === todayDate);
  const upcomingTasks = tasks.filter(task => normalizeDate(task.deadline) > todayDate);
  const missedTasks = tasks.filter(task => normalizeDate(task.deadline) < todayDate && task.status !== 'Completed');

  return (
    <div className={`app-container ${!sidebarOpen ? 'sidebar-closed' : ''}`}>
      <div className="sidebar">
        <SideBar />
      </div>

      <div className="content">
        <div className="hamburger" onClick={toggleSidebar}>
          ☰
        </div>

        <h1>
          Manage Your Tasks, Master Your Time       
          <button className="add-task-button" onClick={() => openModal()}>
            <span>+</span> Add New Task
          </button>
        </h1>

        {isModalOpen && (
          <div className="modal">
            <div className="modal-content">
              <h2>{editingTaskId ? 'Edit Task' : 'Add New Task'}</h2>
              <form onSubmit={handleFormSubmit}>
                <div className="form">
                 
                  <div className="form-field">
                    <label>Title:</label>
                    <input
                      type="text"
                      name="title"
                      value={taskData.title}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-field">
                    <label>Status:</label>
                    <select
                      name="status"
                      value={taskData.status}
                      onChange={handleInputChange}
                    >
                      <option value="">Select Status</option>
                      <option value="Not Started">Not Started</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>

                
                  <div className="form-field">
                    <label>Deadline:</label>
                    <input
                      type="date"
                      name="deadline"
                      value={taskData.deadline}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-field">
                    <label>Priority:</label>
                    <select
                      name="priority"
                      value={taskData.priority}
                      onChange={handleInputChange}
                    >
                      <option value="">Select Priority</option>
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>

                 
                  <div className="form-field full-width">
                    <label>Description:</label>
                    <textarea
                      name="description"
                      value={taskData.description}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

              
                <div className="button-container">
                  <button type="submit">Save</button>
                  <button type="button" onClick={closeModal}>
                    Close
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Render Today's Tasks */}
        <div className="task-list">
          <h2 style={{
  color: 'rgb(90, 80, 255)',
  fontWeight: 'bold',
  textAlign: 'center',
  fontSize: '36px',
  fontFamily: 'Cinzel, serif'
}}>Today's Tasks</h2>
          {todayTasks.length === 0 ? (
            <p>No tasks for today!</p>
          ) : (
            <ul>
              {todayTasks.map((task, index) => (
                <li key={index}>
                  <div style={{ textAlign: 'right' }}>
                    <button onClick={() => openModal(task)} style={{
                      backgroundColor: 'black',
                      color: 'white',
                      borderRadius: '4px',
                      fontWeight: 'bold',
                      padding: '5px 10px',
                      margin: '2px'
                    }}>
                      <span><FontAwesomeIcon icon={faPen} style={{ marginRight: '8px' }}/></span>Edit
                    </button>
                    <button onClick={() => deleteTask(task.id)} style={{
                      backgroundColor: 'black',
                      color: 'white',
                      fontWeight: 'bold',
                      borderRadius: '4px',
                      padding: '5px 10px',
                      margin: '2px'
                    }}>
                      <span style={{ marginRight: '8px' }}><FontAwesomeIcon icon={faTrash} /></span>Delete
                    </button>
                  </div>

                  <h3>{task.title}</h3>
                  {task.status === 'Not Started' ? (
  <p><strong>Status:</strong> <button
    style={{
      backgroundColor: 'white',
      border: '1px solid rgba(128, 128, 128, 0.5)', 
      color: 'red',
      borderRadius: '8px' 
    }}
  ><strong>• {task.status}</strong></button></p>
) : (
  <p><strong>Status:</strong> <button
    style={{
      backgroundColor: 'white',
      border: '1px solid rgba(128, 128, 128, 0.5)', 
      color: 'blue', 
      borderRadius: '8px' 
    }}
  ><strong>• {task.status}</strong></button></p> 
)}

                  <p><strong>Deadline:</strong> {formatDate(task.deadline)}</p>
                  <p><strong>Priority:</strong> {task.priority}</p>
                  <p><strong>Description:</strong> {task.description}</p>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Render Upcoming Tasks */}
        <div className="task-list">
          <h2 style={{
  color: 'rgb(90, 80, 255)',
  fontWeight: 'bold',
  textAlign: 'center',
  fontSize: '36px',
  fontFamily: 'Cinzel, serif'
}}>Upcoming Tasks</h2>
          {upcomingTasks.length === 0 ? (
            <p>No upcoming tasks!</p>
          ) : (
            <ul>
              {upcomingTasks.map((task, index) => (
                <li key={index}>
                  <div style={{ textAlign: 'right' }}>
                    <button onClick={() => openModal(task)} style={{
                      backgroundColor: 'black',
                      color: 'white',
                      borderRadius: '4px',
                      fontWeight: 'bold',
                      padding: '5px 10px',
                      margin: '2px'
                    }}>
                      <span><FontAwesomeIcon icon={faPen} style={{ marginRight: '8px' }}/></span>Edit
                    </button>
                    <button onClick={() => deleteTask(task.id)} style={{
                      backgroundColor: 'black',
                      color: 'white',
                      fontWeight: 'bold',
                      borderRadius: '4px',
                      padding: '5px 10px',
                      margin: '2px'
                    }}>
                      <span style={{ marginRight: '8px' }}><FontAwesomeIcon icon={faTrash} /></span>Delete
                    </button>
                  </div>

                  <h3>{task.title}</h3>
                  {task.status === 'Not Started' ? (
  <p><strong>Status:</strong> <button
    style={{
      backgroundColor: 'white',
      border: '1px solid rgba(128, 128, 128, 0.5)', 
      color: 'red',
      borderRadius: '8px' 
    }}
  ><strong>• {task.status}</strong></button></p>
) : (
  <p><strong>Status:</strong> <button
    style={{
      backgroundColor: 'white',
      border: '1px solid rgba(128, 128, 128, 0.5)', 
      color: 'blue', 
      borderRadius: '8px' 
    }}
  ><strong>• {task.status}</strong></button></p> 
)}

                  <p><strong>Deadline:</strong> {formatDate(task.deadline)}</p>
                  <p><strong>Priority:</strong> {task.priority}</p>
                  <p><strong>Description:</strong> {task.description}</p>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Render Missed Tasks */}
        <div className="task-list">
          <h2 style={{
  color: 'rgb(90, 80, 255)',
  fontWeight: 'bold',
  textAlign: 'center',
  fontSize: '36px',
  fontFamily: 'Cinzel, serif'
}}>Missed Tasks</h2>
          {missedTasks.length === 0 ? (
            <p>No missed tasks!</p>
          ) : (
            <ul>
              {missedTasks.map((task, index) => (
                <li key={index}>
                  <div style={{ textAlign: 'right' }}>
                    <button onClick={() => openModal(task)} style={{
                      backgroundColor: 'black',
                      color: 'white',
                      borderRadius: '4px',
                      fontWeight: 'bold',
                      padding: '5px 10px',
                      margin: '2px'
                    }}>
                      <span><FontAwesomeIcon icon={faPen} style={{ marginRight: '8px' }}/></span>Edit
                    </button>
                    <button onClick={() => deleteTask(task.id)} style={{
                      backgroundColor: 'black',
                      color: 'white',
                      fontWeight: 'bold',
                      borderRadius: '4px',
                      padding: '5px 10px',
                      margin: '2px'
                    }}>
                      <span style={{ marginRight: '8px' }}><FontAwesomeIcon icon={faTrash} /></span>Delete
                    </button>
                  </div>

                  <h3>{task.title}</h3>
                  {task.status === 'Not Started' ? (
  <p><strong>Status:</strong> <button
    style={{
      backgroundColor: 'white',
      border: '1px solid rgba(128, 128, 128, 0.5)', 
      color: 'red',
      borderRadius: '8px' 
    }}
  ><strong>• {task.status}</strong></button></p>
) : (
  <p><strong>Status:</strong> <button
    style={{
      backgroundColor: 'white',
      border: '1px solid rgba(128, 128, 128, 0.5)', 
      color: 'blue', 
      borderRadius: '8px' 
    }}
  ><strong>• {task.status}</strong></button></p> 
)}

                  <p><strong>Deadline:</strong> {formatDate(task.deadline)}</p>
                  <p><strong>Priority:</strong> {task.priority}</p>
                  <p><strong>Description:</strong> {task.description}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
