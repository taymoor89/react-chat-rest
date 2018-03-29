import { Router } from 'express'
import Message from '../../models/message'
import User from '../../models/user'
import Conversation from '../../models/conversation'
import { notifyUsers } from '../../utils'
const router = new Router()

const addMessage = async (req, res, next) => {
    try {
        const {userId, id} = req.params
        const doc = {
            conversationId: id,
            sender: userId,
            text: req.body.text
        }

        const conversation = await Conversation.findById(id)
        
        let message = await Message.create(doc)
        const projection = 'username name'
        const user = await User.findById(userId, projection)
        message = message.toObject()
        message.sender = user
        res.status(201).json(message)
        
        const data = {
            chatId: conversation._id,
            message
        }
        notifyUsers(conversation.participants, 'new-message', data)

    } catch (e) {
        next(e)
    }
}

router.post('/users/:userId/conversations/:id/messages', addMessage)

export default router