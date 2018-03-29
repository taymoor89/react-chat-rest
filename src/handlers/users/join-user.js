import { Router } from 'express'
import User from '../../models/user'
const router = new Router()

const joinUser = async (req, res, next) => {
    try {
        const {username, password} = req.body
        let user = await User.findOne({username, password})
        if(!user) {
            user = await User.create(req.body)
        }
        const result = {
            user,
            token: user.id
        }
        res.status(201).json(result)
    } catch (e) {
        next(e)
    }
}

router.post('/users', joinUser)

export default router;