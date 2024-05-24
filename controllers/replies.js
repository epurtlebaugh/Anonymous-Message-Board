const Thread = require('../models/thread');
const mongoose = require('mongoose');

exports.createReply = async (req, res) => {
    try {
        const { board } = req.params;
        const { thread_id, text, delete_password } = req.body;

        const foundThread = await Thread.findById(thread_id);
        if (!foundThread) {
            return res.status(404).json({ error: 'Thread not found' });
        }

        const newReply = {
            _id: new mongoose.Types.ObjectId(),
            text,
            created_on: new Date().toUTCString(),
            delete_password,
            reported: false
        };

        foundThread.replies.push(newReply);
        foundThread.bumped_on = new Date().toUTCString();
        await foundThread.save();

        return res.json(newReply);
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getReplies = async (req, res) => {
    try {
        const { board } = req.params;
        const { thread_id } = req.query;

        const foundThread = await Thread.findById(thread_id).lean();
        if (!foundThread) {
            return res.status(404).json({ error: 'Thread not found' });
        }

        delete foundThread.delete_password;
        delete foundThread.reported;
        foundThread.replycount = foundThread.replies.length;

        foundThread.replies = foundThread.replies.map(reply => ({
            _id: reply._id,
            text: reply.text,
            created_on: reply.created_on,
        }));

        return res.json(foundThread);
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.deleteReply = async (req, res) => {
    try {
        const { thread_id, reply_id, delete_password } = req.body;

        const foundThread = await Thread.findById(thread_id);
        if (!foundThread) {
            return res.status(404).json({ error: 'Thread not found' });
        }

        const reply = foundThread.replies.id(reply_id);
        if (!reply) {
            return res.status(404).json({ error: 'Reply not found' });
        }

        if (reply.delete_password !== delete_password) {
            return res.send('incorrect password');
        }

        reply.text = '[deleted]';
        await foundThread.save();

        return res.send('success');
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.reportReply = async (req, res) => {
    try {
        const { thread_id, reply_id } = req.body;

        const foundThread = await Thread.findById(thread_id);
        if (!foundThread) {
            return res.status(404).json({ error: 'Thread not found' });
        }

        const reply = foundThread.replies.id(reply_id);
        if (!reply) {
            return res.status(404).json({ error: 'Reply not found' });
        }

        reply.reported = true;
        await foundThread.save();

        return res.send('reported');
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
};
