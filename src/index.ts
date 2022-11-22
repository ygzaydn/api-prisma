import app from "./server";
import * as dotenv from "dotenv";

import config from "./config";

dotenv.config();

app.listen(config.port, () => {
    console.log("Server is running on http://localhost:3001");
});
