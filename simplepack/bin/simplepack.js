#!/usr/bin/env node

/**
 * 处理多个文件
 */

let entry = './src/index.js'
let output = './dist/main.js'
let fs = require('fs')
let path = require('path')
let ejs = require('ejs')

let modules = []

// 编写loader，负责将结果进行更改，更改后继续走
let styleLoader = function (source) {
    // console.log(JSON.stringify(source).replace(/\\r|\\n/g, ''))
    // source代表的就是样式文件中的内容
    return `
        let style = document.createElement('style')
        style.innerText = ${JSON.stringify(source).replace(/\\r|\\n/g, '')}
        document.head.append(style)
    `
}

// 处理依赖关系
let script = fs.readFileSync(entry, 'utf8') // 入口文件代码
// 识别入口文件中 require 的模块，将地址替换为模块代码
script = script.replace(/require\(['"](.+?)['"]\)/g, function () {
    let name = path.join('./src', arguments[1]) // './a.js'
    let content = fs.readFileSync(name, 'utf8')
    // 如果是css结尾的
    if (/\.css$/.test(name)) {
        content = styleLoader(content)
    }
    modules.push({
        name,
        content
    })
    return `require('${name}')`
})

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
    <% for (let i = 0; i < modules.length; i++) {
        let module = modules[i]; %>,
        '<%- module.name %>': (function (module, exports, require) {
            eval(\`<%- module.content %>\`)
        })
    <% } %>
})`

let result = ejs.render(template, {
    entry,
    script,
    modules
})

fs.writeFileSync(output, result)
console.log('success')