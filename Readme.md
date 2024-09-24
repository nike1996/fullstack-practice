# Objective:

Develop a Todo Web Application where users can manage their daily tasks by storing them and updating their status. The application should support user authentication, task management, and profile management.

The Technologies you need to use are :-
1. ReactJS (Frontend)
2. Nodejs, Express for backend API
3. JWT for authentication
4. UUID for generating unique ID
5. SQLite3 for Database management

Functional Requirements:
User Authentication:
Implement a Signup feature where new users can register by providing necessary details.
Implement a Login feature where registered users can authenticate themselves using JWT tokens.
Secure the API routes by validating the JWT token to ensure only authenticated users can access certain features.
Todo Management:
Implement Create, Read, Update, Delete (CRUD) operations for managing daily tasks.
Allow users to add new tasks, view their list of tasks, edit existing tasks, and delete tasks they no longer need.
Enable users to update the status of each task. The available statuses should include "done," "pending," "in progress," and "completed."
User Profile Management:
Implement CRUD operations for managing the user’s profile.
Allow users to update their profile information, such as name, email, and password.
Ensure that profile updates are only accessible to the authenticated user.

Assignment Submission Guidelines: 

1) Submit your Github Repository link.
2) Submit your Deployed link.
3) Submit your loom video recording explaining about your project.


## db design

### users table 
```sql
CREATE TABLE users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
);
```
### todo table
```sql
Create table todo (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    task TEXT NOT NULL,
    status TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
-- create index on user_id
CREATE INDEX user_id_index ON todo (user_id);
```

## API design

### POST /api/Signup

Http Request

```http 
POST /api/signup HTTP/1.1

{
    "email": "shanny@gmail.com",
    "password": "shanny123"
}
```

Http Response
```http 
HTTP/1.1 200 OK
```

```http
HTTP/1.1 400 Bad Request
{
    "error": "Email already exists|Invalid email"
}
```

### POST /api/login

Http Request

```http
POST /api/login HTTP/1.1

{
    "email": "shanny@gmail.com",
    "password": "shanny123"
}
```

Http Response
```http 
HTTP/1.1 200 OK

Set-Cookie: jwt=<jwt>; HttpOnly
```

### GET /api/todo

Http Request

```http
GET /api/todo HTTP/1.1

Cookie: jwt=<jwt>
```

Http Response
```http
HTTP/1.1 200 OK

[
    {
        "id": "1",
        "task": "Buy groceries",
        "status": "pending"
    },
    {
        "id": "2",
        "task": "Buy groceries",
        "status": "pending"
    }
]
```

### POST /api/todo

Http Request

```Http
POST /api/todo HTTP/1.1

Cookie: jwt=<jwt>

{
    "task": "Buy groceries",
    "status": "pending"
}
```

Http Response
```Http
HTTP/1.1 200 OK
```

## Frontend design

### login page

form with email, password and Submit button

### Signup page

form with email, password, its confirmation, Signup button

### Home page

- Header with logout button
- input element in header with add button, placeholder: "Add new task"
- list of tasks
  - status (dropdown)
  - task name (content editable)
  - delete button


