const express = require("express");
const router = express.Router();
const { auth } = require("../middlewares/auth");

const {
  createTodo,
  updateTodo,
  getAllTodos,
  getTodo,
  deleteTodo,
} = require("../controllers/todos");

router.post("/todo", auth, createTodo);
router.put("/todo/:id/complete", auth, updateTodo);
router.get("/todos", auth, getAllTodos);
router.get("/todos/:id", auth, getTodo);
router.delete("/todo/:id", auth, deleteTodo);

module.exports = router;
