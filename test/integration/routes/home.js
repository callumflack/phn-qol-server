var path = require('path');
var request = require('supertest');
var assert = require('chai').assert;

var projectPath = path.join(__dirname, '../../../');
var app = require(path.join(projectPath, './app.js'));

module.exports = function() {
    describe('Running Express', function () {
        it('responds to base URL \'/\'', function(done) {
            this.timeout(5000);
            request(app)
                .get('/')
                .expect(200)
                .end(function(err, res) {
                    assert.isNull(err);
                    done();
                });
        });
    });
}