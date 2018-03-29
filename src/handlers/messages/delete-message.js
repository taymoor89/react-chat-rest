import { Router } from 'express'
import Message from '../../models/message'
import Conversation from '../../models/conversation'
import User from '../../models/user'
import { notifyUsers } from '../../utils'
const router = new Router()

const addMessage = async (req, res, next) => {
    try {
        const {userId, id, messageId} = req.params
        
        const conversation = await Conversation.findById(id)
    
        if(!conversation) {
            next(new Error('Conversation Not Found'))
        }
        
        const query = {
            _id: messageId,
            conversationId: id,
            sender: userId
        }

        await Message.findOneAndRemove(query)
        res.status(204).send()

        const data = {
            chatId: id,
            messageId
        }
        notifyUsers(conversation.participants, 'delete-message', data)

    } catch (e) {
        next(e)
    }
}

router.delete('/users/:userId/conversations/:id/messages/:messageId', addMessage)

export default router