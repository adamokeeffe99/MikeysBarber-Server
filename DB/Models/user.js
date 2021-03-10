import {mongoose} from '../connection.js'
const userSchema = new mongoose.Schema({
    firstName: String,
    Surname: String,
    Mobile: String,
    DOB: String,
    Medical_Card: Boolean,
    PPS_Number: String,
    Car_Reg: String,
    Surgery: Boolean,
    Appointments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Appointment"
    }]
})
user = mongoose.model("User", userSchema)
export default user