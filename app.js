var express = require('express')
var app = express()
app.set('view engine', 'jade')
app.use(express.static(__dirname + '/'));


app.get('/', function (req, res) {
  res.render('page', {});
})
var port = process.env.PORT || 3000;


var server = app.listen(port, function () {

  var host = server.address().address
  var port = server.address().port

  console.log('Listening at http://%s:%s', host, port)

})
