// Variable Declarations and Imports
import { express } from "../Helpers_and_Imports/libs_required.js"
import { user } from '../DB/Models/user.js'
const userRouter = express.Router()

// Router is mounted at /api/v1/users , all routes after this will be prefixed with this


// Setting up userRouter's Routes

// ____Getting_All_Users_____
userRouter.get("/", async (req, res) => {
    const users = await user.find()
    res.send(users)
})

// ____Creating_A_New_User_____
userRouter.post("/", async (req, res) => {
    const { userName, password, Name, } = req.body
    const userData = { 
        userName: userName,
        password: password,
        Name: Name
    }
    let createdUser = await user.create(userData)
    return res.send(createdUser)
})

export { userRouter }

