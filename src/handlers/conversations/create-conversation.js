import { Router } from 'express'
import Converstaion from '../../models/conversation'
import User from '../../models/user'
import { notifyUsers } from '../../utils'
const router = new Router()

const createConversation = async (req, res, next) => {
    try {
        const {userId} = req.params
        let {participants} = req.body
        let query = {
            participants: {
                $size: participants.length,
                $all: participants
            }
        }
        let conversation = await Converstaion.findOne(query)

        if(!conversation) {
            conversation = await Converstaion.create(req.body)
        }

        conversation = conversation.toObject()
        const participantIds = conversation.participants

        query = {
            _id: {
                $in: participantIds
            }
        }

        const projection = 'username name'
        const users = await User.find(query, projection)
        
        conversation.participants = conversation.participants.map(participantId =>
            users.find(user => 
                user._id.toString() === participantId.toString()
            )
        )
        res.json(conversation)

        notifyUsers(participantIds, 'new-chat', conversation)

    } catch (e) {
        next(e)
    }
}

router.post('/users/:userId/conversations', createConversation)

export default router