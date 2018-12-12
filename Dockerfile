# Builds a debian container running node.js
FROM node

WORKDIR /home/node/

# Install tools for compiling/building JS dependencies
# i.e. bcrypt, etc.
RUN apt-get update && \ 
    apt-get install -y build-essential python bcrypt

COPY src/social-network/package.json /home/node/
RUN npm install 

COPY src/social-network/ /home/node/
ENV GOOGLE_APPLICATION_CREDENTIALS /home/node/storage.json

# Start the node server, and log to the current directory
CMD ["/bin/sh", "-c", "npm start > server.log"]
