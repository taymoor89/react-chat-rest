import { Router } from 'express'
import User from '../../models/user'
const router = new Router()

const getUsers = async (req, res, next) => {
    try {
        let query = {}
        const {searchTerm} = req.query
        
        if(searchTerm) {
            query = {name: {$regex: new RegExp(`${searchTerm}`, 'i')}}
        }

        const projection = 'name username'     
        const result = await User.find(query, projection)
        res.json(result)
    } catch(e) {
        next(e)
    }
}

router.get('/users', getUsers)

export default router