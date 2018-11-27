# Builds a debian container running node.js
FROM node

WORKDIR /home/node/

# Install tools for compiling/building JS dependencies
# i.e. bcrypt, etc.
RUN apt-get update && \ 
    apt-get install -y build-essential python bcrypt

COPY src/social-network/ /home/node/
RUN npm install 

CMD ["npm", "start"]
