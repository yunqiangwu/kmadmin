const mock = {}
if(1==1){
  require('fs').readdirSync(require('path').join(__dirname + '/src/mock')).forEach(function(file) {
    Object.assign(mock, require('./src/mock/' + file))
  })
}
module.exports = mock
