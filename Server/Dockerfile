FROM node:18-alpine
LABEL maintainers="Andrea Basso, Riccardo Nalgi"

#EXPOSE 8080

# working dir
WORKDIR /app
# coping all files in this dir to /app dir in container
# the build environment must be the root. launch the build command from the root/Server
COPY . /app
RUN npm install
RUN npm run compile

CMD npm run start

#docker build --rm --tag taw-app .
# When you build your images add “–rm” this should help with removing any intermediate and none images.
# otherwise
# docker images
# docker rmi -f <$imageID>