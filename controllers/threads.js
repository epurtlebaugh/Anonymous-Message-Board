const Thread = require('../models/thread');

exports.createThread = async (req, res) => {
    const { board } = req.params;
    const { text, delete_password } = req.body;
    try {
        const newThread = new Thread({ board, text, delete_password });
        const savedThread = await newThread.save();
        res.json(savedThread);
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getThreads = async (req, res) => {
    try {
        const { board } = req.params;

        const threads = await Thread.find({ board })
            .sort({ bumped_on: -1 })
            .limit(10)
            .lean();

        const sanitizedThreads = threads.map(thread => {
            const sanitizedThread = {
                _id: thread._id,
                board: thread.board,
                text: thread.text,
                created_on: thread.created_on,
                bumped_on: thread.bumped_on,
                replies: thread.replies.slice(-3).map(reply => ({
                    _id: reply._id,
                    text: reply.text,
                    created_on: reply.created_on
                }))
            };
            return sanitizedThread;
        });

        return res.json(sanitizedThreads);
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.deleteThread = async (req, res) => {
    const { board } = req.params;
    const { thread_id, delete_password } = req.body;
    try {
        const thread = await Thread.findOne({ _id: thread_id, board });
        if (!thread || thread.delete_password !== delete_password) {
            return res.send('incorrect password');
        }
        await Thread.deleteOne({ _id: thread_id });
        res.send('success');
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.reportThread = async (req, res) => {
    const { board } = req.params;
    const { thread_id } = req.body;
    try {
        await Thread.findByIdAndUpdate(thread_id, { reported: true });
        res.send('reported');
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
};
