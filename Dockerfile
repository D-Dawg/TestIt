FROM debian:jessie

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app


RUN apt-get update -y
RUN apt-get install -y curl
RUN curl -sL https://deb.nodesource.com/setup_4.x | bash -
RUN apt-get install -y nodejs ruby git
RUN npm install n grunt-cli bower -g
RUN n 4.4.7

RUN npm --version
RUN node --version

RUN gem install sass

COPY . /usr/src/app
RUN npm install
RUN bower install --allow-root
RUN grunt release

EXPOSE 8080
CMD [ "npm", "start" ]