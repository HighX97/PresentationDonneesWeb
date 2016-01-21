#!/bin/bash

############################
#

# Génération des miniatures et de la page

for directory in `ls ../root`
do
  if [ ! -e ../root/$directory/COMMIT ]
  then
    `mkdir ../root/$directory/COMMIT` 
  fi
  
done

