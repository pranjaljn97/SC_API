
describe('Task API Routes', function() {  
    // This function will run before every test to clear database
    beforeEach(function(done) {
        app.db.object = {};
        done();
    });

    describe('POST /login', function() {
        it('login into system and receive a token', function(done){

            request.post('/login')
                .set('Headers', 'Content-Type:application/json')
                .send({
                    uname: 'pranjaljn97',
                    pwd: 'pranjal_sc'
                })
                .expect(200)
                .end(function(err, res) {
                    var result = JSON.parse(res.text);
                      token = result.token;
                    expect(res.body).to.have.lengthOf(2);
                    done(err);
                });
        });
    });

    // Testing the route /applypatch for json patching
    describe('POST /applypatch', function() {

        var input = {
 "doc": {
  "baz": "qux",
  "foo": "bar"
},

"patch" : [
  { "op": "replace", "path": "/baz", "value": "booz" }
]

};
        it('patches a json object', function(done) {
            request.post('/applypatch')
                .send(input)
                .set('Headers', 'x-access-token:' + token)
                .expect(200)
                .end(function(err, res) {
                    expect(res.body).to.eql(input.doc);
                    done(err);
                });
        });

        it('Failed to authenticate token', function(done) {
            request.post('/applypatch')
                .send(input)
                .set('Headers', 'x-access-token:' + token)
                .expect(500)
                .end(function(err, res) {
                    done(err);
                });
        });



       it('No Token provided', function(done) {
            request.post('/applypatch')
                .send(input)
                .set('Headers', 'x-access-token:' + token)
                .expect(401)
                .end(function(err, res) {
                    done(err);
                });
        });









    });

    describe('POST /getThumbnail', function() {
        it('Gets thumbnail of public url image', function(done) {

            url = "https://s3.amazonaws.com/f6s-public/profiles/1388055_original.jpg";
            request.post('/getThumbnail')
                .send(url)
                .set('Headers', 'x-access-token:' + token)
                .expect(200)
                .end(function(err, res) {
                    expect(res.body).to.have.lengthOf(0);
                    done(err);
                });
        });
    });
    
});