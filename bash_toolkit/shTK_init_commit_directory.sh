#!/bin/bash

############################
#

# Génération des miniatures et de la page

for directory in `ls ../root`
do
  if [ ! -e ../root/$directory/commit ]
  then
    `mkdir ../root/$directory/commit` 
  fi
  
done

