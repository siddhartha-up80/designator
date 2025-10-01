@echo off
echo ================================================
echo Prisma Setup Script for Windows
echo ================================================
echo.

echo Step 1: Checking if dev server is running...
echo If you have VS Code or npm dev running, please close them first.
echo.
pause

echo Step 2: Generating Prisma Client...
call npx prisma generate
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Failed to generate Prisma client.
    echo Try closing all Node processes and VS Code, then run again.
    echo.
    pause
    exit /b 1
)

echo.
echo Step 3: Pushing schema to database...
call npx prisma db push
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Failed to push schema to database.
    echo Check your DATABASE_URL in .env file.
    echo.
    pause
    exit /b 1
)

echo.
echo ================================================
echo ✅ SUCCESS! Prisma is set up correctly.
echo ================================================
echo.
echo You can now run: npm run dev
echo.
pause
