import {express} from '../Helpers_and_Imports/libs_required.js'
const router = express.Router()
import barber from '../DB/Models/barber.js'

// Router is mounted at /api/v1/barbers , all routes after this will be prefixed with this

router.get("/", async(req, res) => {
    const barbers = await barber.find()
    res.send(barbers)
})

router.post("/", async(req, res) => {
    const { Month , Dates , Hours, Providers } = req.body,
    barberData = { Month , Dates , Hours , Providers }
    barberCreated = await barber.create(barberData)
    res.send(barberCreated)
})

router.put("/:id" , async(req, res) => {
    const {id} = req.params,
        { Month, Dates, Hours, Providers} = req.body
    newbarber = { Month, Dates, Hours, Providers }
    await barber.findByIdAndUpdate(id , newbarber , (err , updatedbarber) => {
        if(err) console.log(err)
        res.send(updatedbarber)
    })
})

router.get("/:id", async(req,res) => {
    const {id} = req.params,
    singleSlot = await barber.findById(id)
    res.send(singleSlot) 
})

router.delete("/:id" , async(req, res) => {
    const {id} = req.params
    await barber.findByIdAndRemove(id)
    res.send(200)
})

export default router