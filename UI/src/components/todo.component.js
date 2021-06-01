import React, {useEffect, useState} from "react";
import "../App.css";
import {Button, Card, Form} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import UserService from "../services/user.service";
import AuthService from "../services/auth.service";

function Task({task, index, markTask, removeTask}) {
    return (
        <div
            className="task"

        >
            <div className="row">
                <div className="col-md-8  col-sm-6"><span
                    style={{textDecoration: task.completed ? "line-through" : ""}}>{task.name}</span></div>
                <div className="col-md-4 col-sm-6">
                    <Button variant="outline-success" onClick={() => markTask(task._id)}>✓</Button>{' '}
                    <Button variant="outline-danger" onClick={() => removeTask(task._id)}>✕</Button>
                </div>
            </div>

        </div>
    );
}

function FormTask({addTask}) {
    const [value, setValue] = React.useState("");

    const handleSubmit = e => {
        e.preventDefault();
        if (!value) return;
        addTask(value);
        setValue("");
    };

    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group>
                <Form.Label><b>Add Task</b></Form.Label>
                <Form.Control type="text" className="input" value={value} onChange={e => setValue(e.target.value)}
                              placeholder="Add new task"/>
            </Form.Group>
            <Button variant="primary mb-3" type="submit">
                Submit
            </Button>
        </Form>
    );
}

function SearchTask({search_task}) {
    const [value, setValue] = React.useState("");

    const handleSubmit = e => {
        e.preventDefault();
        if (!value) return;
        setValue("");
    };

    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group>
                <Form.Label><b>Search</b></Form.Label>
                <Form.Control type="text" className="input" onChange={search_task}
                              placeholder="Search"/>
            </Form.Group>
        </Form>
    );
}

function TaskList(props) {

    const [tasks, setTasks] = useState([]);
    const [filterTasks, setfilterTasks] = useState([]);

    useEffect(() => {
        UserService.fetchAllTasks().then(
            response => {
                let tasks = response.data
                setTasks(tasks)
                setfilterTasks(tasks)
            }, error => {
                AuthService.logout();

            })
    }, [])


    let addTask = name => {

        UserService.addTask({name: name}).then(
            response => {
                let tasks_resp = response.data
                let task_data = {
                    "_id": tasks_resp._id,
                    "name": tasks_resp.name
                }
                const newTasks = [...tasks, task_data];
                setTasks(newTasks)
                setfilterTasks(newTasks)
                props.handler()
            }, error => {
                AuthService.logout();

            })
    };
    let search_task = event => {
        // Variable to hold the original version of the list
        let currentList = [];
        // Variable to hold the filtered list before putting into state
        let newList = [];

        // If the search bar isn't empty
        if (event.target.value !== "") {
            // Assign the original list to currentList
            currentList = tasks;

            // Use .filter() to determine which items should be displayed
            // based on the search terms
            newList = currentList.filter(item => {
                // change current item to lowercase
                const lc = item.name.toLowerCase();
                // change search term to lowercase
                const filter = event.target.value.toLowerCase();
                // check to see if the current list item includes the search term
                // If it does, it will be added to newList. Using lowercase eliminates
                // issues with capitalization in search terms and search content
                return lc.includes(filter);
            });
        } else {
            // If the search bar is empty, set newList to original task list
            newList = tasks;
        }
        // Set the filtered state based on what our rules added to newList
        setfilterTasks(newList)

    }

    const markTask = id => {
        let index = tasks.findIndex(function (object) {
            return object._id === id;
        });
        const newTasks = [...tasks];
        newTasks[index].completed = true;
        // setTasks(newTasks);

        console.log(index)
        UserService.editTask(newTasks[index]).then(
            response => {
                setTasks(newTasks);
                setfilterTasks(newTasks);
                props.handler()
            }, error => {

            })
    };

    const removeTask = id => {
        let index = tasks.findIndex(function (object) {
            return object._id === id;
        });
        const newTasks = [...tasks];
        UserService.delete(newTasks[index]).then(
            response => {
                newTasks.splice(index, 1);
                setTasks(newTasks);
                setfilterTasks(newTasks);
                props.handler()
            }, error => {

            })
    };

    return (
        <div className="app">
            <div className="container">
                <h1 className="text-center mb-4">Task List</h1>
                <div className="row">
                    <div className="col-md-6">
                        <FormTask addTask={addTask}/>
                    </div>
                    <div className="col-md-6">
                        <SearchTask search_task={search_task}/>
                    </div>
                </div>
                <div>
                    {filterTasks.map((task, index) => (
                        <Card>
                            <Card.Body>
                                <Task
                                    key={task._id}
                                    index={index}
                                    task={task}
                                    markTask={markTask}
                                    removeTask={removeTask}
                                />

                            </Card.Body>
                        </Card>
                    ))}

                </div>
            </div>
        </div>
    );
}

export default TaskList;
