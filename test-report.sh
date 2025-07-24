#!/bin/bash

# API Testing with Mocha and Allure Report Generation 
cd tests/api

# Install dependencies
npm install -y 

# Run tests (generates allure-results)
npm test

# Generate Allure report (run from tests/api)
allure generate allure-results --clean -o allure-report


# UI Testing with Playwright and Allure Report Generation
cd ../ui/

# Install dependencies
npm install -y

# Run tests (generates allure-results)
npx playwright test --reporter=allure-playwright

# Generate Allure report (run from tests/ui)
allure generate allure-results --clean -o allure-report

# From project root (todo-app/)
cd ../..
mkdir -p combined-results
cp tests/api/allure-results/* combined-results/ 2>/dev/null || :
cp tests/ui/allure-results/* combined-results/ 2>/dev/null || :
allure generate combined-results --clean -o combined-report
allure open combined-report