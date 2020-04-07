import React, { Component } from 'react';
import { CreateUser } from './components/create-user/create-user.component';
import { Login } from './components/login/login.component'
import { Logout } from './components/logout/logout.component'
import { TaskList } from './components/task-list/task-list.component'
import Jumbotron from 'react-bootstrap/Jumbotron';
import './App.css';



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
      loginerror: null
    }
  }

  /* NOTES
  *
  * Ports
  * 3000 - Client react
  * 3001 - Client server
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

  
  emailChange = (e) => {
    console.log(e.target.value);
    this.setState({ email: e.target.value})
  }

  userChange = (e) => {
    console.log(e.target.value);
    this.setState({ username: e.target.value})
  }

  passChange = (e) => {
    console.log(e.target.value);
    this.setState({ password: e.target.value})
  }

  handleCreateUserSubmit = (e) => {
    e.preventDefault()
    // console.log("email found: " + this.state.email);
    // console.log("password found: " + this.state.password);
    // console.log("username found: " + this.state.username);

    const credentials =  JSON.stringify({
      "email": this.state.email,
      "password": this.state.password,
      "name": this.state.username
    })

    // TODO: handle when credentials are incorrect
    fetch('http://localhost:3001/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'credentials': credentials
      }
    })
    .then(response => response.json())
    .then((jwt) => this.setState({ token: jwt.token, newtask: "Create your first task by modifying this text or Add new task blow!"}))
    .then(() => this.handleTaskAdd())
    .then(() => this.getTasks())
    .catch(err => console.error(err))
  }

  handleSubmit = (e) => {
    // console.log("email found: " + this.state.email);
    // console.log("password found: " + this.state.password);

    const credentials =  JSON.stringify({
      "email": this.state.email,
      "password": this.state.password
    })


    // TODO: handle when credentials are incorrect
    fetch('http://localhost:3001/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'credentials': credentials
      }
    })
    .then(response => response.json())
    .then((jwt) => this.setState({ token: jwt.token}))
    .then(() => this.getTasks())
    .catch(err => console.error(err))
    e.preventDefault()
  }

  getTasks() {
    fetch('http://localhost:3001/tasks', {
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

  handleLogout = (e) => {
    console.log(this.state.token)

    fetch('http://localhost:3001/logout', {
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
      email: ''
    }))
    .catch(err => console.error(err))
    e.preventDefault()
  }

  changeTaskAdd = (e) => {
    console.log(e.target.value);
    this.setState({ newtask: e.target.value})
  }

  handleTaskAdd = (e) => {
    if(e) e.preventDefault()
    // console.log('handleTaskAdd', this.state.newtask);

    const body = JSON.stringify({
      'description': this.state.newtask
    })
    
    fetch('http://localhost:3001/tasks/', {
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
    .catch(err => console.error(err))
    
    
  }

  handleTaskCompleted = (e) => {
    // console.log('in handleAddTask ', e.target);
    // console.log('in handleAddTask ', e.target.checked, e.target.name);
    
    let body = ''
    
    // Check if the value coming in from 'e' is the checkbox or description
    const taskVal = e.target.name == 'description' ? e.target.value : e.target.checked
    console.log(taskVal);
    
    if(typeof taskVal === 'string') {
      body = JSON.stringify({
        'description': taskVal
      })
    } else {
      body = JSON.stringify({
        'completed': taskVal
      })
    }

    fetch('http://localhost:3001/tasks/' + e.target.id, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': this.state.token
      },
      body: body
    })
    .then(response => console.log(response.json()))
    .catch(err => console.error(err))
  }

  handleTaskDelete = (e) => {
    console.log('handleTaskDelete', e.target.id);
    const delTaskId = e.target.id

    fetch('http://localhost:3001/tasks/' + e.target.id, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': this.state.token
      }
    })
    .then(() => {
      let arr = this.state.tasks
      // console.log(arr.length);
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

  render() {

    return (
      <div className='App'>
        {!this.state.token && <Login emailChange={this.emailChange} passChange={this.passChange} handleSubmit={this.handleSubmit}></Login>}
        <Jumbotron>
          <h1>Task App</h1>
          <p>Create, read, update, delete your tasks!</p>
          {!this.state.token && <CreateUser handleCreateUserSubmit={this.handleCreateUserSubmit} userChange={this.userChange} emailChange={this.emailChange} passChange={this.passChange}></CreateUser>}
          {this.state.token && <Logout handleLogout={this.handleLogout}></Logout>}
        </Jumbotron>

        {this.state.token && <TaskList tasks={this.state.tasks} handleTaskCompleted={this.handleTaskCompleted} handleTaskDelete={this.handleTaskDelete} changeTaskAdd={this.changeTaskAdd} handleTaskAdd={this.handleTaskAdd}></TaskList>}
    </div>
    )
  }

}

export default App;
