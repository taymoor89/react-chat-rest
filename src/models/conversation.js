import mongoose, {Schema} from "mongoose";
const {ObjectId} = Schema

const converstaionSchema = new Schema({
    participants: [{type: ObjectId}],
    created_at: {type: Date, default: Date.now}
})

export default mongoose.model('Conversation', converstaionSchema)