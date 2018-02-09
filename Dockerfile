FROM node:alpine

#RUN apt-get install -y \
#      libqt5webkit5-dev \
#      qt5-default \
#      xvfb \
#      gstreamer1.0-plugins-base \
#      gstreamer1.0-tools \
#      gstreamer1.0-x
#
#WORKDIR /tmp
#COPY Gemfile* /tmp/
#RUN bundle install

ENV APP_HOME /myapp
RUN mkdir $APP_HOME
WORKDIR $APP_HOME
ADD . $APP_HOME
#RUN npm install

EXPOSE 3000
EXPOSE 8080

#ENV DISPLAY localhost:1.0
#ENTRYPOINT ["xvfb-run"]

CMD ["npm", "start"]
#CMD "xvfb-run -a ruby /myapp/main.rb"
#CMD (xvfb-run -a ruby main.rb)