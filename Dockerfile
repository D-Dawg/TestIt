FROM debian:jessie
MAINTAINER oberhofer.david@gmail.com

########################################
#Mongodb
########################################

# add our user and group first to make sure their IDs get assigned consistently, regardless of whatever dependencies get added
RUN groupadd -r mongodb && useradd -r -g mongodb mongodb

RUN apt-get update \
&& apt-get install -y --no-install-recommends \
numactl \
&& rm -rf /var/lib/apt/lists/*

# grab gosu for easy step-down from root
ENV GOSU_VERSION 1.7
RUN set -x \
&& apt-get update && apt-get install -y --no-install-recommends ca-certificates wget && rm -rf /var/lib/apt/lists/* \
&& wget -O /usr/local/bin/gosu "https://github.com/tianon/gosu/releases/download/$GOSU_VERSION/gosu-$(dpkg --print-architecture)" \
&& wget -O /usr/local/bin/gosu.asc "https://github.com/tianon/gosu/releases/download/$GOSU_VERSION/gosu-$(dpkg --print-architecture).asc" \
&& export GNUPGHOME="$(mktemp -d)" \
&& gpg --keyserver ha.pool.sks-keyservers.net --recv-keys B42F6819007F00F88E364FD4036A9C25BF357DD4 \
&& gpg --batch --verify /usr/local/bin/gosu.asc /usr/local/bin/gosu \
&& rm -r "$GNUPGHOME" /usr/local/bin/gosu.asc \
&& chmod +x /usr/local/bin/gosu \
&& gosu nobody true \
&& apt-get purge -y --auto-remove ca-certificates wget

# pub   4096R/A15703C6 2016-01-11 [expires: 2018-01-10]
#       Key fingerprint = 0C49 F373 0359 A145 1858  5931 BC71 1F9B A157 03C6
# uid                  MongoDB 3.4 Release Signing Key <packaging@mongodb.com>
RUN apt-key adv --keyserver ha.pool.sks-keyservers.net --recv-keys 0C49F3730359A14518585931BC711F9BA15703C6

ENV MONGO_MAJOR 3.3
ENV MONGO_VERSION 3.3.9

RUN echo "deb http://repo.mongodb.org/apt/debian jessie/mongodb-org/$MONGO_MAJOR main" > /etc/apt/sources.list.d/mongodb-org.list

RUN set -x \
&& apt-get update \
&& apt-get install -y \
mongodb-org-unstable=$MONGO_VERSION \
mongodb-org-unstable-server=$MONGO_VERSION \
mongodb-org-unstable-shell=$MONGO_VERSION \
mongodb-org-unstable-mongos=$MONGO_VERSION \
mongodb-org-unstable-tools=$MONGO_VERSION \
&& rm -rf /var/lib/apt/lists/* \
&& rm -rf /var/lib/mongodb \
&& mv /etc/mongod.conf /etc/mongod.conf.orig

RUN mkdir -p /data/db /data/configdb \
&& chown -R mongodb:mongodb /data/db /data/configdb
VOLUME /data/db /data/configdb

########################################
#TestIt
########################################

RUN apt-get update -y
RUN apt-get install -y curl ruby git
RUN gem install sass

RUN curl -sL https://deb.nodesource.com/setup_4.x | bash -
RUN apt-get install -y nodejs


RUN npm install n grunt-cli bower -g
RUN n 5.9.1
RUN n --version
RUN npm --version
RUN node --version

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY . /usr/src/app

RUN npm install
RUN bower install --allow-root
RUN grunt release

########################################
#Supervisor
########################################
RUN apt-get install -y supervisor

COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

EXPOSE 8080
CMD [ "/usr/bin/supervisord" ]