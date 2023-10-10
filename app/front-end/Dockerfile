FROM node:18.18.0

ENV PORT 3000

# Create app directory
RUN mkdir /var/movable/ && mkdir /var/movable/app
WORKDIR /var/movable/app

RUN rm -rf .next*
# Installing dependencies
COPY package*.json /var/movable/app/
RUN npm install

# Copying source files
COPY . /var/movable/app


# Building app
RUN npm run build
EXPOSE 3000

# Running the app
CMD "npm" "run" "start"