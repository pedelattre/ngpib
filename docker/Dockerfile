FROM node:6-alpine

LABEL authors="Vincent DAGOURY <vincent.dagoury@gmail.com>"

RUN apk update && apk add --update alpine-sdk
RUN npm cache clear
RUN npm install -g @angular/cli@latest
RUN npm rebuild node-sass --force
RUN ng set --global packageManager=yarn
RUN apk del alpine-sdk
RUN rm -rf /tmp/* /var/cache/apk/* *.tar.gz ~/.npm
RUN sed -i -e "s/bin\/ash/bin\/sh/" /etc/passwd