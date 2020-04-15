  /*
  *   This component displays the task's description and completed input fields to add a task.
  */

import React from 'react'
import Button from 'react-bootstrap/Button'

export const AddTask = ({changeTaskAdd, handleTaskAdd, changeCompletedAdd}) => {
    const handleClearField = () => { 
        document.getElementsByClassName('add-description')[0].value = ''
        document.getElementsByClassName('add-completed')[0].checked = false
    }
    const handleAddAndClear = () => {
        handleTaskAdd()
        handleClearField()
    }

    return (
        <tr>
            <td><input name="description" type="text" className="add-description" onChange={changeTaskAdd}></input></td>
            <td><input name="completed" type="checkbox" className="add-completed" onChange={changeCompletedAdd} /></td>
            <td><Button type="submit" variant="outline-success" onClick={handleAddAndClear}>Add Task</Button></td>
        </tr>

    )
    
}


