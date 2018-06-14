'use strict';


const utils = require('./lib/utils');

const PARAMS_SYMBOL = Symbol('MidgeInjectParams');




class DicInjector extends Map {

	constructor() {
		super();
		this.set('$injector', this);
	}

	get(key, locals = {}) {

		if(!locals.hasOwnProperty(key) && !this.has(key)) {
			throw new Error(`Service '${key}' not found`);
		}
		return super.get(key);
	}

	invoke(fn, locals = {}) {
		fn = utils.annotate(fn, PARAMS_SYMBOL);
		try {
			return fn(...fn[PARAMS_SYMBOL].map(key => this.get(key, locals)));
		} catch(e) {
			e.message += '\n--> ' + fn.toString() + '\n';
			throw e;
		}

	}

}


module.exports = class Dic {

	constructor() {
		this._factories = new Map();
	}

	register(key, factory) {

		if(key && !factory && key.name && key.factory) {
			return this.register(key.name, key.factory);
		}

		this._factories.set(key, utils.annotate(factory, PARAMS_SYMBOL));
	}

	async boot() {

		let edges = [];

		for(let [key, factory] of this._factories) {

			let params = ['__MIDGE_ROOT_NODE__', ...factory[PARAMS_SYMBOL]];

			edges.push(...params.map(p => ([key, p])));

		}

		let bootOrder = utils.tsort(edges).reverse();
		bootOrder.shift();

		let injector = new DicInjector();

		for(let key of bootOrder) {

			if(injector.has(key)) {
				continue;
			}

			if(!this._factories.has(key)) {
				throw new Error(`Factory '${key}' not found`);
			}

			let factory = this._factories.get(key);

			//console.log(`Creating service: ${key}`);

			let service = await injector.invoke(factory);
			if(service === undefined) {
				throw new Error(`Factory '${key}' needs to return a service`);
			}

			injector.set(key, service);
		}

		return injector;

	}

}
