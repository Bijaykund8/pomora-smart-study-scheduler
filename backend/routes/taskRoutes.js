import express from "express";
import {
  createTask,
  getMyTasks,
  deleteTask,
  getTodayTasks,
  toggleTaskComplete 
} from "../controllers/taskController.js";
import  authMiddleware from "../middleware/authMiddleware.js";


const router = express.Router();

/* =========================
   CREATE TASK
========================= */
router.post("/", authMiddleware, createTask);

/* =========================
   GET MY TASKS
========================= */
router.get("/my", authMiddleware, getMyTasks);


/* =========================
   DELETE TASK
========================= */
router.delete("/:id", authMiddleware, deleteTask);

/* =========================
   GET TODAY'S TASKS (FOCUS TIMER)
========================= */
router.get("/today", authMiddleware, getTodayTasks);
router.patch("/:id", authMiddleware, toggleTaskComplete);

export default router;
