// import model
const { default: mongoose } = require("mongoose");
const TaskList = require("../model/task");
const Task = require("../model/task");

// create task list
const add = async (req, res) => {
  const name = req.body.name;
  const description = req.body.description;
  const active = req.body.active;

  //validation
  req.checkBody("name", "Name is required").notEmpty();
  req.checkBody("description", "description is required").notEmpty();
  req.checkBody("active", "It is required").notEmpty();

  const errors = req.validationErrors();

  if (errors) {
    return res.json({ status: false, error: errors });
  } else {
    let taskObj = {
      name: name,
      description: description,
      active: active,
    };

    await TaskList.createtasklist(taskObj, (err, result) => {
      if (err) return res.json({ status: false, error: err });
      else
        return res.json({
          status: true,
          response: result,
          message: "Task List Successfully added",
        });
    });
  }
};

// Create task
const create = (req, res, next) => {
  const task_name = req.body.task_name;
  const description = req.body.description;
  const due_date = req.body.due_date;
  let period = req.body.period;
  const period_type = req.body.period_type;
  const task_list_id = req.body.task_list_id;

  req.checkBody("task_name", "task_name is required").notEmpty();
  req.checkBody("description", "description is required").notEmpty();
  req.checkBody("due_date", "due_date is required").notEmpty();
  req.checkBody("period", "period is required").notEmpty();
  req.checkBody("period_type", "period_type is required").notEmpty();
  req.checkBody("task_list_id", "task_list_id is required").notEmpty();

  const errors = req.validationErrors();

  if (errors) {
    return res.json({ status: false, error: errors });
  } else {
    const [dd, mm, yyyy] = due_date.split("-");
    const newDueDate = new Date(`${yyyy}-${mm}-${dd}`);
    const isoDueDate = newDueDate.toISOString();

    let monthArr = [
      { a: "Jan", b: "01" },
      { a: "Feb", b: "02" },
      { a: "Mar", b: "03" },
      { a: "Apr", b: "04" },
      { a: "May", b: "05" },
      { a: "June", b: "06" },
      { a: "July", b: "07" },
      { a: "Aug", b: "08" },
      { a: "Sep", b: "09" },
      { a: "Oct", b: "10" },
      { a: "Nov", b: "11" },
      { a: "Dec", b: "12" },
    ];
    let [m, y] = period.split(" ");
    monthArr.map((item) => {
      if (m === item.a) {
        period = item.b + " " + y;
      }
    });
    // console.log("period==>", period);

   
    const isoPeriod = convertToISODate(`01 ${period}`);

    // Validate due date
    if (!validateDueDate(isoDueDate, isoPeriod, period_type)) {
      return res.json({ error: "Due date must be after the end of the period" });
    }

    let createObj = {
      task_name: task_name,
      description: description,
      due_date: isoDueDate,
      period: period,
      period_type: period_type,
      task_list_id: task_list_id,
    };

    Task.createtask(createObj, (err, result) => {
    //   console.log("------", createObj);
      if (err) return res.json({ status: false, error: err });
      else {
        return res.json({ status: true, response: result });
      }
    });
  }
};

// list tasks
const list =  (req, res) => {
  const { page = 1, limit = 10, searchText } = req.query;
  const query = {};
  if (searchText) {
    query.$or = [{ name: { $regex: searchText, $options: 'i' } }, { description: { $regex: searchText, $options: 'i' } }];
  }
  const tasks = TaskList.find(query)
  .populate('taskList', 'name')
  .select('name description period period_type due_date taskList');

  const count = Task.countDocuments(query);
  res.json({ tasks, count });
};  

// Function to convert Indian date format (dd-mm-yyyy) to ISO date format (yyyy-mm-dd)
function convertToISODate(dateString) {
  // console.log('before', dateString);
  const [dd, mm, yyyy] = dateString.split(" ");
  // console.log('after', [dd, mm, yyyy]);
  return new Date(`${yyyy}-${mm}-${dd}`).toISOString();
}


// Function to validate due date
function validateDueDate(dueDate, period, periodType) {
  // console.log('period', period);
  const [date, periodMonth, periodYear] = period.split("-");
  const periodStartDate = new Date(period);
  let periodEndDate;

  switch (periodType) {
    case "monthly":
      periodEndDate = new Date(periodStartDate);
      periodEndDate.setMonth(periodEndDate.getMonth() + 1);
      break;
    case "quarterly":
      periodEndDate = new Date(periodStartDate);
      periodEndDate.setMonth(periodEndDate.getMonth() + 3);
      break;
    case "yearly":
      periodEndDate = new Date(periodStartDate);
      periodEndDate.setFullYear(periodEndDate.getFullYear() + 1);
      break;
  }
//   console.log("dueDate", dueDate);
//   console.log("periodEndDate", periodEndDate);

  return new Date(dueDate) >= periodEndDate;
}

module.exports = { add, create, list };
