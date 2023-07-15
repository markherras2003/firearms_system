import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import joborderRoutes from "./routes/joborder.js";
import roleRoutes from "./routes/role.js";
import permissionRoutes from "./routes/permission.js";
import personnelRoutes from "./routes/personnel.js";
import firearmsRoutes from "./routes/firearms.js";
import personnelRankRoutes from "./routes/personnel_rank.js";
import personnelSVCRoutes from "./routes/personnel_svc.js"
import firearmsMonitorRoutes from "./routes/firearmsmonitoring.js"
import firearmsMonitorLogRoutes from "./routes/firearmsmonitoringlog.js"
import personnelOfficeRoutes from "./routes/personnel_office.js"
import firearmsListRoutes from "./routes/firearms_list.js"

import { roles, permissions } from "./data/index.js";

dotenv.config();
const app = express();
app.use(express.json());
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

// allow all origins for development
app.use(cors());

/* ROUTES */

// Routes for Auths Login
app.use("/auth", authRoutes);

// Routers for Users
app.use("/users", userRoutes);

// Routers for Job Order
app.use("/joborder", joborderRoutes);

// Routers for Job Order
app.use("/personnel", personnelRoutes);

// Routers for Job Order
app.use("/firearms", firearmsRoutes);

// Routers for Job Order
app.use("/firearmsmonitoring", firearmsMonitorRoutes);

// Routers for Job Order
app.use("/firearmsmonitoringlog", firearmsMonitorLogRoutes);

// Routers for Job Order
app.use("/personnel_rank", personnelRankRoutes);

// Routers for Job Order
app.use("/personnel_svc", personnelSVCRoutes);

// Routers for Job Order
app.use("/personnel_office", personnelOfficeRoutes);

// Routers for Job Order
app.use("/firearms_list", firearmsListRoutes);

//
app.use("/roles", roleRoutes);

app.use("/permissions", permissionRoutes);


// Enable only this to initialize roles and permissions once
//Role.insertMany(roles);
//Permission.insertMany(permissions);

/* Mongoose Connection to MongoDB */
const PORT = process.env.PORT || 6001;
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));

  })
  .catch((error) => console.log(`${error} did not connect`));
