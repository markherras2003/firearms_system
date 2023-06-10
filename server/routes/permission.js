import express from "express";
import {
    getAllPermissions, 
    getAllPermissionsState, 
    updatePermission, 
    savePermission, 
    deletePermission
} from "../controllers/permission.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/*  Get List of job order per ID with jwt verify token */
router.get("/", getAllPermissions);
router.get("/state", getAllPermissionsState);
router.put('/:_id', updatePermission);
router.post("/", savePermission);
router.delete('/:_id', deletePermission);


export default router;
