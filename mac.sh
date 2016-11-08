echo "SONG & PLAYLIST DOWNLOADER by MaxySpark"
if [ ! -d "node_modules" ]; 
  then
  echo "INSTALLING NODE MODULES PLEASE WAIT..."
  npm install
fi
label=1
while [ $label -eq 1 ]
  do
    npm install
    echo "[A] DOWNLOAD FROM song.txt"
    echo "[B] DOWNLOAD SINGLE SONG BY SEARCH"
    echo ENTER YOUR CHOICE : 
    read option
    if [[ "$option" == "A" ]] || [[ "$option" == "a" ]]
      then
        node app
        echo "$option"
        echo [1] DOWNLOAD ANOTHER SONG
        echo [2] EXIT
        echo ENTER YOUR CHOICE : 
        read label
    fi
    if [[ "$option" == "B" ]] || [[ "$option" == "b" ]]
      then
        node search
        echo [1] DOWNLOAD ANOTHER SONG
        echo [2] EXIT
        echo ENTER YOUR CHOICE : 
        read label
    fi
  done  