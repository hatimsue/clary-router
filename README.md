# clay-router
This is a package developed to group Express routes. Clay-router can help you to order your project splitting your router logic in controllers files and middlewares files.


**controler file** is a  javascript file which contains an object with methods to handle a particular route.


**middleware file** is a javascript file which contains an object with methods  to handle  routes before the route be handle by a controller method.




## Install

To start with clay-routes you have to install express and clay-router package.
```
$ npm install express

$ npm install clay-router
```
## How to use

1. Create  controllers and middlewares folders.

	```
	$ mkdir controllers
	$ mkdir middlewares
	```
2. Create  controllers and middlewares with the following schema.

	controllers/myIndexController.js

	```javascript
	let myIndexController = {
		myMethod1:(req,res)=>{
			res.send({msg:'this is the first method'})
		},
		myMethod2:(req,res)=>{
			//this method use a req.test value setted in the middleware file
			res.send({msg:req.test})
		}
	}

	module.exports = myIndexController
	```
	middlewares/myMiddleware.js

	```javascript
	let myMiddleware = {
		myMethod1:(req,res, next)=>{
			req.test = 'abcd'
			next()
		}
	}

	module.exports = myMiddleware
	```
	You can create controllers files an middlewares files as many  you want.

3. Create  an clay-router  instance.
	
	```javascript
	var clay = require('clay-router')
	clayRouter = new clay({
		controllerPath:'controllers',
		middlewarePath:'middlewares'
	})

	```

4. Group your routes and set the  controllers and middlewares.

	```javascript
	clayRouter.group('/test',['myMiddleware@myMethod1'],[
		{method:'get', path:'/test1',handler:'myIndexController@myMethod1'},
		{method:'get', path:'/test2',handler:'myIndexController@myMethod2'}
	])

	```

	Group has three arguments:

	- The principal  url ('/test')

	- An array of middlewares: a string with the following structure 	
		```
		'middlewarefilename@method'
		```

	- An array of routes: routes are objects with the following structure:


		```javascript
			{
				method:'get/post', 
				path:'subpath',
				handler:'controllerfilename@method'
			}
		```
5. Use the router property  to register your routes in your Express app. Your app file will looks like this.

	```javascript
	var express = require('express');
	var app = express();
	var clay = require('clay-router')


	clayRouter = new clay({
		controllerPath:'controllers',
		middlewarePath:'middlewares'
	})
	clayRouter.group('/test',['myMiddleware@myMethod1'],[
		{method:'get', path:'/test1',handler:'myIndexController@myMethod1'},
		{method:'get', path:'/test2',handler:'myIndexController@myMethod2'}
	])

	//you can use express methods in the router property object like that
	clayRouter.router.get('/index',(req,res)=>{
		res.send('index')
	})
	clayRouter.router.get('/example',(req,res)=>{
		res.send('example')
	})

	//register the routes
	app.use('/',clayRouter.router)

	app.listen(3000, function () {
		console.log('Example app listening on port 3000!');
	})
```
