import app from "./src/app.js"
import { connectDB } from "./src/db/db.js";
import config from "./src/utils/config.js"

try {
    connectDB()
    app.listen(config.PORT, () => {
        console.log(`SERVER IS RUNNING ON PORT ${config.PORT}`)
    })
} catch (error) {
    console.log("ERROR", error)
}