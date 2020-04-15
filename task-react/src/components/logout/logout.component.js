/*
*   This component dislays the logout button.
*/

import React from 'react'
import Button from 'react-bootstrap/Button'

export const Logout = ({handleLogout}) => {
    
    return (
        <div>
            <Button variant="primary" onClick={handleLogout}>Logout</Button>
        </div>
    )
}