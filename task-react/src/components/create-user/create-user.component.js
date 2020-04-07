import React, { useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'

export const CreateUser = ({handleCreateUserSubmit, userChange, emailChange, passChange}) => {
    const [show, setShow] = useState(false)
    const handleClose = () => setShow(false)
    const handleShow = () => setShow(true)
    
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
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button type='submit' value='Submit' variant="success" block onClick={handleClose}>Create Account</Button>
                </Modal.Footer>
                

            </Modal>
        </div>
        // <form className='create-user' onSubmit={handleCreateUserSubmit}>
        //     <input
        //         className='user-name'
        //         type='text'
        //         placeholder='Name'
        //         onChange={userChange}
        //     />
        //     <input
        //         className='user-email'
        //         type='text'
        //         placeholder='E-mail'
        //         onChange={emailChange}
        //     />
        //     <input
        //         className='user-password'
        //         type='password'
        //         placeholder='Password'
        //         onChange={passChange}
        //     />
        //     <input type='submit' value='Submit' variant="outline-primary"/>
        // </form>
    )
}