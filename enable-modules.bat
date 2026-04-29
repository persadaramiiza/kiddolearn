@echo off
REM Enable All KiddoLearn Backend Modules (Windows)

echo.
echo [*] Enabling all KiddoLearn backend modules...
echo.

set APP_MODULE=src\app.module.ts

if not exist "%APP_MODULE%" (
    echo [X] Error: %APP_MODULE% not found!
    pause
    exit /b 1
)

REM Create backup
copy "%APP_MODULE%" "%APP_MODULE%.backup" >nul
echo [OK] Backup created: %APP_MODULE%.backup

REM Read file and replace commented modules
setlocal enabledelayedexpansion

for /f "delims=" %%i in ('type "%APP_MODULE%"') do (
    set "line=%%i"
    REM Uncomment ProfilesModule
    if "!line:~0,19!"=="    // ProfilesModule," (
        set "line=    ProfilesModule,"
    )
    REM Uncomment VideosModule
    if "!line:~0,17!"=="    // VideosModule," (
        set "line=    VideosModule,"
    )
    REM Uncomment QuizzesModule
    if "!line:~0,17!"=="    // QuizzesModule," (
        set "line=    QuizzesModule,"
    )
    REM Uncomment WatchHistoryModule
    if "!line:~0,22!"=="    // WatchHistoryModule," (
        set "line=    WatchHistoryModule,"
    )
    REM Uncomment HealthModule
    if "!line:~0,15!"=="    // HealthModule," (
        set "line=    HealthModule,"
    )
    echo !line!
)

echo.
echo [OK] Modules configuration updated
echo.
echo [*] Next steps:
echo     1. Ensure PostgreSQL is running: docker-compose up -d
echo     2. Restart the development server: npm run start:dev
echo     3. Open Swagger: http://localhost:3000/api/docs
echo.
echo [*] All modules are now enabled!
echo.
pause
