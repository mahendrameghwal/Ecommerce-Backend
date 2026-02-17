import express from "express";
import cors, { CorsOptions } from "cors";
import dotenv from "dotenv";
dotenv.config();



const app = express();

// Configure CORS
const allowedOrigins: string[] = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(",")
    : [];

const corsOptions: CorsOptions = {  
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true, // Allow cookies or authentication headers
};

// Apply CORS middleware
app.use(cors(corsOptions));
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.get("/", (req, res) => {
    res.send("Server Is Working Fine");
});

export default app;
