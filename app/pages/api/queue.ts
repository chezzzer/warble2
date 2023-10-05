// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { config } from '@/lib/config'
import type { NextApiRequest, NextApiResponse } from 'next'
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const response = await fetch(`http://${config.server_host}/queue`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(req.body),
  });

  const data = await response.json();

  res.status(response.status).json(data)
}
