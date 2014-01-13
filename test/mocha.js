var request = require('superagent');
var should = require('should');

var index = require('../app.js');



describe('Status codes', function() {
    it('it should have status code 200', function(done) {
        request.get('http://localhost:3000/', function(response, err, body) {
            response.statusCode.should.equal(200);
            done();
        })
    });


    it('it should have status code 400', function(done) {
        request.put('http://127.0.0.1:3000/befriend/', function(response, err, body) {
            response.statusCode.should.equal(400);
            done();
        })
    });
    it('it should have status code 400 a', function(done) {
        request.put('http://127.0.0.1:3000/unfriend', function(response, err, body) {
            response.statusCode.should.equal(400);
            done();
        })
    });
    it('it should have status code 404', function(done) {
        request.get('http://127.0.0.1:3000/existerar_inte', function(response, err, body) {
            response.statusCode.should.equal(404);
            done();
        })
    });
    it('it should have status code 404', function(done) {
        request.post('http://127.0.0.1:3000/friends', function(response, err, body) {
            response.statusCode.should.equal(404);
            done();
        })
    });
    it('it should give either 200 or 400 depending whether user exists or not', function(done){
        request.post('http://127.0.0.1:3000/register?name=MochaLicshious&email=mocha@gmail.com&password=password', function(response, err, body){
            response.statusCode.should.equal(200);
            done();
        });
    });

    it('it should create a ball if we are logged in, else return status code 400', function(done){
        request.post('http://127.0.0.1:3000/ball/add_to_user?message=Testarnas bolligaste bolljekel&receiver_id=0', function(response, err, body){
            response.statusCode.should.equal(400);
            done();
        });
    });

    it('it should have status code 200', function(done){
        request.get('http://127.0.0.1:3000/search', function(response, err, body){
            response.statusCode.should.equal(200);
            done();
        });
    });
});
