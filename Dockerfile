FROM node:16.15.1

WORKDIR /usr/src/leitor-xml-backend

COPY . .

RUN npm install
RUN nest build

EXPOSE 8080

CMD [ "npm", "start" ]