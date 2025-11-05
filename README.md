# Student Assignment Management System

A modern web application for managing student assignments, group collaborations, and academic progress tracking. Built with React and designed for both professors and students.

## Features

### For Professors
- **Course Management**: Create and manage multiple courses with detailed information
- **Assignment Creation**: Design assignments with flexible submission types (individual/group)
- **Progress Tracking**: Real-time analytics on student submissions and completion rates
- **Deadline Management**: Set and monitor assignment deadlines with visual indicators

### For Students  
- **Assignment Dashboard**: Clean overview of all courses and pending assignments
- **Group Collaboration**: Form or join study groups for group assignments
- **Progress Visualization**: Track completion status with interactive progress bars
- **Submission Tracking**: Acknowledge assignment submissions with timestamp records

## Tech Stack

- **Frontend**: React 18, Vite
- **Styling**: Tailwind CSS with custom components
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Routing**: React Router DOM
- **Date Handling**: date-fns

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd student-assignment-management
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

## Demo Accounts

For testing purposes, use these demo accounts:

**Professor Account:**
- Email: `professor@test.com`
- Password: `password`

**Student Account:**
- Email: `student@test.com`  
- Password: `password`

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── LoadingSpinner.jsx
│   └── Navbar.jsx
├── contexts/           # React context providers
│   └── AuthContext.jsx
├── pages/              # Main application pages
│   ├── AssignmentManagement.jsx
│   ├── Login.jsx
│   ├── ProfessorDashboard.jsx
│   ├── Register.jsx
│   ├── StudentAssignments.jsx
│   └── StudentDashboard.jsx
├── App.jsx             # Main app component
├── index.css           # Global styles
└── main.jsx           # Application entry point
```

## Key Features Explained

### Assignment Types
- **Individual Assignments**: Each student submits independently
- **Group Assignments**: Only group leaders can acknowledge submissions for the entire team

### Progress Tracking
The system uses localStorage to persist assignment acknowledgments and automatically updates progress indicators across the application.

### Responsive Design
Fully responsive interface that works seamlessly on desktop, tablet, and mobile devices.


## Course Structure

The application supports multiple courses with unique assignments:

- **CS101**: Computer Science fundamentals
- **CS201**: Data Structures & Algorithms  
- **CS301**: Database Management Systems
- **CS401**: Software Engineering

Each course has its own set of assignments, deadlines, and group configurations.

