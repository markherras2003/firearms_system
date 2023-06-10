import express from "express";
import {
    getAllRoles,
    updateRole,
    saveRole,
    deleteRole,
    getAllRolesState,
    getRolesName

} from "../controllers/role.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/", verifyToken, getAllRoles);
router.get("/rolename", verifyToken, getRolesName);
router.get("/state", verifyToken, getAllRolesState);
router.put('/:_id', verifyToken, updateRole);
router.post("/", verifyToken, saveRole);
router.delete('/:_id', verifyToken, deleteRole);
export default router;
