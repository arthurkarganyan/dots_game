FROM node:alpine

ENV APP_HOME /myapp

ADD package.json /tmp/package.json
RUN cd /tmp && npm install
RUN mkdir -p $APP_HOME && mv /tmp/node_modules $APP_HOME

ARG DOMAIN_NAME
ENV DOMAIN_NAME $DOMAIN_NAME
ENV SERVER_PORT 3000
ENV WEBSOCKET_PORT 8080

WORKDIR $APP_HOME
ADD . $APP_HOME
RUN npm run build
#RUN ls -la

EXPOSE $SERVER_PORT
EXPOSE $WEBSOCKET_PORT

CMD ["npm", "start"]



# docker run -p 80:3000 dots
