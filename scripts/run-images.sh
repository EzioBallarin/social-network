#!/bin/bash
# Courtesy of Jorge Cabrera Mora, as part of our CS 385 Lab 6 
# https://github.com/jcabmora
# https://jcabmora.github.io/cs385fa18/labs/lab06/lab06.html
set pipefail

# remove all the running  containers
docker rm -fv `docker ps -aq` > /dev/null

# Create minibank network if it does not exist
docker network ls -f "driver=bridge" | grep ' social ' > /dev/null || docker network create social 

docker run -d --name mysql -e MYSQL_ROOT_PASSWORD=hobbes -v `pwd`/scripts/sql:/docker-entrypoint-initdb.d:ro --network social gcr.io/ssu-social-network/ssu-mariadb:latest

sleep 5

docker run -d --name social-network -p 80:80 --network social gcr.io/ssu-social-network/ssu-social-network:latest
