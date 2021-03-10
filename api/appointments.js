import {express} from '../Helpers_and_Imports/libs_required.js'
const  router = express.Router()
import appointment from '../DB/Models/appointment.js'

    // Router is mounted at /api/v1/appointments , all routes after this will be prefixed with this

router.get("/" , async(req,res) => {
    // queries.getAll(req , res , "Appointments")
    appointment.find({})
        .populate("Capacity")
        .exec((err, users) => {
            if (err) console.log(err)
            res.send(users);
        });
})

router.post("/" , async(req , res)=> {
const { firstName ,Surname , Mobile , DOB , Medical_Card , PPS_Number , Car_Reg , Surgery ,  Month , DayName , DayDate , Time } = req.body
    const userData = {
        firstName: firstName,
        Surname: Surname,
        Mobile: Mobile,
        DOB: DOB,
        Medical_Card: Medical_Card,
        PPS_Number:PPS_Number,
        Car_Reg: Car_Reg,
        Surgery: Surgery
    };
    let createdUser = await user.create(userData)
    let foundAppointment = await appointment.find({Time: Time, Month: Month, DayName: DayName , DayDate: DayDate})
    const foundUser = await user.findById(createdUser._id)
    if (foundAppointment.length !== 0) {
        await appointment.updateOne({ _id: foundAppointment[0]._id }, { $push: { Capacity: createdUser._id }});
        foundUser.Appointments.push(foundAppointment[0]._id);
    } else {
        let createdAppointment = await appointment.create({ 
            Month: Month,
            DayName: DayName,
            DayDate: DayDate,
            Time: Time,
            Capacity: createdUser._id
        })
        await createdAppointment.save();
        foundUser.Appointments.push(createdAppointment);
    }
    
    await foundUser.save();
    await user.findById(createdUser._id).populate("Appointments").exec((err, appointment_details) => {
        if (err) console.log(err)
        return res.send(appointment_details)
    });
    
})


router.get("/:id", async(req, res, next) => {
    try {
        const userFound = await user.findById(req.params.id).populate("Appointments").exec()
        if(!userFound) return next()
        return res.send(userFound)
    } catch (error) {
        next(error)
    }
})

router.put("/:id", async(req, res, next) => {
    try {
        const { userId , Time , DayDate , DayName , Month } = req.body,
        { id: appointment_id } = req.params,
        user_Found = await user.findById(userId),
        oldAppointment = await appointment.findById(appointment_id),
        appointment_Already_Made = await appointment.find({ Time: Time, Month: Month, DayName: DayName, DayDate: DayDate });
        
        if(oldAppointment.Capacity.length === 1){
            // If Appointment has 1 person booked in, updating it should
            // Remove the appointment entirely
            oldAppointment.remove()
        } else {
            // If Appointment has 2 people booked in, updating it should
            // Remove that user ref from appointment entirely
            let appointment_Kept = oldAppointment.Capacity.filter(appt => appt.toString() !== userId)
            await appointment.updateOne({ _id: appointment_id }, {
                $set: {
                    Capacity: appointment_Kept
                }
            })
        }
        // Remove that appointment ref from user entirely
        let appointment_Kept = user_Found.Appointments.filter(appt => appt.toString() !== appointment_id)
        await user.updateOne({ _id: userId }, {
            $set: {
                Appointments: appointment_Kept
            }
        })
        
        if(appointment_Already_Made.length === 1){
            await appointment.updateOne({ _id: appointment_Already_Made[0]._id }, { $push: { Capacity: user_Found._id } });
            await user.updateOne({ _id: user_Found._id }, {
                $set: {
                    Appointments: appointment_Already_Made[0]._id
                }
            })
        } else {
            let createdAppointment = await appointment.create({
                Month: Month,
                DayName: DayName,
                DayDate: DayDate,
                Time: Time,
                Capacity: user_Found._id
            })
            await createdAppointment.save();
            await user.updateOne({_id: user_Found._id}, {
                $set: {
                    Appointments: createdAppointment
                }
            })
        }
        await user.findById(userId).populate("Appointments").exec((err, appointment_details) => {
                if (err) console.log(err)
                return res.send(appointment_details)
        }); 
    } catch (error) {
        next(error)
    }
})

router.delete("/:id", async(req, res, next) => {
    try {
        const { id: appointment_id } = req.params,
            { userId } = req.query,
            appointment_Found = await appointment.findById(appointment_id);
                // userId = appointment_Found.Capacity.filter(appt => appt.toString() === userID);
        let appointment_Kept = appointment_Found.Capacity.filter(appt => appt.toString() !== userId)
        if(appointment_Kept.length > 0){
            await appointment.updateOne({ _id: appointment_id }, {
                $set: {
                    Capacity: appointment_Kept
                }
            })
        } else {
            await appointment.findByIdAndRemove(appointment_id)
        }
        await user.updateOne({ _id: userId }, {
            $set: {
                Appointments: appointment_Kept
            }
        })
        const userFound = await user.findById(userId).populate("Appointments").exec();
        if (!userFound) return next()
        return res.send(userFound)
        
    } catch (error) {
        next(error)
    }
})

export default router