import ws, { WithWebsocketMethod } from "express-ws"
import express from "express";

import cors from "cors";

export const app = express() as unknown as express.Application & WithWebsocketMethod;
ws(app);
app.use(cors());
app.use(express.json());