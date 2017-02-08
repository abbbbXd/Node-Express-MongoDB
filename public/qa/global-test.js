//全局测试文件
var assert = require('chai').assert;

suite('Global Tests',function(){
	test('page has a valid title',function(){
		assert(document.title && document.title.match(/\s/) &&
			document.title.toUpperCase() !== 'TODO');
	});
});