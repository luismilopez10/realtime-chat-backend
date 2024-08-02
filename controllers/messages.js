const Message = require('../models/message');

const getChat = async (req, res) => {
    const myId = req.uid;
    const messagesFrom = req.params.from;

    const lastMessages = await Message.find({
        $or: [{ from: myId, to: messagesFrom }, { from: messagesFrom, to: myId }]
    })
        .sort({ createdAt: 'desc' });

    res.json({
        ok: true,
        messages: lastMessages
    });
}

module.exports = {
    getChat,
}