@echo off
REM BioCompute Admin Portal - Quick Deploy Script for Windows
REM This script automates the deployment process

echo ========================================
echo BioCompute Admin Portal - Deployment
echo ========================================
echo.

REM Check if Docker is running
docker version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Docker is not running. Please start Docker Desktop.
    pause
    exit /b 1
)

REM Check if .env.production exists
if not exist .env.production (
    echo WARNING: .env.production file not found!
    echo Creating from example...
    copy .env.production.example .env.production
    echo.
    echo Please edit .env.production with your secure credentials before running again.
    pause
    exit /b 1
)

echo Environment file found: .env.production
echo.

REM Ask for deployment mode
echo Select deployment mode:
echo 1) Production (docker-compose.prod.yml)
echo 2) Development (docker-compose.dev.yml)
echo.
set /p choice="Enter choice [1-2]: "

if "%choice%"=="1" (
    set COMPOSE_FILE=docker-compose.prod.yml
    echo.
    echo Deploying in PRODUCTION mode
) else if "%choice%"=="2" (
    set COMPOSE_FILE=docker-compose.dev.yml
    echo.
    echo Deploying in DEVELOPMENT mode
) else (
    echo.
    echo Invalid choice
    pause
    exit /b 1
)

echo.
echo Building Docker images...
docker-compose -f %COMPOSE_FILE% build

echo.
echo Stopping existing containers...
docker-compose -f %COMPOSE_FILE% down

echo.
echo Starting containers...
docker-compose -f %COMPOSE_FILE% up -d

echo.
echo Waiting for services to be ready...
timeout /t 5 /nobreak >nul

echo.
echo Container status:
docker-compose -f %COMPOSE_FILE% ps

echo.
echo ========================================
echo Deployment complete!
echo ========================================
echo.
echo Quick commands:
echo   View logs: docker-compose -f %COMPOSE_FILE% logs -f
echo   Stop: docker-compose -f %COMPOSE_FILE% down
echo   Restart: docker-compose -f %COMPOSE_FILE% restart
echo.
if "%COMPOSE_FILE%"=="docker-compose.prod.yml" (
    echo Access your application: http://your-server-ip
) else (
    echo Access your application: http://localhost:8001
)
echo.
pause
