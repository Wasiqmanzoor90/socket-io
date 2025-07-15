import express from 'express';
import dotenv from 'dotenv';
import ConnectDb from './config/dbConnect.js';
import cors from 'cors';
import authRoute from './routes/authRoute.js';
import messageRoute from './routes/messageRoute.js';


// Suppress dotenv logs
dotenv.config({ quiet: true });

const server = express();
const PORT = process.env.PORT || 3000;

//connet to the database
ConnectDb();


// Middleware
server.use(express.json());
server.use(cors());



//Routes
server.use('/api/auth', authRoute);
server.use('/api/message', messageRoute);

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
