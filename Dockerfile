FROM node:alpine

ENV APP_HOME /myapp
RUN mkdir $APP_HOME
WORKDIR $APP_HOME
ADD . $APP_HOME
RUN npm install

EXPOSE 80
EXPOSE 8080

#ENV DISPLAY localhost:1.0
#ENTRYPOINT ["xvfb-run"]

CMD ["npm", "start"]
#CMD "xvfb-run -a ruby /myapp/main.rb"
#CMD (xvfb-run -a ruby main.rb)
