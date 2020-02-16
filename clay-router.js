/* eslint-disable no-dupe-class-members */


'use strict'
var express = require('express')

class ClayRouter {
	constructor(options){
		this.controllerPath = options.controllerPath,
		this.middlewarePath = options.middlewarePath,
		this.router = express.Router()
	}
	get group(){
		return this.group
	}
	get getHandlerController(){
		return this.getHandlerController
	}
	get getMiddleware(){
		return this.getMiddleware	
	}
	getHandlerController(handler){
		// eslint-disable-next-line no-undef
		let controleFile = `${process.env.PWD}/${this.controllerPath}/${handler.split('@')[0]}.js`
		let method = handler.split('@')[1]
		return require(controleFile)[method]
	}
	getMiddleware(handler){
		// eslint-disable-next-line no-undef
		let middlewareFile = `${process.env.PWD}/${this.middlewarePath}/${handler.split('@')[0]}.js`
		let method = handler.split('@')[1]
		return require(middlewareFile)[method]
	}
	group(path, middlewares, handlers){
		var middlewaresMethods= middlewares.map(m=>{return this.getMiddleware(m)})
		handlers.map(h=>{
			try {
				this.router[h.method](path+h.path,...middlewaresMethods,this.getHandlerController(h.handler))
			} catch (error) {
				console.log(error)
			}
		})

	}

}
module.exports = ClayRouter