# PowerShell script to start the frontend
Write-Host "Starting SabPaisa Tokenization Frontend..." -ForegroundColor Green
Write-Host ""
Write-Host "The application will open at http://localhost:3000" -ForegroundColor Yellow
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

# Use npx to ensure react-scripts is found
npx react-scripts start