const chatModel = require('../models/chat.model');
const messageModel = require('../models/message.model');


async function createChat(req, res) {
    try {
        const { title } = req.body;
        const user = req.user;

        const chat = await chatModel.create({
            user: user._id,
            title
        });

        res.status(201).json({
            message: "Chat created successfully",
            chat: {
                _id: chat._id,
                title: chat.title,
                lastActivity: chat.lastActivity,
                user: chat.user
            }
        });
    } catch (error) {
        console.error('Create chat error:', error);
        res.status(500).json({ message: "Internal server error" });
    }
}

async function getChats(req, res) {
    try {
        const user = req.user;

        const chats = await chatModel.find({ user: user._id });

        res.status(200).json({
            message: "Chats retrieved successfully",
            chats: chats.map(chat => ({
                _id: chat._id,
                title: chat.title,
                lastActivity: chat.lastActivity,
                user: chat.user
            }))
        });
    } catch (error) {
        console.error('Get chats error:', error);
        res.status(500).json({ message: "Internal server error" });
    }
}

async function getMessages(req, res) {
    try {
        const chatId = req.params.id;

        const messages = await messageModel.find({ chat: chatId }).sort({ createdAt: 1 });

        res.status(200).json({
            message: "Messages retrieved successfully",
            messages: messages
        });
    } catch (error) {
        console.error('Get messages error:', error);
        res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = {
    createChat,
    getChats,
    getMessages
};