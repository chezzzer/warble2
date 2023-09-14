// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { WebSocketServer } from 'ws';

const ws = new WebSocketServer({ noServer: true });

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== "UPGRADE") {
        res.status(405).end();
        return;
    }

    ws.handleUpgrade(req, req.socket, Buffer.alloc(0), (ws) => {
        ws.on("message", (message) => {
            console.log("received: %s", message);
            ws.send(`Hello, you sent -> ${message}`);
        });
    });
}
