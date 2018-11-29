# Courtesy of Jorge Cabrera Mora, as part of our CS 385 Lab 6 
# https://github.com/jcabmora
# https://jcabmora.github.io/cs385fa18/labs/lab06/lab06.html
FROM mariadb:10.3.10-bionic

COPY scripts/sql/* /docker-entrypoint-initdb.d
COPY mariadb/docker-entrypoint.sh /usr/local/bin/
