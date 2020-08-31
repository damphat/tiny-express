var miniExpress = require('..');
var app = miniExpress();

var db = {
  users: {
    0: 'Mr Zero',
    1: 'Mr One',
    2: 'Ms Two'
  }
}


app.get('/users', function (req, res, next) {

  var html = '<body><ul>'
  html += Object.entries(db.users).map(e => `<li>
  <a href="/users/${e[0]}">${e[1]}</a>
  </li>`).join("");
  html += '</ul></body>';

    return res.end(html);
});

app.get('/users/:id', function (req, res, next) {
  var id = req.params.id;
  return res.end("Hi " + db.users[id]);
});

app.get('/', function (req, res, next) {
  res.end('<a href="/users">users</a>');
});

var server = app.listen(8080, function () {
  console.log('http server listen on port:' + server.address().port);
});
