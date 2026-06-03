@echo off
REM Beads: refresh workflow context when a Cursor session starts (uses absolute path so hooks work before PATH refresh).
if exist "%LOCALAPPDATA%\Programs\bd\bd.exe" (
  "%LOCALAPPDATA%\Programs\bd\bd.exe" prime
)
exit /b 0
