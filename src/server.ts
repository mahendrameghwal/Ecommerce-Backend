import express, { Application } from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import app from "./app";

// Load environment variables
dotenv.config();

const PORT: number = parseInt(process.env.PORT || "5000", 10);


// Connect to database
connectDB();

// Start the server
app.listen(5002, () => {
    console.log(`Server running on 5002`);
});
