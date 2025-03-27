
const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const app = express();
app.use(cors());
app.use(express.json()); // Middleware for handling JSON requests

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'my_database' // Ensure this matches your MySQL database name
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed: ' + err.stack);
        return;
    }
    console.log('Connected to MySQL database');
});

// Helper function to format ISO date string to MySQL compatible format (YYYY-MM-DD HH:MM:SS)
function formatDateForMySQL(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Add leading zero if needed
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}


app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    // SQL query to get user by email
    const selectQuery = 'SELECT * FROM users WHERE email = ?';

    db.query(selectQuery, [email], (err, result) => {
        if (err) {
            console.error('Error querying the database:', err);
            return res.status(500).json({ message: 'Error logging in' });
        }

        if (result.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const user = result[0];

        // Compare passwords
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
                return res.status(500).json({ message: 'Error comparing passwords' });
            }

            if (!isMatch) {
                return res.status(401).json({ message: 'Incorrect password' });
            }

            // Successful login
            return res.status(200).json({ success: true, message: 'Login successful' });
        });
    });
});


app.post('/api/addTask', (req, res) => {
    const { title, description, deadline, status, priority } = req.body;

    // Convert deadline to MySQL format
    const formattedDeadline = formatDateForMySQL(deadline);

    // SQL query to insert task data into the database
    const insertQuery = `
        INSERT INTO tasks (title, description, deadline, status, priority)
        VALUES (?, ?, ?, ?, ?)
    `;
    
    db.query(insertQuery, [title, description, formattedDeadline, status, priority], (err, result) => {
        if (err) {
            console.error('Error inserting task:', err);
            return res.status(500).json({ message: 'Error saving task', error: err });
        }
        return res.status(201).json({ message: 'Task added successfully', taskId: result.insertId });
    });
});

// Endpoint for user signup (You should add this to your existing backend code)
app.post('/api/signup', (req, res) => {
    const { username, email, password } = req.body;

    // You can add validation, hash the password, etc. before saving it to the database
    const insertQuery = `
        INSERT INTO users (username, email, password)
        VALUES (?, ?, ?)
    `;

    db.query(insertQuery, [username, email, password], (err, result) => {
        if (err) {
            console.error('Error signing up user:', err);
            return res.status(500).json({ message: 'Error signing up user', error: err });
        }
        return res.status(201).json({ message: 'User signed up successfully', userId: result.insertId });
    });
});


// Endpoint to update a task
app.put('/api/updateTask/:id', (req, res) => {
    const { id } = req.params;
    const { title, description, deadline, status, priority } = req.body;

    // Convert deadline to MySQL format
    const formattedDeadline = formatDateForMySQL(deadline);

    const updateQuery = `
        UPDATE tasks
        SET title = ?, description = ?, deadline = ?, status = ?, priority = ?
        WHERE id = ?
    `;

    db.query(updateQuery, [title, description, formattedDeadline, status, priority, id], (err, result) => {
        if (err) {
            console.error('Error updating task:', err);
            return res.status(500).json({ message: 'Error updating task', error: err });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Task not found' });
        }

        return res.status(200).json({ message: 'Task updated successfully' });
    });
});

// Endpoint to fetch all tasks
app.get('/api/getTasks', (req, res) => {
    const selectQuery = "SELECT * FROM tasks WHERE status != 'Completed'";
    
    db.query(selectQuery, (err, result) => {
        if (err) {
            console.error('Error fetching tasks:', err);
            return res.status(500).json({ message: 'Error fetching tasks', error: err });
        }
        return res.status(200).json(result); // Send the fetched tasks as the response
    });
});


app.get('/api/getall', (req, res) => {
    const selectQuery = "SELECT * FROM tasks ORDER BY status ASC, deadline DESC";
    
    db.query(selectQuery, (err, result) => {
        if (err) {
            console.error('Error fetching tasks:', err);
            return res.status(500).json({ message: 'Error fetching tasks', error: err });
        }
        return res.status(200).json(result); // Send the fetched tasks as the response
    });
});

// Endpoint to delete a specific task by its ID
app.delete('/api/deleteTask/:id', (req, res) => {
    const { id } = req.params;

    // SQL query to delete a task by its ID
    const deleteQuery = 'DELETE FROM tasks WHERE id = ?';

    db.query(deleteQuery, [id], (err, result) => {
        if (err) {
            console.error('Error deleting task:', err);
            return res.status(500).json({ message: 'Error deleting task', error: err });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Task not found' });
        }

        return res.status(200).json({ message: 'Task deleted successfully' });
    });
});

// Check if the API is working
app.get('/', (req, res) => {
    res.json("Backend is running successfully");
});

app.listen(8081, () => {
    console.log("Server is listening on port 8081");
});
