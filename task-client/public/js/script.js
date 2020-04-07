/* This is a demo script to interact with the REST API
*   After starting mongodb, server, and client:
*       - http://localhost:3001/login
*   1. Hits client server using provided credentials
*       - sends cookie/token in headers as part of index.html
*       - loads index.html
*   2. On index.html, get cookie from header to use for subsequent calls
*       as used below as 'cookieArr'
*
*
*/

console.log('inside script.js');

// Lines below weren't commented out when this was working
var req = new XMLHttpRequest();
req.open('GET', document.location, false);
req.send(null);

// var headers = req.getAllResponseHeaders().toLowerCase();
// console.log(headers);
const cookieArr = req.getResponseHeader('token').split(';')[0].split('=')
console.log(cookieArr);

const getAllUserTasksAsync = async () => {
    const getAllUserTasks = await fetch('http://localhost:3002/tasks', {
        method: 'GET',
        // mode: 'cors',
        // credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': cookieArr[1]
        }
        // body: JSON.stringify(data)
    })
    // console.log(getAllUserTasks);
    return getAllUserTasks.json()
}

const getOneUserTasksAsync = async () => {
    const getOneUserTasks = await fetch('http://localhost:3002/tasks/5e67ffa3b13faa939413287d', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': cookieArr[1]
        }
    })
    return getOneUserTasks.json()
}

const modifyOneUserTasksAsync = async () => {
    const body = {
        'completed': true
    }
    const modifyOneUserTasks = await fetch('http://localhost:3002/tasks/5e67ffa3b13faa939413287d', {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': cookieArr[1]
        },
        body: JSON.stringify(body)
    })
    return modifyOneUserTasks.json()
}

getAllUserTasksAsync()
    .then((data) =>  console.log(data))
    .then(getOneUserTasksAsync)
    .then((data2) => console.log(data2))
    .then(modifyOneUserTasksAsync)
    .then((data2) =>  console.log(data2))
    .catch((error => console.log(error)))
    

