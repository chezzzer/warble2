import "dotenv/config";

//modules
import "./inc/app.js";
import "./inc/events.js";
import "./inc/spotify.js";
import "./inc/socket.js";

import { app } from "./inc/app.js";

app.listen(8000, () => {
    console.log("Login at http://localhost:8000/login");
});