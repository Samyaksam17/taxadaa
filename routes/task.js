const express=require('express');
const router=express.Router();

// import controller
const task=require('../controller/task');

// Apis
router.post('/createtasklist',task.add);
router.post('/createtask',task.create);
router.post('/tasklist',task.list);


module.exports=router;
