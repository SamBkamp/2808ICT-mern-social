FROM node:13
RUN mkdir -p /data/mern
WORKDIR /data/mern
COPY . ./
RUN npm install
CMD ["npm", "run", "development"]
