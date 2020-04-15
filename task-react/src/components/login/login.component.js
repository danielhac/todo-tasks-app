/*
  *   This component dislays the email/password input fields .
  */

import React from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import FormControl from 'react-bootstrap/FormControl'
import Button from 'react-bootstrap/Button'
import Alert from 'react-bootstrap/Alert'

export const Login = ({handleSubmit, emailChange, passChange, checkLoginError}) => {
    return (
        <form className='login' onSubmit={handleSubmit}>
            <Container>
                <Row className="justify-content-md-center">
                    <Col lg="3">
                        <FormControl
                            className='user-name'
                            type='email'
                            placeholder='E-mail'
                            onChange={emailChange}
                        />
                    </Col>
                    <Col lg="3">
                        <FormControl
                            className='user-password'
                            type='password'
                            placeholder='Password'
                            onChange={passChange}
                        />
                    </Col>
                    <Col lg="1">
                        <Button type='submit' value='Login' variant="success">Login</Button>
                    </Col>
                </Row>
                {checkLoginError && <Row className="justify-content-md-center login-error">        
                    <Alert variant='danger'>{checkLoginError}</Alert>
                </Row>}
            </Container>
        </form>
    )
} 