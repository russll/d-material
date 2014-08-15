Material = require './index.js'

module.exports = (app) ->
  app.use Material
  app.component MaterialExample

class MaterialExample
  view: __dirname + '/example'
  name: 'd-material-example'