#!/bin/bash
# Courtesy of Jorge Cabrera Mora, as part of our CS 385 Lab 6 
# https://github.com/jcabmora
# https://jcabmora.github.io/cs385fa18/labs/lab06/lab06.html
set pipefail

# remove all the running  containers
docker rm -fv social-network-dev > /dev/null

docker run -d --name social-network-dev -e JWT_SECRET_KEY=minibank -p 8080:80 --network social gcr.io/ssu-social-network/ssu-social-network:latest
