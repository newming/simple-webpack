/**
 * define 声明模块，通过 require 使用一个模块
 * define(模块名称，依赖，工厂函数)
 */
let factories = {}
function define(moduleName, dependencies, factory) {
    factory.dependencies = dependencies // 将依赖记录到 factory 函数上，在调用的时候(require)取出来
    factories[moduleName] = factory
}

function require(mods, callback) {
    let results = mods.map(function (mod) {
        let factory = factories[mod]
        let exports
        let dependencies = factory.dependencies // ['name']
        require(dependencies, function () {
            exports = factory.apply(null, arguments)
        })
        return exports
    })
    callback.apply(null, results)
}


define('name', [], function () {
    return 'this is name'
})

define('age', ['name'], function (name) {
    console.log(name)
    return 'this is age' + name
})

require(['age'], function (age) {
    console.log(age)
})
