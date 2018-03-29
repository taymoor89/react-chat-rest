import mongoose, {Schema} from "mongoose";
const {ObjectId} = Schema

const messageSchema = new Schema({
    sender: {type: ObjectId, required: true},
    conversationId: {type: ObjectId, required: true},
    text: {type: String},
    media: {type: String},
    created_at: {type: Date, default: Date.now}
})

export default mongoose.model('Message', messageSchema)