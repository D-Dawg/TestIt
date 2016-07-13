FROM debian:jessie

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app


RUN apt-get update -y

RUN apt-get install -y curl ruby git
RUN gem install sass

RUN git clone https://github.com/Proxey/TestIt.git .

RUN curl -sL https://deb.nodesource.com/setup_4.x | bash -
RUN apt-get install -y nodejs
RUN npm install n grunt-cli bower g
RUN n 5.9.1
RUN n --version
RUN npm --version
RUN node --version

RUN npm install
RUN bower install --allow-root
RUN grunt release

EXPOSE 8080
CMD [ "npm", "start" ]