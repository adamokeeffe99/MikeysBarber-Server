// Variable Declarations and Imports
import { express, cors } from './Helpers_and_Imports/libs_required.js'
import appointment from './api/appointments.js'
import barber from './api/barbers.js'
const app = express(),
port = process.env.PORT || 7000


app.use(cors())

// Middlewares
app.use(express.json());

// Routes
app.get("/", (req,res) => {
    res.send({
        message: "Well you're up and running, congrats"
    });
})

app.use("/api/v1/appointments", appointment)
app.use("/api/v1/barbers", barber)

// App Listener 
app.listen(port , () => {
    console.log(`Your application is running on port ${port}, fair play chief`)
})