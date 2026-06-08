import type { IncomingMessage, ServerResponse } from 'http';

const { ExpressAdapter } = require('@nestjs/platform-express');
const { createNestApp } = require('../src/backend/bootstrap');

type ExpressServer = (req: IncomingMessage, res: ServerResponse) => void;

let cachedServer: ExpressServer | undefined;

async function getServer() {
  if (!cachedServer) {
    const adapter = new ExpressAdapter();
    const app = await createNestApp(adapter);

    await app.init();
    cachedServer = adapter.getInstance() as ExpressServer;
  }

  return cachedServer;
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  const server = await getServer();
  return server(req, res);
}
