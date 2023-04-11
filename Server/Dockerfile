FROM node:18-alpine
LABEL maintainers="Andrea Basso, Riccardo Nalgi"

EXPOSE 8080

# working dir
WORKDIR /app
# coping all files in current dir to /app dir in container
COPY . /app
RUN npm install
RUN npm run compile

CMD npm run start