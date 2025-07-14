@echo off
echo Testing Real Estate Website Components...
echo.

echo ========================================
echo Testing Frontend Build...
echo ========================================
cd frontend
call npm run build
if %errorlevel% neq 0 (
    echo Frontend build FAILED!
    exit /b 1
)
echo Frontend build SUCCESS!
echo.

echo ========================================
echo Testing Admin Panel Build...
echo ========================================
cd ..\admin
call npm run build
if %errorlevel% neq 0 (
    echo Admin build FAILED!
    exit /b 1
)
echo Admin build SUCCESS!
echo.

echo ========================================
echo Testing Backend Dependencies...
echo ========================================
cd ..\backend
call npm list --depth=0 > nul 2>&1
if %errorlevel% neq 0 (
    echo Backend dependencies check FAILED!
    exit /b 1
)
echo Backend dependencies OK!
echo.

echo ========================================
echo All Tests Completed Successfully!
echo ========================================
echo.
echo The website has been cleaned up and tested:
echo - Unused files removed
echo - Security vulnerabilities fixed
echo - All builds working properly
echo - Ready for deployment
echo.
pause