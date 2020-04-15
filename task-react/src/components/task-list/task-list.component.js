/*
*   This component dislays the main structure for tasks.
*/

import React from 'react'
import { Task } from '../task/task.component'
import { AddTask } from '../add-task/add-task.component';
import Table from 'react-bootstrap/Table'

export const TaskList = ({tasks, handleTaskCompleted, handleTaskDelete, changeTaskAdd, handleTaskAdd, changeCompletedAdd}) => {
    return (
      <div className='task-list'>
          <Table striped bordered hover><thead><tr><th>Description</th><th>Completed</th><th>Action</th></tr></thead>
              <tbody>
                  {tasks.map(task => (
                      <Task key={task._id} task={task} handleTaskCompleted={handleTaskCompleted} handleTaskDelete={handleTaskDelete}></Task>
                  ))}
                  <AddTask changeTaskAdd={changeTaskAdd} changeCompletedAdd={changeCompletedAdd} handleTaskAdd={handleTaskAdd}></AddTask>
              </tbody>
          </Table>
      </div>
    )
}