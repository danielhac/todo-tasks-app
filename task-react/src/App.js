/*  
*   A to-do task list client-side application built with React.
*     - Uses a token issued after account creation or login to interact with 
*       the server-side REST API.
*/


import React, { Component } from 'react';
import { CreateUser } from './components/create-user/create-user.component';
import { Login } from './components/login/login.component'
import { Logout } from './components/logout/logout.component'
import { TaskList } from './components/task-list/task-list.component'
import Jumbotron from 'react-bootstrap/Jumbotron';
import './App.css';
import secret from './secret'

// const url = 'http://localhost:3001'
const url = 'http://taskappmgr-env.eba-tdqrarch.us-west-2.elasticbeanstalk.com'


class App extends Component {
  constructor() {
    super()

    this.state = {
      tasks: [],
      username: '',
      password: '',
      email: '',
      token: '',
      newtask: '',
      newtaskcompleted: false,
      loginerror: '',
      createerror: ''
    }
  }

  /* NOTES for local development
  *
  * Ports
  * 3000 - Client react
  * 3002 - Server side
  */

  componentDidMount() {
    console.log(this.state.tasks)
  }

  componentDidUpdate() {
    console.log(this.state.tasks)
  }

  // shouldComponentUpdate(nextProps, nextState) {
    // if(this.state.tasks !== nextState.tasks) {
    //   return true
    // }
  // }


  /*
  *   Functions used in components that set state variables
  */
  emailChange = (e) => {
    this.setState({ email: e.target.value})
  }

  userChange = (e) => {
    this.setState({ username: e.target.value})
  }

  passChange = (e) => {
    this.setState({ password: e.target.value})
  }

  /*
  *   Creates a new user
  *     - Takes user info from state to create the user by calling the API
  *     - Creates a new task upon account creation and displays it
  */
  handleCreateUserSubmit = (e) => {
    e.preventDefault()

    const credentials =  JSON.stringify({
      "email": this.state.email,
      "password": this.state.password,
      "name": this.state.username
    })

    fetch(url + '/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 'credentials': credentials
      },
      body: credentials
    })
    .then(response => response.json())
    .then((jwt) => {
      if(!jwt.token) {
        this.setState({ createerror: 'E-mail must be in correct format. Password must be at least 7 characters.'})
        throw new Error('E-mail must be in correct format. Password must be at least 7 characters.')
      }
      this.setState({ token: jwt.token, createerror: '', newtask: "Create your first task by modifying this text or Add new task below!"})
    })
    .then(() => this.handleTaskAdd())
    .then(() => this.getTasks())
    .catch(err => console.error(err))
  }

  /*
  *   Login into account
  *     - Takes user's credentials from state and calls the API
  *     - Displays user's tasks upon successful login
  */
  handleSubmit = (e) => {
    // For prod use
    const credentials =  JSON.stringify({
      "email": this.state.email,
      "password": this.state.password
    })

    // For quick local use
    // const credentials = secret

    fetch(url + '/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 'credentials': credentials
      },
      body: credentials
    })
    .then(response => response.json())
    .then((jwt) => {
      if(!jwt.token) {
        this.setState({ loginerror: 'The E-mail and Password combination cannot be found! Please try again or Create an Account.'})
        throw new Error('The E-mail and Password combination cannot be found! Please try again or Create an Account.')
      }
      this.setState({ token: jwt.token, loginerror: ''})
    })
    .then(() => this.getTasks())
    .catch(err => {
      console.error(err)
    })
    e.preventDefault()
  }

  /*
  *     Gets users tasks by updating state
  */
  getTasks() {
    fetch(url + '/tasks', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': this.state.token
      }
    })
    .then(response => response.json())
    .then(result => this.setState({tasks: result}))
    .catch(err => console.error(err))
    
  }

  /*
  *   Logout the user by calling the API
  *     - resets state
  */
  handleLogout = (e) => {
    console.log(this.state.token)

    fetch(url + '/users/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': this.state.token
      }
    })
    .then(response => response)
    .then(() => this.setState({ 
      token: '', 
      tasks: [],
      username: '',
      password: '',
      email: '',
      newtask: ''
    }))
    .catch(err => console.error(err))
    e.preventDefault()
  }

  /*
  *   Functions used in components that set state variables
  *     - For adding new tasks
  */
  changeTaskAdd = (e) => {
    this.setState({ newtask: e.target.value})
  }

  changeCompletedAdd = (e) => {
    this.setState({ newtaskcompleted: e.target.checked})
  }
  
  /*
  *   Add a new task
  *     - takes state variables and calls the API
  *     - update state tasks afterwards
  */
  handleTaskAdd = (e) => {
    if(e) e.preventDefault()

    const body = JSON.stringify({
      'description': this.state.newtask,
      'completed': this.state.newtaskcompleted
    })
    
    fetch(url + '/tasks/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': this.state.token
      },
      body: body
    })
    .then(response => response.json())
    .then(result => this.setState({tasks: this.state.tasks.concat({
      "_id": result._id,
      "description": result.description,
      "completed": result.completed
    })}))
    .then(() => this.setState({newtaskcompleted: false}))
    .catch(err => console.error(err))
    
    
  }

  /*
  *   Modify tasks and status of completion
  *     - onchange function within component
  *     @e contains either task description or boolean completion
  *     - calls API with updating task info
  *   NOTE: improve by implementing a submit for modifications and call the API just once instead
  */
  handleTaskCompleted = (e) => {
    let body = ''
    
    // Check if the value coming in from 'e' is the checkbox or description
    const taskVal = e.target.name == 'description' ? e.target.value : e.target.checked
    
    if(typeof taskVal === 'string') {
      body = JSON.stringify({
        'description': taskVal
      })
    } else {
      body = JSON.stringify({
        'completed': taskVal
      })
    }

    fetch(url + '/tasks/' + e.target.id, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': this.state.token
      },
      body: body
    })
    .then(response => console.log(response))
    .catch(err => console.error(err))
  }

  /*
  *   Delete a user's task
  *     @e contains the 'id' to use to call the API to delete the task
  *     - update state for tasks
  */
  handleTaskDelete = (e) => {
    // console.log('handleTaskDelete', e.target.id);
    const delTaskId = e.target.id

    fetch(url + '/tasks/' + e.target.id, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': this.state.token
      }
    })
    .then(() => {
      let arr = this.state.tasks
      for(let i=0; i<arr.length; i++) {
        if(arr[i]._id == delTaskId) {
          arr.splice(i, 1)
          this.setState({tasks: arr})
          break
        }
      }
    })
    .catch(err => console.error(err))
  }

  /*
  *   Renders the components
  *     If not logged in, display components
  *       - Login
  *       - Create User
  *     If logged in, display components
  *       - Logout
  *       - Tasks
  */
  render() {

    return (
      <div className='App'>
        {!this.state.token && <Login emailChange={this.emailChange} passChange={this.passChange} handleSubmit={this.handleSubmit} checkLoginError={this.state.loginerror}></Login>}

        <Jumbotron>
          <h1>Task App</h1>
          <p>Create, read, update, delete your tasks!</p>
          {!this.state.token && <CreateUser handleCreateUserSubmit={this.handleCreateUserSubmit} userChange={this.userChange} emailChange={this.emailChange} passChange={this.passChange} checkCreateError={this.state.createerror}></CreateUser>}
          {this.state.token && <Logout handleLogout={this.handleLogout}></Logout>}
        </Jumbotron>
        {this.state.token && <TaskList tasks={this.state.tasks} handleTaskCompleted={this.handleTaskCompleted} handleTaskDelete={this.handleTaskDelete} changeTaskAdd={this.changeTaskAdd} changeCompletedAdd={this.changeCompletedAdd} handleTaskAdd={this.handleTaskAdd}></TaskList>}
    </div>
    )
  }

}

export default App;
