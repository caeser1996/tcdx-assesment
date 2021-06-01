const express = require("express")
const Task = require("../models/task")
const auth = require("../middleware/auth")
const router = new express.Router()

/*  POST - CREATE TASK  */
router.post('/tasks', auth, async (req, res) => {
    const task = new Task({
        /*  ES6 spread operator is like what Todd McCleod calls "Unfurling" in Golang.
         **  It grabs all of the properties from "req.body" in this case and copies them
         **  to this object.  Here we're copying the 'description' and 'completed' properties.
         */
        ...req.body,
        owner: req.user._id
    })

    try {
        await task.save()
        let task_resp = {
            "name": task.name,
            "completed": task.completed
        }
        res.status(201).send(task_resp)
    } catch (e) {
        res.status(400).send(error)
    }
})

/*  DELETE - DELETE TASK    */
router.delete("/tasks/:id", auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({
            _id: req.params.id,
            owner: req.user._id
        })
        if (!task) {
            res.status(404).send()
            return
        }
        res.status(200).send(task)
    } catch (e) {
        res.status(500).send()
    }
})

/*  PATCH - UPDATE TASK */
router.put("/tasks/:id", auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'completed']
    const isValidOperation = updates.every((updateKeyName) => {
        return allowedUpdates.includes(updateKeyName)
    })
    if (!isValidOperation) {
        return res.status(400).send({
            error: "Invalid updates!"
        })
    }

    try {
        const task = await Task.findOne({
            _id: req.params.id,
            owner: req.user._id
        })
        if (!task) {
            res.status(404).send()
            return
        }

        updates.forEach((update) => {
            task[update] = req.body[update]
        })
        await task.save()
        let task_resp = {
            "name": task.name,
            "completed": task.completed
        }
        res.status(200).send(task_resp)
    } catch (e) {
        res.status(400).send(e)
    }
})

/*  GET - RETREIVE TASKS. URL OPTIONS:
 **          /tasks?completed=true
 **          /tasks?limit=10&skip=0
 **          /tasks?sortBy=createdAt_asc
 **          /tasks?sortBy=updatedAt_desc
 */
router.get("/tasks", auth, async (req, res) => {
    const match = {}
    const sort = {}

    /*  NB: req.query.completed is a STRING.  Hence if the string
     **  is non-empty then the if statement will resolve to true
     */
    if (req.query.completed) {
        if (req.query.completed === "true") {
            match.completed = true
        } else if (req.query.completed === "false") {
            match.completed = false
        }
    }

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split('_')
        sort[parts[0]] = (parts[1] === "asc") ? 1 : -1
    }

    try {
        /* You could also replace the lines below with: If we need pagination
         **          await req.user.populate({
         **             path: 'myTasks',
         **             match: match,
         **             options: {
         **               //  if req.query.limit is not provided then the following resolves 
         **               //  to NaN (not a number) and mongoose proceeds to ignore the limit.
         **             limit: parseInt(req.query.limit),
         **             skip: parseInt(req.query.skip),
         **             sort: sort
         **   },
         **   }).execPopulate()
         */


        const tasks = await Task.find({
            owner: req.user._id,
        }, {
            //Only return id, name , completed flag
            _id: 1,
            name: 1,
            completed: 1
        })
        res.status(200).send(tasks)
    } catch (e) {
        res.status(500).send(e)
    }
})

/*  GET - RETREIVE SPECIFIC TASK BY ID  */
router.get("/tasks/:id", auth, async (req, res) => {
    try {
        const task = await Task.findOne({
            _id: req.params.id,
            owner: req.user._id
        })
        if (!task) {
            res.status(404).send()
            return
        }
        res.status(200).send(task)
    } catch (e) {
        res.status(500).send(error)
    }
})

/*  GET - Fetch Dashboard data with Stats */
/**
 * {
 * "tasksCompleted": 10,
 * "totalTasks": 19,
 * "latestTasks": [
 *   {
 *     "name": "Refactor something",
 *     "completed": false
 *   }
 * ]
 * }
 * 
 */
router.get("/dashboard", auth, async (req, res) => {
    try {
        console.log(req.user._id)
        const tasksCompleted = await Task.find({
            owner: req.user._id,
            completed: true,
        })
        const totalTasks = await Task.find({
            owner: req.user._id,
        })
        const latestTasks = await Task.find({
            owner: req.user._id,

        }, {
            //Only return id, name , completed flag
            _id: 0,
            name: 1,
            completed: 1
        }).sort('-createdAt')
        let dashboard_resp = {
            "tasksCompleted": tasksCompleted.length,
            "totalTasks": totalTasks.length,
            "latestTasks": latestTasks.splice(0,3)
        }
        res.status(200).send(dashboard_resp)
    } catch (e) {
        res.status(404).send()
    }
})

module.exports = router