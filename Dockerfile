FROM node:alpine

ENV APP_HOME /myapp

#RUN cd $APP_HOME && rm -rf *
ADD package.json /tmp/package.json
RUN cd /tmp && npm install
RUN mkdir -p $APP_HOME && mv /tmp/node_modules $APP_HOME

#RUN mkdir $APP_HOME
WORKDIR $APP_HOME
ADD . $APP_HOME
RUN ls -la
#RUN npm install

EXPOSE 80
EXPOSE 8080

CMD ["npm", "start"]
#CMD "xvfb-run -a ruby /myapp/main.rb"
#CMD (xvfb-run -a ruby main.rb)
