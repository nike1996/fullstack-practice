import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuid } from 'uuid';
import dbPromise from './database.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();
const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
}
app.use(cors(corsOptions));
// only for development (use env variable in production)
const SECRET = "mysecret";
app.use(express.json());
app.use(cookieParser());

function generateToken(user) {
    const payload = { id: user.id, email: user.email };
    return jwt.sign(payload, SECRET);
};

// middleware to authenticate jwt token
function authenticateToken(req, res, next) {
    // print cookies
    // console.log(req.cookies);
    const token = req.cookies.jwt;
    if (!token) {
        return res.sendStatus(401);
    }

    jwt.verify(token, SECRET, (err, payload) => {
        if (err) {
            return res.sendStatus(403);
        }

        req.user = payload;
        next();
    });
}

async function createUser(name, email, password) {
    const passwordHash = await bcrypt.hash(password, 10);
    const id = uuid();
    try {
        let db = await dbPromise;
        await db.run('INSERT INTO users (id, name, email, password_hash) VALUES (?, ?, ?, ?)', [id, name, email, passwordHash]);
        return { id, name, email, password_hash: passwordHash };
    } catch (error) {
        console.log(error);
    }

}

async function createUserHandler(req, res) {
    const { name, email, password } = req.body;
    createUser(name, email, password);
    res.status(201).send();
}

async function loginUser(req, res) {
    const { email, password } = req.body;
    let db = await dbPromise;
    const user = await db.get('SELECT * FROM users WHERE email = ?', [email]);
    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
        return res.status(401).json({ error: 'Invalid email or password' });
    }
    const token = generateToken(user);
    res.cookie('jwt', token, { httpOnly: true });
    res.status(200).json({ message: 'Logged in successfully' });
}

async function createTodo(task, user_id, status) {
    const id = uuid();
    let db = await dbPromise;
    await db.run('INSERT INTO todos (id, user_id, task, status) VALUES (?, ?, ?, ?)', [id, user_id, task, status]);
    return { id, user_id, task, status };
}

async function createTodoHandler(req, res) {
    const { id } = req.user;
    const { task, status } = req.body;
    createTodo(task, id, status);
    res.status(201).send();
}

async function getTodosHandler(req, res) {
    const { id } = req.user;
    let db = await dbPromise;
    const todos = await db.all('SELECT * FROM todos WHERE user_id = ?', [id]);
    res.status(200).json(todos);
}

async function updateTodoHandler(req, res) {
    try {
        const { task, status } = req.body;
        const { id } = req.params;
        let db = await dbPromise;
        if (task && status) {
            await db.run('UPDATE todos SET task = ?, status = ? WHERE id = ?', [task, status, id]);
        } else if (task) {
            await db.run('UPDATE todos SET task = ? WHERE id = ?', [task, id]);
        } else if (status) {
            await db.run('UPDATE todos SET status = ? WHERE id = ?', [status, id]);
        }
        res.status(200).json({ message: 'Todo updated successfully' });
    }
    catch (error) {
        res.status(500).send();
    }
}

async function deleteTodoHandler(req, res) {
    const { id } = req.params;

    let db = await dbPromise;
    await db.run('DELETE FROM todos WHERE id = ?', [id]);
    res.status(204).send();
}

async function generateSampleData(req, res) {
    console.log('Generating sample data');
    let users = [
        await createUser('user1', 'user1@gmail.com', 'password'),
        await createUser('user2', 'user2@gmail.com', 'password')
    ]
    console.log(users);
    let todos = [
        await createTodo('Task 1', users[0].id, 'pending'),
        await createTodo('Task 2', users[0].id, 'completed'),
        await createTodo('Task 3', users[1].id, 'pending')
    ]
    res.status(201).send();

}

app.get('/api/todos', authenticateToken, getTodosHandler); // get todos for a user
app.post('/api/signup', createUserHandler);
app.post('/api/login', loginUser);
app.post('/api/todos', authenticateToken, createTodoHandler); // create a todo for a user
app.put('/api/todos/:id', authenticateToken, updateTodoHandler);
app.delete('/api/todos/:id', authenticateToken, deleteTodoHandler);
app.post('/api/generate', generateSampleData);
app.get('/health', (req, res) => {
    res.status(200).send({ message: 'Server is running' });
});
const port = 3001;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
