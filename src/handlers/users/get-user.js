import { Router } from 'express'
import User from '../../models/user'
const router = new Router()

const getUsers = async (req, res, next) => {
    try {
        const {userId} = req.params
        const projection = 'name username'     
        const result = await User.findById(userId, projection)
        res.json(result)
    } catch(e) {
        next(e)
    }
}

router.get('/users/:userId', getUsers)

export default router