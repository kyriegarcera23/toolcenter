FROM node:alpine

WORKDIR /app
COPY package.json ./
RUN npm install
RUN npm install -g concurrently
RUN npm install -g forever
COPY ./ ./

CMD ["concurrently", "npm:prod", "npm:email", "npm:queue"]