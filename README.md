#TestIt

[![Build Status](https://travis-ci.org/Proxey/TestIt.svg?branch=master)](https://travis-ci.org/Proxey/TestIt)

##Build docker image
Doesn' require any configuration or dependencies (like npm install)
`$ docker build -t testit .`

##Run docker image
Tweak env.list.default into env.list.
Then run:
`§ docker run --env-file env.list -p 8080:8080 -tdi testit`