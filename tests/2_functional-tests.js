const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);
let testReplyId;
let testThreadId;
let testThreadId2;
suite("Functional Tests", function() {
  suite("Thread Tests", function() {
   

    test("Creating 2 new threads", function(done) {
      chai
        .request(server)
        .post("/api/threads/test")
        .send({
          text: "testText",
          delete_password: "valid password"
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          testThreadId = res.body._id;
          
        });

      chai
        .request(server)
        .post("/api/threads/test")
        .send({
          text: "testText",
          delete_password: "valid password"
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          testThreadId2 = res.body._id;
          
          done();
        });
    });

    test("Viewing the 10 most recent threads with 3 replies each", function(done) {
      chai
          .request(server)
          .get('/api/threads/test')
          .end((err, res) => {
              assert.equal(res.status, 200);
              assert.isArray(res.body);
              assert.isAtMost(res.body.length, 10);
  
              res.body.forEach(thread => {
                  assert.isUndefined(thread.delete_password);
                  assert.isUndefined(thread.reported);
                  assert.isAtMost(thread.replies.length, 3);
              });
  
              done();
          });
  });
  

    test("Deleting a thread with the incorrect password", function(done) {
      chai
        .request(server)
        .delete("/api/threads/test")
        .send({
          thread_id: testThreadId,
          delete_password: "invalid password"
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.text, "incorrect password");
         
          done();
        });
    });

    test("Deleting a thread with the correct password", function(done) {
      chai
        .request(server)
        .delete("/api/threads/test")
        .send({
          thread_id: testThreadId2,
          delete_password: "valid password"
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.text, "success");
          
          done();
        });
    });

    test("Reporting a thread", function(done) {
      chai
        .request(server)
        .put("/api/threads/test")
        .send({
          thread_id: testThreadId
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.text, "reported");
        
          done();
        });
    });
  });

  suite("Reply Tests", function() {
 

    test("Creating a new reply", function(done) {
      chai
        .request(server)
        .post("/api/replies/test")
        .send({
          thread_id: testThreadId,
          text: "test text",
          delete_password: "valid password"
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          testReplyId = res.body._id;
          
          done();
        });
    });

    test("Viewing a single thread with all replies", function(done) {
      chai
        .request(server)
        .get("/api/replies/test")
        .query({ thread_id: testThreadId })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isArray(res.body.replies);
          
          done();
        });
    });

    test("Reporting a reply", function(done) {
      chai
        .request(server)
        .put("/api/replies/test")
        .send({
          thread_id: testThreadId,
          reply_id: testReplyId
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.text, "reported");
          
          done();
        });
    });

    test("Deleting a reply with the incorrect password", function(done) {
      chai
        .request(server)
        .delete("/api/replies/test")
        .send({
          thread_id: testThreadId,
          reply_id: testReplyId,
          delete_password: "invalid password"
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.text, "incorrect password");
          
          done();
        });
    });

    test("Deleting a reply with the correct password", function(done) {
      chai
        .request(server)
        .delete("/api/replies/test")
        .send({
          thread_id: testThreadId,
          reply_id: testReplyId,
          delete_password: "valid password"
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.text, "success");
         
          done();
        });
    });
  });
});
