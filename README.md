# Todo Application

A full-stack Todo application with React frontend, Node.js backend, and comprehensive testing.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Testing](#testing)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Troubleshooting](#troubleshooting)

## Prerequisites

Ensure you have these installed:
- Node.js v16 or higher
- npm v8 or higher
- Git

## Installation

1. Clone the repository:
```bash
git clone https://github.com/your-repo/todo-app.git
cd todo-app
```

2. Install backend dependencies:
```bash
cd backend
npm install
cd ..
```

3. Install frontend dependencies:
```bash
cd frontend
npm install
cd ..
```

4. Install test dependencies (optional):
```bash
cd tests/api
npm install
cd ../ui
npm install
cd ../..
```

## Running the Application

### Start Backend Server
```bash
cd backend
npm start
```
Server runs at `http://localhost:3001`

### Start Frontend Development Server
```bash
cd frontend
npm start
```
Application opens at `http://localhost:3000`

## Testing

### API Tests
```bash
cd tests/api
npm test
```

### UI Tests
```bash
cd tests/ui
npx playwright test
```

#### For visual debugging:
```bash
npx playwright test --headed
```

## Generate Test Reports

First install Allure globally:
```bash
npm install -g allure-commandline
```

Then generate reports:

### For API tests
```bash
allure generate tests/api/allure-results --clean -o reports/api-report
```

### For UI tests
```bash
allure generate tests/ui/allure-results --clean -o reports/ui-report
```

### Combined report
```bash
mkdir -p reports/combined
cp tests/api/allure-results/* reports/combined/ 2>/dev/null || :
cp tests/ui/allure-results/* reports/combined/ 2>/dev/null || :
allure generate reports/combined --clean -o reports/full-report
allure open reports/full-report
```

## Project Structure
```
todo-app/
├── backend/          # Node.js API
│   ├── src/          # Source files
│   ├── .env          # Environment config
│   └── package.json
├── frontend/         # React application
│   ├── src/          # React components
│   └── package.json
└── tests/
    ├── api/          # API tests (Mocha)
    └── ui/           # UI tests (Playwright)
```

## Environment Variables

Create `.env` file in `backend/`:
```env
JWT_SECRET=your_jwt_secret_key_here
PORT=3001
DB_URI=mongodb://localhost:27017/todo-dev
```
