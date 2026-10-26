
import express from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import householdRoutes from "./routes/householdRoutes.js";
import infrastructureRoutes from "./routes/infrastructureRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "KiloWattz API is running",
  });
});

app.use("/api/users", userRoutes); // endpoint: http://localhost:5000/api/users
app.use("/api/households", householdRoutes); //endpoint: http://localhost:5000/api/households
app.use("/api/infrastructure", infrastructureRoutes); //endpoint: http://localhost:5000/api/infrastructure

export default app;
