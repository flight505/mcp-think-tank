@echo off
echo Installing Think Tank MCP Server v1.0.5...

:: Create installation directory
set INSTALL_DIR=%USERPROFILE%\.mcp-think-tank
if not exist "%INSTALL_DIR%" mkdir "%INSTALL_DIR%"

:: Clone or update the repository
if not exist "%INSTALL_DIR%\repo\.git" (
  echo Cloning repository...
  git clone https://github.com/flight505/mcp-think-tank.git "%INSTALL_DIR%\repo"
) else (
  echo Updating repository...
  cd "%INSTALL_DIR%\repo"
  git pull
)

:: Install dependencies and build
cd "%INSTALL_DIR%\repo"
call npm install
call npm run build

:: Create executable batch file
set EXEC_DIR=%USERPROFILE%\AppData\Local\mcp-think-tank\bin
if not exist "%EXEC_DIR%" mkdir "%EXEC_DIR%"

echo @echo off > "%EXEC_DIR%\mcp-think-tank.bat"
echo cd /d "%INSTALL_DIR%\repo" >> "%EXEC_DIR%\mcp-think-tank.bat"
echo if not defined REQUEST_TIMEOUT set REQUEST_TIMEOUT=300 >> "%EXEC_DIR%\mcp-think-tank.bat"
echo node dist/server.js --request-timeout=%REQUEST_TIMEOUT% %* >> "%EXEC_DIR%\mcp-think-tank.bat"

:: Add to PATH
setx PATH "%PATH%;%EXEC_DIR%"

echo.
echo Installation complete!
echo.
echo Usage:
echo   Run 'mcp-think-tank' to start the server
echo   You can specify request timeout: set REQUEST_TIMEOUT=600 ^& mcp-think-tank
echo.
echo Claude Desktop Configuration:
echo   Edit: %%APPDATA%%\Claude\claude_desktop_config.json
echo.
echo Add the following to your config:
echo {
echo   "mcpServers": {
echo     "think-tool": {
echo       "command": "mcp-think-tank",
echo       "env": {
echo         "REQUEST_TIMEOUT": "300"
echo       }
echo     }
echo   }
echo }
echo.
echo Cursor Configuration:
echo   Settings ^> MCP Servers ^> Add New Server
echo   Name: think-tool
echo   Command: mcp-think-tank
echo.

pause 