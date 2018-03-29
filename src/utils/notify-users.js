export default (userIds, event, payload) => {
    for(const socket of global.sockets) {
        const {userId} = socket.handshake.query
        const found = userIds.find(uId =>
            uId.toString() === userId
        )
        if(found) {
            socket.emit(event, payload)
        }
    }
}