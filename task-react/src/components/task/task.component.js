/*
*   This component dislays the individual tasks.
*/

import React from 'react'
import Button from 'react-bootstrap/Button'

function Check(props) {
    if(props.completed == true) {
        return <input type='checkbox' id={props.id} onChange={props.handleTaskCompleted} onTouchEnd={props.handleTaskCompleted} defaultChecked></input>
    }
    return <input type='checkbox' id={props.id} onChange={props.handleTaskCompleted} onTouchEnd={props.handleTaskCompleted}></input>
}

// Individual tasks
// To find out whether or not task was completed, create 'Check' elem
// and pass param (completed) to the Check() and it returns appropriate
// elem with its ID as it is also passed in
export const Task = ({task, handleTaskCompleted, handleTaskDelete}) => (
    <tr>
        <td><input name="description" type="text" id={task._id} defaultValue={task.description} onChange={handleTaskCompleted}></input></td>
        <td><Check completed={task.completed} id={task._id} handleTaskCompleted={handleTaskCompleted}/></td>
        <td><Button variant="outline-danger" id={task._id} onClick={handleTaskDelete}>Delete</Button></td>

        {/* <td>{props.task.completed.toString()}</td> */}
    </tr>
)