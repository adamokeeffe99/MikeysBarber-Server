import {mongoose} from '../connection.js'
const barberSchema = new mongoose.Schema({
    Month: String,
    Dates: [String],
    Hours: [String],
    Providers: String
}),
barber = mongoose.model("barber", barberSchema)
export default barber
