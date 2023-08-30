import express from "express"
import http from 'http'
import morgan from "morgan"
import bodyParser from "body-parser";
import dotenv from 'dotenv';
import helmet from 'helmet'
import cors from 'cors';
import session from "express-session";
import MongoStore from "connect-mongo";
import { connectDB } from "./config/db.js"
import logger from "./helpers/logging.js";
import customerRoute from './routes/customerRoute.js'
import riderRoute from './routes/riderRoute.js'
import vendorRoute from './routes/vendorRoute.js'
import menuRoute from './routes/menuRoute.js'
import orderRoute from './routes/orderRoute.js'
import cartRoute from './routes/cartRoute.js'
import paymentCallback from './routes/paymentRoute.js'
import WebSocket, {WebSocketServer} from 'ws';

const app = express();
const PORT = process.env.PORT || 5000
dotenv.config()
// Middleware setup
app.use(morgan('dev'));
connectDB()
app.use(express.json())
app.use(cors())
app.use(express.urlencoded({extended:false}))
app.use(bodyParser.json())
app.use(helmet())

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_CONNECTION_URL, collectionName: "food-delivery-sessions"}),
    cookie: {
        secure: false, // Set to true if using HTTPS
        httpOnly: true, // Ensures cookie is not accessible via client-side JavaScript
        maxAge: 1000 * 60 * 60 * 24, // cookie will expire after 1 day (in milliseconds)
    },
  }));

  // Create an HTTP server using the Express app
const server = http.createServer(app);

// Create a WebSocket server using the HTTP server
const wss = new WebSocketServer({ server });

// Handle WebSocket connections
wss.on('connection', (ws, req) => {
  console.log('New WebSocket connection');

  // Extract the vendorId from the query parameters or headers
  const url = new URL(req.url, 'http://localhost');
  const vendorId = url.searchParams.get('vendorId'); // Assuming vendorId is sent as a query parameter

  // Store the vendorId in the WebSocket client object
  ws.vendorId = vendorId;

  ws.on('message', (message) => {
    console.log(`Received message: ${message}`);
    // Handle incoming messages from clients, if needed
  });

  // Send a welcome message to the connected client
  ws.send('Welcome to the WebSocket server!');
});

// Store the WebSocket server instance in the Express app
app.set('wss', wss);

  app.use("/api/v1/customer-auth", customerRoute)
  app.use("/api/v1/rider-auth", riderRoute)
  app.use("/api/v1/vendor-auth", vendorRoute)
  app.use("/api/v1/menu", menuRoute)
  app.use("/api/v1/order", orderRoute)
  app.use("/api/v1/cart", cartRoute)
  app.use("/api/v1/payment", paymentCallback)

// Start the server
// app.listen(PORT, () => {
//   // console.log(`Server running on port ${PORT}`);
//   logger.info(`Server running on port ${PORT}`)
// });
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
});