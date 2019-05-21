#!/usr/bin/env node

/**
 * 处理单个文件，即不识别 require
 */

let entry = './src/index.js'
let output = './dist/main.js'
let fs = require('fs')
let ejs = require('ejs')

let script = fs.readFileSync(entry, 'utf8')

let template = `
(function (modules) {
    // require方法定义
    function require (moduleId) {
        var module = {
            exports: {}
        }
        modules[moduleId].call(module.exports, module, module.exports, require)
        return module.exports
    }

    return require('<%- entry %>');
})({
    '<%- entry %>': (function (module, exports, require) {
        eval(\`<%- script %>\`)
    })
})`

let result = ejs.render(template, {
    entry,
    script
})

fs.writeFileSync(output, result)
console.log('success')