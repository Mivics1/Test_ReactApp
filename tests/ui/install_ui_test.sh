# Initialize npm project
npm init -y

# Install Playwright
npm install @playwright/test

# Install browsers
npx playwright install

# Create test files
touch auth.test.js todos.test.js