import React, { useState, useEffect } from 'react';
import axios from 'axios';

const HomePage = () => {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        // Fetch tasks when the component mounts
        const fetchTasks = async () => {
            try {
                const response = await axios.get('/api/todo', {
                    withCredentials: true
                });
                setTasks(response.data);
            } catch (err) {
                setError('Failed to fetch tasks');
            }
        };

        fetchTasks();
    }, []);

    async function addTask() {
        if (!newTask.trim()) {
            setError('Task cannot be empty');
            return;
        }

        try {
            await axios.post('/api/todo', { task: newTask, status: 'pending' }, {
                withCredentials: true
            });
            setNewTask('');
            setError('');
            const response = await axios.get('/api/todo', {
                withCredentials: true
            });
            setTasks(response.data);
        } catch (err) {
            setError('Failed to add task');
        }
    };

    async function updateTaskStatus(id, status) {
        try {
            await axios.put(`/api/todo/${id}`, { status }, {
                withCredentials: true
            });
            const response = await axios.get('/api/todo', {
                withCredentials: true
            });
            setTasks(response.data);
        } catch (err) {
            setError('Failed to update task status');
        }
    };

    async function deleteTask(id) {
        try {
            await axios.delete(`/api/todo/${id}`, {
                withCredentials: true
            });
            const response = await axios.get('/api/todo', {
                withCredentials: true
            });
            setTasks(response.data);
        } catch (err) {
            setError('Failed to delete task');
        }
    };

    async function handleLogout() {
        try {
            await axios.post('/api/logout', {}, {
                withCredentials: true
            });
            // Redirect to login page or handle logout
        } catch (err) {
            setError('Failed to logout');
        }
    };

    return (
        <div>
            <header>
                <button onClick={handleLogout}>Logout</button>
                <input
                    type="text"
                    placeholder="Add new task"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                />
                <button onClick={addTask}>Add</button>
            </header>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <ul>
                {tasks.map((task) => (
                    <li key={task.id}>
                        <select
                            value={task.status}
                            onChange={(e) => updateTaskStatus(task.id, e.target.value)}
                        >
                            <option value="pending">Pending</option>
                            <option value="in progress">In Progress</option>
                            <option value="done">Done</option>
                            <option value="completed">Completed</option>
                        </select>
                        <span contentEditable>{task.task}</span>
                        <button onClick={() => deleteTask(task.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default HomePage;
