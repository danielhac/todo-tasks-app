/*
*   This component dislays the user's name, e-mail and password input fields.
*/

import React, { useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Alert from 'react-bootstrap/Alert'

export const CreateUser = ({handleCreateUserSubmit, userChange, emailChange, passChange, checkCreateError}) => {
    const [show, setShow] = useState(false)
    const handleClose = () => setShow(false)
    const handleShow = () => setShow(true)
    const handleCreateAndClose = () => {
        
    }

    return (
        <div>
            <Button variant="primary" onClick={handleShow}>Create Account</Button>
            <Modal show={show} onHide={handleClose}>
            
                <Modal.Header closeButton>
                    <Modal.Title>Enter Your Account Info</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form className='create-user' onSubmit={handleCreateUserSubmit}>
                        <Form.Group controlId="formBasicName">
                            <Form.Control
                                className='user-name'
                                type='text'
                                placeholder='Name'
                                onChange={userChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Control
                                className='user-email'
                                type='email'
                                placeholder='E-mail'
                                onChange={emailChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="formBasicPassword">
                            <Form.Control
                                className='user-password'
                                type='password'
                                placeholder='Password (min 7 characters)'
                                onChange={passChange}
                            />
                        </Form.Group>
                        {checkCreateError && <Alert variant='danger'>{checkCreateError}</Alert>}
                <Modal.Footer>
                    <Button type='submit' value='Submit' variant="success" block >Create Account</Button>
                </Modal.Footer>
                    </Form>
                </Modal.Body>
                

            </Modal>
        </div>
    )
}