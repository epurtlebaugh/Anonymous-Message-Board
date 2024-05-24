// api.js

'use strict';

const threads = require('../controllers/threads');
const replies = require('../controllers/replies');

module.exports = function (app) {
  
  app.route('/api/threads/:board')
    .post(threads.createThread)
    .get(threads.getThreads)
    .delete(threads.deleteThread)
    .put(threads.reportThread);
    
  app.route('/api/replies/:board')
    .post(replies.createReply)
    .get(replies.getReplies)
    .delete(replies.deleteReply)
    .put(replies.reportReply);
};
