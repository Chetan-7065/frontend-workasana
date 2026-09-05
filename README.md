# Workasana App

A full-stack work management app to organize, track, and manage projects and tasks from start to finish.<br>
Built with react frontend, Express/Node backend , MongoDB database.

---

## Demo Link

[Link Demo](https://anvaya-crm-frontend-psi.vercel.app/)

---

## Quick Start

```
git clone https://github.com/Chetan-7065/-anvaya-crm-frontend.git
cd <your-repo>
npm install
npm run dev # or `npm start` / `yarn dev`
```

## Technologies

- React JS
- React Router
- Node JS
- Express
- MongoDB
- Zest
- JWT Auth

---

## Demo Video

Watch a walkthrough (5 minutes) of all the major features of this app:<br/>
[Loom Video](https://anvaya-crm-frontend-psi.vercel.app/)

---

## Features

**Signup**

- Register a new user with an email and password using JWT authentication.

**Login**

- Authenticate user credentials (email and password) and generate a JWT.

**Home**

- Display the newest projects and tasks .
- Quickly filter your tasks by their status using simple clickable buttons.
- Add new projects and tasks with just a single click.

**Project**

- See a complete view of every project, including their name, description and total tasks.
- Easily add new projects with just a single click .

**Project Details**

- See all details of a project including name , description and task details.
- Assign team members or update project details.

**Reports**

- Check quick pie chart to see the visual breakdown of completed tasks vs total number of tasks.
- View clear bar charts showing task completed by team, tasks completed by owners and pending tasks.

**Team**

- View full details for every team with their name and members.
- Easily add new team and add new members .

**Team Details**

- View all the details of specific team including the description and members.
- Quickly add new team members with just a single click.

**Task Details**

- View all the details of specific task including the name, team , project , owners , due on and status.
- Toggle task completion status with a single click.

**Setting**

- Delete the specific task from the system permanently.
- Download current tasks list into a CSV file.

---

## API Reference

### Project API

#### **Get /api/project**

List all projects <br>
Sample response <br>

```
[{id, name, description }, ...]
```

#### **Post /api/project**

Easily add a new <br>
Sample response <br>

```
{id, name, description }
```

### Team API

#### **Get /api/team**

List of all teams <br>
Sample response <br>

```
[{id, name, description, members}, ...]
```

#### **Post /api/team**

List of all teams <br>
Sample response <br>

```
{id, name, description, members}
```

#### **Post /api/team/:teamId**

Easily update a new team's information <br>
Sample response <br>

```
{id, name, description, members}
```

### Tag API

#### **Get /api/tag**

List of all tags <br>
Sample response <br>

```
[{id, tag}, ...]
```

#### **Post /api/tag**

Easily add a new tag <br>
Sample response <br>

```
{id, tag}
```

### Task API

#### **Get /api/tasks**

List of all tasks <br>
Sample response <br>

```
[{id, name, project, team, owners, tags, dueDate, timeToComplete, status  }, ...]
```

#### **Post /api/tasks**

Easily add a new task <br>
Sample response <br>

```
{id, name, project, team, owners, tags, dueDate, timeToComplete, status}
```

#### **Post /api/tasks/:taskId**

Easily update a new task's information<br>
Sample response <br>

```
{id, name, project, team, owners, tags, dueDate, timeToComplete, status }
```

#### **Delete /api/tasks/:taskId**

Easily delete a specific task<br>
Sample response <br>

```
{id, name, project, team, owners, tags, dueDate, timeToComplete, status }
```

### Reports API

#### **Get /api/report/last-week**

list of tasks which are completed in the last week.<br>
Sample response <br>

```
{id, name, source, agent, status, tags, timeToClose, priority}
```

#### **Get /api/report/pending**

list of tasks which are not completed.<br>
Sample response <br>

```
[{ totalTimePending, status},...]
```


#### **Get /api/report/closed-tasks**

list of tasks which are not completed.<br>
Sample response <br>

```
{
    byTeam: [
        {
          totalCompleted, team
        },...
    ],
    byOwners: [
        {
            totalCompleted, owner
        },...
    ],
    byProject: [
        {
            totalCompleted, project
        },...
    ]
}
```

## Contact

For bugs or feature requests, please reach out to chetanpathak3055@gmail.com
