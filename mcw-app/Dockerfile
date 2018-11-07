FROM node:10.13-alpine

RUN npm install -g @angular/cli
#RUN apk update && apk add xvfb libxfont xorg-server chromium
# to test...
# /usr/bin/Xvfb :99 & #run Xvfb in background
# export DISPLAY=:99.0 #export the display environment var
# export CHROME_BIN=chromium-browser

#VOLUME /root/work

WORKDIR /root

COPY package.json package-lock.json ./
RUN npm install

COPY tsconfig.json tslint.json angular.json .editorconfig ./
COPY e2e e2e
COPY src src

EXPOSE 4200
# karma testing
EXPOSE 9876
