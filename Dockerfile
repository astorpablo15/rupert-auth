FROM node:14-alpine3.10
WORKDIR /app
COPY . .
RUN npm install
CMD node server.js