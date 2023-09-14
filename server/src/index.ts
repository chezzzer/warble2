import "dotenv/config";
import { Client } from "spotify-api.js";
import { stringify } from "querystring";

import express from "express";
import ws, { WithWebsocketMethod } from "express-ws"
import { randomBytes } from "crypto";
import { events } from "./inc/events.js";
import { context, startTracking } from "./inc/spotify.js";


const app = express() as unknown as express.Application & WithWebsocketMethod;
ws(app);

app.get("/", async (req, res) => {
    res.redirect(
        "https://accounts.spotify.com/authorize?" +
            stringify({
                response_type: "code",
                client_id: process.env.SPOTIFY_CLIENT_ID,
                scope: "user-read-playback-state user-read-private user-read-email",
                redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
                state: randomBytes(16).toString("hex"),
            })
    );
});

app.get("/callback", async (req, res) => {
    try {
        const code = req.query.code as string | null;

        if (!code) {
            res.status(400).json({ error: "No code provided" });
            return;
        }

        const clientID = process.env.SPOTIFY_CLIENT_ID;
        const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
        const redirectURL = process.env.SPOTIFY_REDIRECT_URI;

        if (!clientID || !clientSecret || !redirectURL) {
            res.status(500).json({
                error: "Please fill in all .env variables.",
            });
            return;
        }

        const client = await Client.create({
            refreshToken: true,
            token: { clientID, clientSecret, code, redirectURL },
        });

        events.emit("client", client);

        res.redirect(process.env.APP_URL!);
    } catch (e: any) {
        res.status(500).json({ error: e.message });
        return;
    }
});

app.ws("/socket", (ws, req) => {
    ws.send(JSON.stringify({ type: "context", context}));

    events.on("context", (context) => {
        ws.send(JSON.stringify({ type: "context", context}));
    })
})

events.once("client", async (client: Client) => {
    startTracking();
})

app.listen(8000, () => {
    console.log("Started on http://localhost:8000");
});
