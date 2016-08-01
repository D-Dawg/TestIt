#TestIt

[![Build Status](https://travis-ci.org/Proxey/TestIt.svg?branch=master)](https://travis-ci.org/Proxey/TestIt) [![dependencies Status](https://david-dm.org/Proxey/Ilogger/status.svg)](https://david-dm.org/Proxey/TestIt)

##Build docker image
Doesn' require any configuration or dependencies (like npm install)
```bash
$ docker build -t testit .
```
##Run docker image
Tweak env.list.default into env.list.
Then run:

```bash
$ docker run --env-file env.list -p 8080:8080 -tdi testit
```
