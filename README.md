# Todo Application

A full-stack Todo application with React frontend, Node.js backend, and comprehensive testing.

## Prerequisites

Ensure you have these installed:
- Node.js v16 or higher
- npm v8 or higher
- Git

## Installation

1. Clone the repository:
```bash
git clone https://github.com/Mivics1/Test_ReactApp.git
cd Test_ReactApp
```
NOTE: From Step 2 to 4, the servers runs on seperate terminal 

2. Install backend dependencies and Start server, From project root (Test_ReactApp/):
```bash
./run-backend.sh
```

3. Install frontend dependencies and Start server, From project root (Test_ReactApp/):
```bash
./run-frontend.sh
```

4. Install test dependencies, run test and Generate Test Report, From project root (Test_ReactApp/):
```bash
./test-report.sh
```

#### For visual debugging:
```bash
npx playwright test --headed
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

