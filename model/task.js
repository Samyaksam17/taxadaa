const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

// Creating TaskList schema
const taskListSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  active: {
    type: Boolean,
    default: true,
  },
});

taskListSchema.plugin(uniqueValidator);

// Creating TaskList model
const TaskList = mongoose.model("tasklist", taskListSchema);

module.exports.createtasklist = function (newlist, callback) {
  TaskList.create(newlist, callback);
};

// Creating Task schema
const taskSchema = new mongoose.Schema({
  task_name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  due_date: {
    type: Date,
    required: true,
  },
  period: {
    type: String,
    required: true,
  },
  period_type: {
    type: String,
    enum: ["monthly", "quarterly", "yearly"],
    required: true,
  },
  task_list_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "tasklist",
    required: true,
  },
});

taskSchema.plugin(uniqueValidator);

// Creating Task model
const Task = mongoose.model("task", taskSchema);


module.exports.createtask = function (newtask, callback) {
  Task.create(newtask, callback);
};

module.exports.find = function (query, callback) {
  Task.findOne(query,callback);
};
