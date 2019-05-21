let ejs = require('ejs')

let name = '德玛西亚'

var result = ejs.render('<a><%= name %></a>', {name})
console.log(result)
