import React from 'react'
import Button from 'react-bootstrap/Button'

export const AddTask = ({changeTaskAdd, handleTaskAdd}) => {
    const handleClearField = () => document.getElementsByClassName('add-description')[0].value = ''
    const handleAddAndClear = () => {
        handleTaskAdd()
        handleClearField()
    }

    return (
        <tr>
            <td><input name="description" type="text" className="add-description" onChange={changeTaskAdd}></input></td>
            <td><input name="completed" type="checkbox"/></td>
            <td><Button type="submit" variant="outline-success" onClick={handleAddAndClear}>Add Task</Button></td>
        </tr>

    )
    
}


