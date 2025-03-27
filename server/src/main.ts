/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */
import express from 'express';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({
  path: path.resolve(__dirname, '../../../.env'),
});

const app = express();

app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.get('/api', (req, res) => {
  res.send({ message: 'WELCOME FROM SERVER!' });
});

const port = process.env.PORT || 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);
