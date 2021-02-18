// Setting up my User Schema
import { mongoose } from '../connection.js';
const userSchema = new mongoose.Schema({
    userName: String,
    password: String,
    Name: String,
    
    Resources: [String],
    
    Messages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    Matches: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    Sessions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Session"
    }]
}),
user = mongoose.model("User", userSchema)
export { user }
