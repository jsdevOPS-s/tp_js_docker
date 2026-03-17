FROM node:20.x-alpine AS builder

# creer le repertoire app
WORKDIR /app

RUN *.json ./
RUN npm install

COPY . .

EXPOSE 8081

# demarrer l'app
CMD ["npm", "start"]

