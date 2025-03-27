
import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import SideBar from './SideBar';
import { faTrash, faPen } from '@fortawesome/free-solid-svg-icons';
import '../CSS/Home.css';

const Tasks = () => {
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
    }
  };

  useEffect(() => {
    axios.get('http://localhost:8081/api/getall')
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  };

  // Calculate progress percentage
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === 'Completed').length;
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <div className={`app-container ${!sidebarOpen ? 'sidebar-closed' : ''}`}>
      <div className="sidebar">
        <SideBar />
      </div>

      <div className="content">
        <div className="hamburger" onClick={toggleSidebar}>
          ☰
        </div>

      
       
       

<h1 style={{
  // color: 'rgb(90, 80, 255)',
  color:'black',
  fontWeight: 'bold',
  fontSize: '36px',
  fontFamily: 'Cinzel, serif'
}}>
  Unlock Your Productivity
  <div className="progress-bar-container" style={{
    textAlign: 'right', 
    display: 'flex', 
    alignItems: 'center' 
  }}>
    <div className="progress-bar" style={{ width: `${progress}%` }}></div>
    <span style={{
      marginLeft: '10px', 
      fontSize: '18px',
      color:'black'
      // color: 'rgb(90, 80, 255)'
    }}>
      {(progress).toFixed(2)}%
    </span>
  </div>
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

        <div className="task-list">
          {tasks.length === 0 ? (
            <p>No tasks yet. Add one to get started!</p>
          ) : (
            <ul>
              {tasks.map((task, index) => (
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
                      <span><FontAwesomeIcon icon={faPen} style={{
                        marginRight: '8px'
                      }} /></span>Edit
                    </button>
                    <button onClick={() => deleteTask(task.id)} style={{
                      backgroundColor: 'black',
                      color: 'white',
                      fontWeight: 'bold',
                      borderRadius: '4px',
                      padding: '5px 10px',
                      margin: '2px'
                    }}>
                      <span style={{
                        marginRight: '8px'
                      }}><FontAwesomeIcon icon={faTrash} /></span>Delete
                    </button>
                    {/* <button onClick={() => openModal(task)} style={{
  backgroundColor: 'rgb(46, 204, 113)', // Green
  color: 'white',
  borderRadius: '4px',
  fontWeight: 'bold',
  padding: '5px 10px',
  margin: '2px',
  cursor: 'pointer',
  transition: 'background-color 0.3s ease'
}} onMouseOver={(e) => e.target.style.backgroundColor = 'rgb(39, 174, 96)'} onMouseOut={(e) => e.target.style.backgroundColor = 'rgb(46, 204, 113)'}> 
  <span><FontAwesomeIcon icon={faPen} style={{
    marginRight: '8px'
  }} /></span>Edit
</button>
<button onClick={() => deleteTask(task.id)} style={{
  backgroundColor: 'rgb(231, 76, 60)', // Red
  color: 'white',
  fontWeight: 'bold',
  borderRadius: '4px',
  padding: '5px 10px',
  margin: '2px',
  cursor: 'pointer',
  transition: 'background-color 0.3s ease'
}} onMouseOver={(e) => e.target.style.backgroundColor = 'rgb(192, 57, 43)'} onMouseOut={(e) => e.target.style.backgroundColor = 'rgb(231, 76, 60)'}> 
  <span style={{
    marginRight: '8px'
  }}><FontAwesomeIcon icon={faTrash} /></span>Delete
</button> */}

                  </div>

                  <h3>{task.title}</h3>
                 

{
  task.status === 'Not Started' ? (
    <p><strong>Status:</strong> <button
      style={{
        backgroundColor: 'white',
        border: '1px solid rgba(128, 128, 128, 0.5)',
        color: 'red',
        borderRadius: '8px'
      }}
    ><strong>• {task.status}</strong></button></p>
  ) : task.status === 'Completed' ? (
    <p><strong>Status:</strong> <button
      style={{
        backgroundColor: 'white',
        border: '1px solid rgba(128, 128, 128, 0.5)',
        color: 'green',
        borderRadius: '8px'
      }}
    ><strong>&#9733; {task.status}</strong></button></p>
  ) : (
    <p><strong>Status:</strong> <button
      style={{
        backgroundColor: 'white',
        border: '1px solid rgba(128, 128, 128, 0.5)',
        color: 'blue',
        borderRadius: '8px'
      }}
    ><strong>• {task.status}</strong></button></p>
  )
}

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

export default Tasks;
