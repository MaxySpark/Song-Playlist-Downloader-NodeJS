@ECHO OFF
TITLE "SONG & PLAYLIST DOWNLOADER by MaxySpark"
ECHO "SONG & PLAYLIST DOWNLOADER by MaxySpark"
IF EXIST %CD%\node_modules\NUL GOTO :1
ECHO "INSTALLING NODE MODULES PLEASE WAIT..."
call npm install
:1  
    call npm install
    ECHO [A] DOWNLOAD FROM song.txt
    ECHO [B] DOWNLOAD SINGLE SONG BY SEARCH
    SET /P option=ENTER YOUR CHOICE : 
    GOTO :%option%
    :A
    ECHO.
    node app
    ECHO.
    ECHO [1] DOWNLOAD ANOTHER SONG
    ECHO [2] EXIT
    SET /P choice=ENTER YOUR CHOICE : 
    GOTO :%choice%
    :B
    ECHO.
    node search
    ECHO.
    ECHO [1] DOWNLOAD ANOTHER SONG
    ECHO [2] EXIT
    SET /P choice=ENTER YOUR CHOICE : 
    GOTO :%choice%
:2
EXIT