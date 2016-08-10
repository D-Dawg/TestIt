#TestIt

[![Build Status](https://travis-ci.org/Proxey/TestIt.svg?branch=master)](https://travis-ci.org/Proxey/TestIt) [![dependencies Status](https://david-dm.org/Proxey/Ilogger/status.svg)](https://david-dm.org/Proxey/TestIt) [![license](https://img.shields.io/github/license/Proxey/TestIt.svg?maxAge=2592000)]()

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

#Docs

##Permissions

By default, everyone can only see and modify his own tests.

###ADMINISTRATION
Create, modify, delete other users. Edit own and other peoples permissions.

###VIEW_TESTS
View Tests that are not assigned to yourself.

###EDIT_TESTS
Edit Tests that are not assigned to yourself.

###VIEW_APPLICATION
Describes itself.

###EDIT_APPLICATION
Add, edit and delete applications. Add/modify/remove features, section, items, builds of an application.

###CREATE_TEST
Describes itself.

###ASSIGN_TEST
Change the assignee of a test.
