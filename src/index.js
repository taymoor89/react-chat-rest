import 'babel-polyfill'
import http from 'http'
import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import socketIo from 'socket.io'
import logger from "morgan";

import {
    getUsers,
    getUser,
    joinUser
} from './handlers/users'

import {
    getConversations,
    createConversation
} from './handlers/conversations';

import {
    createMessage,
    getMessages,
    deleteMessage
} from './handlers/messages';

const app = express()
const server = http.Server(app)
const io = socketIo(server)
const port = process.env.PORT || 4000

global.sockets = []

io.on('connection', (socket) => {
    sockets.push(socket)
    socket.on('disconnect', () => {
        global.sockets = global.sockets.filter(sock => {
            return sock.id !== socket.id
        })
    })
});


// Connect to mongodb
mongoose.connect('mongodb://taymoor89:taymoor89@ds227469.mlab.com:27469/homelike')

app.use(logger('dev'))
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', (req, res) => {
    res.send({
        status: 'alive'
    })
})

app.use(getUsers)               // [GET]    /users
app.use(getUser)                // [GET]    /users/:userId
app.use(joinUser)               // [POST]   /users
app.use(getConversations)       // [GET]    /users/:userId/conversations
app.use(createConversation)     // [POST]   /users/:userId/conversations
app.use(getMessages)            // [GET]    /users/:userId/conversations/:id/messages
app.use(createMessage)          // [POST]   /users/:userId/conversations/:id/messages
app.use(deleteMessage)          // [DELETE] /users/:userId/conversations/:id/messages/:messageId

server.listen(port, () => console.log(`Listening on port ${port}`))