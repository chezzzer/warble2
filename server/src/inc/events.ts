import { EventEmitter } from "events";
import { ClientError } from "./ClientError";

export const events = new EventEmitter();

export function sendClientError(error: ClientError) {
    events.emit("clientError", error.error, error.description);
}