import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const backendUrl = 'http://localhost:3001';

const HomePage = () => {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await axios.get(backendUrl + '/api/todos', {
                    withCredentials: true
                });
                setTasks(response.data);
            } catch (err) {
                if (err.response && err.response.status >= 400 && err.response.status < 500) {
                    navigate('/login');
                } else {
                    setError('Failed to fetch tasks');
                }
            }
        };

        fetchTasks();
    }, [navigate]);
    async function addTask() {
        if (!newTask.trim()) {
            setError('Task cannot be empty');
            return;
        }

        try {
            await axios.post(backendUrl + '/api/todos', { task: newTask, status: 'pending' }, {
                withCredentials: true
            });
            setNewTask('');
            setError('');
            const response = await axios.get(backendUrl + '/api/todos', {
                withCredentials: true
            });
            setTasks(response.data);
        } catch (err) {
            setError('Failed to add task');
        }
    };

    async function updateTaskName(id, name) {
        try {
            await axios.put(`${backendUrl}/api/todos/${id}`, { task: name }, {
                withCredentials: true
            });
            const response = await axios.get(backendUrl + '/api/todos', {
                withCredentials: true
            });
            setTasks(response.data);
        } catch (err) {
            setError('Failed to update task name');
        }
    }

    async function updateTaskStatus(id, status) {
        try {
            await axios.put(`${backendUrl}/api/todos/${id}`, { status }, {
                withCredentials: true
            });
            const response = await axios.get(backendUrl + '/api/todos', {
                withCredentials: true
            });
            setTasks(response.data);
        } catch (err) {
            setError('Failed to update task status');
        }
    };

    async function deleteTask(id) {
        try {
            await axios.delete(backendUrl + `/api/todos/${id}`, {
                withCredentials: true
            });
            const response = await axios.get(backendUrl + '/api/todos', {
                withCredentials: true
            });
            setTasks(response.data);
        } catch (err) {
            setError('Failed to delete task');
        }
    };

    const handleKeyPress = (e, id) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            updateTaskName(id, e.target.innerText);
            e.target.blur();
        }
    };

    return (
        <div>
            <header>
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
                        <span
                            contentEditable
                            onKeyPress={(e) => handleKeyPress(e, task.id)}
                        >
                            {task.task}
                        </span>
                        <button onClick={() => deleteTask(task.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default HomePage;
