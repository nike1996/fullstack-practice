import sqlite3 from 'sqlite3';
// import sqlite from 'sqlite';
import { open } from 'sqlite';
// const db = new sqlite3.Database('database.db');
//
// db.serialize(() => {
//     db.run('CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, email TEXT UNIQUE NOT NULL, password_hash TEXT NOT NULL)');
//
//     db.run(`CREATE TABLE IF NOT EXISTS todos (id TEXT PRIMARY KEY, user_id TEXT NOT NULL, task TEXT, status TEXT, FOREIGN KEY(user_id) REFERENCES users(id))`);
//
//     db.run('CREATE INDEX IF NOT EXISTS user_id_index ON todos(user_id)');
// })

let dbPromise = open({
    filename: 'database.db',
    driver: sqlite3.Database
})

dbPromise = dbPromise.then(async db => {
    await db.run(
        'CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, email TEXT UNIQUE NOT NULL, password_hash TEXT NOT NULL)',
    )
    await db.run(
        'CREATE TABLE IF NOT EXISTS todos (id TEXT PRIMARY KEY, user_id TEXT NOT NULL, task TEXT, status TEXT, FOREIGN KEY(user_id) REFERENCES users(id))',
    )
    await db.run(
        'CREATE INDEX IF NOT EXISTS user_id_index ON todos(user_id)',
    )
    return db
})

export default dbPromise;
