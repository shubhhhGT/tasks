const User = require("../models/user");
const Todo = require("../models/todo");
const { createTodo, updateTodo } = require("../utils/types");

// Create todos
exports.createTodo = async (req, res) => {
  try {
    // get the title and desc
    const { title, description } = req.body;

    // Validate the inputs
    const validatedInputs = createTodo.safeParse({ title, description });

    if (!validatedInputs.success) {
      const errorMessages = validatedInputs.error.errors.map(
        (err) => err.message
      );
      return res.status(400).json({
        success: false,
        msg: errorMessages,
      });
    }

    // Save it in DB
    const todo = await Todo.create({ title: title, description: description });

    // update the user with the Id of the todo created
    await User.findByIdAndUpdate(
      { _id: req.user.id },
      {
        $push: {
          todos: todo._id,
        },
      },
      { new: true }
    );

    // return res
    res.status(200).json({
      success: true,
      msg: "Todo created successfully!",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      msg: error.message,
    });
  }
};

// Get all todos
exports.getAllTodos = async (req, res) => {
  try {
    // get all todos created by user
    const user = await User.findById({ _id: req.user.id }).populate("todos");

    if (!user) {
      return res.status(404).json({ success: false, msg: "User not found" });
    }

    // return res
    res.status(200).json({
      success: true,
      data: user.todos,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      msg: error.message,
    });
  }
};

//   Get todo using a id
exports.getTodo = async (req, res) => {
  try {
    // Get the id of the todo
    const { id } = req.params;

    // Check if the todo id belongs to the user and not other user
    const todo = await User.findOne({ _id: req.user.id, todos: id }).populate({
      path: "todos",
      match: { _id: id },
    });

    if (!todo || !todo.todos.length) {
      return res.status(404).json({
        success: false,
        message: "Todo not found or does not belong to the user",
      });
    }

    res.status(200).json({
      success: true,
      data: todo.todos[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      msg: error.message,
    });
  }
};

// Update todo
exports.updateTodo = async (req, res) => {
  try {
    // get the Id of the todo that needs to be updated
    const { id } = req.params;

    // validate the ID
    const validatedInputs = updateTodo.safeParse({ id });
    if (!validatedInputs.success) {
      return res.status(400).json({
        success: false,
        msg: "Invalid ID",
      });
    }

    // update the todo
    await Todo.updateOne({ _id: id }, { completed: true });

    // shyd completed todo ko remove karna pade

    // Send res
    res.status(200).json({
      success: true,
      msg: "Todo marked as complete",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      msg: error.message,
    });
  }
};

exports.deleteTodo = async (req, res) => {
  try {
    // Get the id of the todo to be deleted
    const { id } = req.params;

    const todo = await Todo.findOne({ _id: id });

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: "todo not found",
      });
    }

    // if todo is found then delete it
    await Todo.findByIdAndDelete(id);

    // remove the todo from the user
    await User.findByIdAndUpdate(
      { _id: req.user.id },
      {
        $pull: {
          todos: id,
        },
      }
    );

    res.status(200).json({
      success: true,
      message: "todo deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      msg: error.message,
    });
  }
};
