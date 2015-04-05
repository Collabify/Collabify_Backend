# Collabify_Backend
The Collabify backend. If you are contributing to this repo please add yourself to the contributers in the package.json file.

## Set Up
First clone the repo and `cd` into the Collabify_Backend folder. Next run `$ npm install` to install all of the dependencies. Don't forget to add a logs folder so the logger has somewhere to put log files.

## Usage
You can run the server by using the command `PORT=PORT_NUMBER HOST=HOSTNAME DB=DATABASE node server.js`.  PORT, HOST, and DB are optional and allow you to specify the port, hostname, and database used by the server.  By default, the server listens on port 1338 and on the 'localhost' interface (127.0.0.1).  Nginx, which listens on port 1337, will pass all REST endpoint requests to node at localhost:1338.  The default database is 'test'.

To add new modules run `npm install module --save` if it is required for running the server or `npm install module --save-dev` if it is a build tool like grunt or gulp and is not necessary for the server to run.

#### Logger
[Winston](https://github.com/winstonjs/winston "Winston docs") is configured in the logger.js file and is created in server.js. You can use winston for debugging in any module that you work on by adding `var logger = require('winston');` to the top of your module. Winston automatically uses the previously configured logger.

## Important Files and Folders

### controllers/
This folder should contain the controllers for each model or other endpoint. If you start naming files a certain way please maintain the same naming convention. You should export functions to handle http endpoints like so:
```
module.exports.delete = function(req, res) {
	// logic
}
```
or you can just export it at the end
```
var controller = {
	delete: function(req, res) {},
	...
}

module.exports = controller
```

### models/
Each model should have their own file here. Please do not add any business logic here, just define the model and export it. Once again keep please follow one naming convention.

### logger.js
This is the config file for the logger. Feel free to change it if you have improvements.

### mocks.js
This module contains mock data for each of the models, which can be used as a placeholder until more complete functionality is implemented.

### routes.js
As the name suggests, all of the routes are defined here. Basically this module will just define the routes and hands it off to the correct controller.

### server.js
This is where everything comes together. The only thing that still has to be figured out is the socket.io stuff but I think we can separate it out into a it's own file later on.