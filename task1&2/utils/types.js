const zod = require("zod");

const credentials = zod.object({
  username: zod.string().min(3, "Username must be at least 3 characters long"),
  password: zod.string().min(8, "Password must be at least 8 characters long"),
});

const createTodo = zod.object({
  title: zod
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be less than 100 characters"),
  description: zod
    .string()
    .max(500, "Description must be less than 500 characters"),
});

const updateTodo = zod.object({
  id: zod.string(),
});

module.exports = { credentials, createTodo, updateTodo };
