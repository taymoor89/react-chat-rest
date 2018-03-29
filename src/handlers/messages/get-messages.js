import { Router } from 'express'
import { flatten } from 'lodash'
import Message from '../../models/message'
import User from '../../models/user';
const router = new Router()

const getMessages = async (req, res, next) => {
    try {
        const {id} = req.params
        let query = {conversationId: id}
        let messages = await Message.find(query)
        
        let participantsIds = messages.map(msg => msg.sender)
        query = {_id:{$in: participantsIds}}
        const projection = 'username name'
        const users = await User.find(query, projection)

        messages = messages.map(message => {
            message = message.toObject()
            message.sender = users.find(user => 
                user._id.toString() === message.sender.toString()
            )
            return message
        })
        res.json(messages)
    } catch (e) {
        next(e)
    }
}

router.get('/users/:userId/conversations/:id/messages', getMessages)

export default router