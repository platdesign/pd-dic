'use strict';


const { expect } = require('code');
const { getParams } = require('../lib/utils');
const Dic = require('../');



describe('dic', () => {

	it('should have $injector service', async () => {

		let dic = new Dic();

		let injector = await dic.boot()
		expect(injector.get('$injector'))
			.to.shallow.equal(injector);

	});

});


describe('annotation', () => {

	it('function', () => {

		let params = getParams(function(a,b,c){});

		expect(params)
			.to.equal(['a', 'b', 'c']);

	});

	it('async function', () => {

		let params = getParams(async function(a,b,c){});

		expect(params)
			.to.equal(['a', 'b', 'c']);

	});

	it('function named', () => {

		let params = getParams(function named$asd123_asd(a,b,c){});

		expect(params)
			.to.equal(['a', 'b', 'c']);

	});

	it('async function named', () => {

		let params = getParams(async function named$asd123_asd(a,b,c){});

		expect(params)
			.to.equal(['a', 'b', 'c']);

	});

	it('generator', () => {

		let params = getParams(function*(a,b,c){});

		expect(params)
			.to.equal(['a', 'b', 'c']);

	});


	it('generator named', () => {

		let params = getParams(function* asd(a,b,c){});

		expect(params)
			.to.equal(['a', 'b', 'c']);

	});


	it('asnyc generator', () => {

		let params = getParams(async function* (a,b,c){});

		expect(params)
			.to.equal(['a', 'b', 'c']);

	});


	it('asnyc generator named', () => {

		let params = getParams(async function* asd(a,b,c){});

		expect(params)
			.to.equal(['a', 'b', 'c']);

	});


	it('arrow', () => {

		let params = getParams((a,b,c) => {});

		expect(params)
			.to.equal(['a', 'b', 'c']);

	});


	it('async arrow', () => {

		let params = getParams(async (a,b,c) => {});

		expect(params)
			.to.equal(['a', 'b', 'c']);

	});


	it('arrow single param', () => {

		let params = getParams(a => {});

		expect(params)
			.to.equal(['a']);

	});

	it('async arrow single param', () => {

		let params = getParams(async a => {});

		expect(params)
			.to.equal(['a']);

	});


	it('class method', () => {

		class Test {
			static test(a) {

			}
		}

		let params = getParams(Test.test);

		expect(params)
			.to.equal(['a']);

	});

	it('async class method', () => {

		class Test {
			static async test(a) {

			}
		}

		let params = getParams(Test.test);

		expect(params)
			.to.equal(['a']);

	});


	it('async class generator', () => {

		class Test {
			static async *test(a) {

			}
		}

		let params = getParams(Test.test);

		expect(params)
			.to.equal(['a']);

	});


	it('class generator', () => {

		class Test {
			static *test(a) {

			}
		}

		let params = getParams(Test.test);

		expect(params)
			.to.equal(['a']);

	});




	it('function multiline', () => {

		let params = getParams(function(
			a, // asd
			b, /** asdasd */
			c
		) {

		});

		expect(params)
			.to.equal(['a', 'b', 'c']);

	});




});
