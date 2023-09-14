import { EventEmitter } from "events";
import { setClient } from "./spotify.js";

export const events = new EventEmitter();

events.on("client", (client) => {
    setClient(client)
})