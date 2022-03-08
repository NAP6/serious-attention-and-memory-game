FROM node:17-alpine

#Create a directory for the app
WORKDIR /usr/src/app

#Install dependencies
COPY package*.json ./
RUN npm install

#Copy the app
COPY ./dist/ ./dist/

#Run the app
EXPOSE 3000
CMD ["npm", "start"]