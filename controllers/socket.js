const User = require('../models/user');
const Message = require('../models/message');

const connectedUser = async (uid = '') => {
    const user = await User.findById(uid);
    user.online = true;

    await user.save();

    return user;
}

const disconnectedUser = async (uid = '') => {
    const user = await User.findById(uid);
    user.online = false;

    await user.save();

    return user;
}

const saveMessage = async (payload) => {
    /*
        payload: {
            from: '',
            to: '',
            message: ''
        } 
    */

    try {
        const message = Message(payload);
        const dbMessage = await message.save();

        return dbMessage;
    } catch (error) {
        return false;
    }
}

module.exports = {
    connectedUser,
    disconnectedUser,
    saveMessage,
}