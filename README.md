# Licence
This piece of code is [MIT licensed](./LICENSE)

<div align="center">
    <img src="images/license-MIT-blue.svg">
</div>

---


# Intro
Basic example how to use [yeap_app server](https://github.com/donDonald/yeap_app_server) framework 

---


# Quick start

### Install mocha test framework
```
$ npm install -g mocha
```

### Run databases
All tests use real databases.\
Prior running tests you shall have postgres up and running.

#### Run postgres
```
$ git clone https://github.com/donDonald/dev_factory_postgres12.git
$ cd dev_factory_postgres12
$ docker-compose up -d
```

### Run unit-test

```
$ cd yeap_app_server_example
$ npm install
$ npm test
```

### Start  server
```
$ npm start
```

Web services
- [localhost:3000](http://localhost:3000)

---




