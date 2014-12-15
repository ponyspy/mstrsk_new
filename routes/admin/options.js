var path = require('path');
var gm = require('gm').subClass({ imageMagick: true });

var appDir = path.dirname(require.main.filename);

exports.preview = function(req, res) {
  var files = req.files;
  var date = new Date();
  date = date.getTime();
  var newPath = '/images/preview/' + date + '.' + files.image.extension;

  gm(files.image.path).resize(1600, false).quality(80).write(appDir + '/public' + newPath, function() {
    res.send(newPath);
  });
}