// Load environment variables before accessing them
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load env variables (only in development)
if (process.env.NODE_ENV !== 'production') {
  dotenv.config({
    path: path.resolve(__dirname, '../../../.env'),
  });
}

// Import your Express app with routes
import app from './app/app';

//Start the server
const port = process.env.PORT || 3333;
const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
server.on('error', console.error);
