#!/bin/bash

############################
#

if [ ! -e to_delete ]
then
        mkdir to_delete
fi

# Génération des miniatures et de la page

for file in `ls | grep -v "write_to_delete.sh"`
do
        isto_delete="a"
        while :
        do
          echo $file' is to_delete ? [y|n]'
          read isto_delete  
          if [ "$isto_delete" = "n" -o "$isto_delete" = "y" -o "$isto_delete" = "N" -o "$isto_delete" = "Y" ]
          then 
            break
          fi;
        done 
        if [ $isto_delete = "y" ]
        then
          echo 'cp -r '$file' to_delete/stb_'$file''
          `cp -r $file to_delete/stb_$file`
        fi;
         
done

