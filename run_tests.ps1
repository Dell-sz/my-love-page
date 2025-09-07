# PowerShell script to run Playwright tests and generate reports

# Install dependencies if not installed
if (-not (Get-Command "npx" -ErrorAction SilentlyContinue)) {
    Write-Host "npx not found. Please install Node.js and npm first."
    exit 1
}

Write-Host "Installing Playwright and dependencies..."
npx playwright install

Write-Host "Running Playwright tests..."
npx playwright test --reporter=list,json

Write-Host "Tests completed. Reports generated in playwright-report directory."
