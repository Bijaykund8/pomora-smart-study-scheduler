import Task from "../models/Task.js";
import Activity from "../models/Activity.js";

/* =========================
   CREATE TASK
========================= */
export const createTask = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized: Please login again",
      });
    }

    const { title, subject, scheduledTime, duration } = req.body;

    if (!title || !subject || !scheduledTime || !duration) {
      return res.status(400).json({
        message: "All required fields must be provided",
      });
    }

    const newTask = await Task.create({
      user: req.user._id,
      title: title.trim(),
      subject: subject.trim(),
      scheduledTime: new Date(scheduledTime),
      duration: Number(duration),
    });

    res.status(201).json({
      message: "Task created successfully",
      task: newTask,
    });

  } catch (error) {
    console.error("CREATE TASK ERROR:", error);
    res.status(500).json({
      message: "Failed to create task",
    });
  }
};


/* =========================
   DELETE TASK
========================= */
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task)
      return res.status(404).json({ message: "Task not found" });

    // Log delete activity BEFORE deleting
    await Activity.create({
      user: task.user,
      taskTitle: task.title,
      duration: task.duration,
      type: "deleted",
    });

    await task.deleteOne();

    res.status(200).json({ message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed" });
  }
};

/* =========================
   GET TODAY'S TASKS
========================= */
export const getTodayTasks = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const tasks = await Task.find({
      user: req.user._id,
      scheduledTime: { $gte: start, $lte: end },
    }).sort({ scheduledTime: 1 });

    res.status(200).json(tasks);

  } catch (error) {
    console.error("GET TODAY TASKS ERROR:", error);
    res.status(500).json({
      message: "Failed to fetch today's tasks",
    });
  }
};

/* =========================
   GET MY TASKS
========================= */
export const getMyTasks = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const tasks = await Task.find({
      user: req.user._id,
    }).sort({ scheduledTime: -1 });

    res.status(200).json(tasks);

  } catch (error) {
    console.error("GET MY TASKS ERROR:", error);
    res.status(500).json({
      message: "Failed to fetch tasks",
    });
  }
};
/* =========================
   TOGGLE COMPLETE
========================= */
export const toggleTaskComplete = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ message: "Task not found" });

    task.completed = !task.completed;
    await task.save();

    // Log activity
    await Activity.create({
      user: task.user,
      taskTitle: task.title,
      duration: task.duration,
      type: task.completed ? "completed" : "incomplete",
    });

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: "Toggle failed" });
  }
};