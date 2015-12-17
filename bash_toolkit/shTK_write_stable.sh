#!/bin/bash

############################
#

if [ ! -e stable ]
then
        mkdir stable
fi

# Génération des miniatures et de la page

for file in `ls | grep -v "write_stable.sh"`
do
        isStable="a"
        while :
        do
          echo $file' is stable ? [y|n]'
          read isStable  
          if [ "$isStable" = "n" -o "$isStable" = "y" -o "$isStable" = "N" -o "$isStable" = "Y" ]
          then 
            break
          fi;
        done 
        if [ $isStable = "y" ]
        then
          echo 'cp -r '$file' stable/stb_'$file''
          `cp -r $file stable/stb_$file`
        fi;
         
done

