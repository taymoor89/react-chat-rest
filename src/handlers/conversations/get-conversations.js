import { Router } from 'express'
import { flatten } from 'lodash'
import Converstaion from '../../models/conversation'
import User from '../../models/user';
const router = new Router()

const getConversations = async (req, res, next) => {
    try {
        const {userId} = req.params
        let query = {participants: userId}
        let conversations = await Converstaion.find(query)
        let participantsIds = flatten(
            conversations.map(conversation => conversation.participants)
        )
        query = {_id:{$in: participantsIds}}
        const projection = 'username name'
        const users = await User.find(query, projection)

        conversations = conversations.map(conversation => {
            conversation = conversation.toObject()
            conversation.participants = conversation.participants.map(participantId =>
                users.find(user => 
                    user._id.toString() === participantId.toString()
                )
            )
            return conversation
        })
        res.json(conversations)
    } catch (e) {
        next(e)
    }
}

router.get('/users/:userId/conversations', getConversations)

export default router