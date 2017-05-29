# Ngpib

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.0.4.

## Goal

This is the project for the POC named ngPIB.

## Mission

Bring information, code guidance and structural tests to help the construction of the real ngPIB.
__This is only a POC project__

## Fun stuffs

### Mocking authentication
NodeJs is used locally if devloppers want to mock Authentication but it's not the real and final mecanism.
If you want to switch authentication off go to app.routing.ts and comment ```canActivate: [ AuthGuard ]``` before restarting the app.

## Docker

A docker image is used to build locally or remotly (on AWS).
Ref [https://jaxenter.com/build-and-test-angular-apps-using-docker-132371.html]

The Source Dockerfile for docker image is located here : 
$BASEDIR/docker/Dockerfile

```
cd docker
docker build -t vincegy/angular-cli:version1.0 .
````

Use the docker image produced :

```
docker run --rm trion/ng-cli ng -v

docker run -it --rm -w /opt -v $(pwd):/opt -p 4200:4200 vincegy/angular-cli ng build

```



## AngularCLI specifics : 

### Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

### Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|module`.

### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

### Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

### Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).
Before running the tests make sure you are serving the app via `ng serve`.

### Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
