const express = require('express')
const cors = require('cors') 
const http = require('http')
const querystring = require('querystring');
const path = require('path')


const app = express()
// app.use(cors())
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    next();
});
const port = process.env.PORT || 3001

const hostname = 'taskappmgr-env.eba-tdqrarch.us-west-2.elasticbeanstalk.com'
const portTaskMgr = ''

// const hostname = 'localhost'
// const portTaskMgr = '3002'


/* Client-side of the Task Node.js application.
*   Using the Node.js built in http/https to make requests to the server-side API
*
*
*
*
*
*/

// Serves up index.html in home directory -- static directory
// app.use(express.static(path.join(__dirname, '/public')))

app.use(express.json()) 

// Test to get all tasks w/o headers
app.get('/', async (req, res) => {
    console.log(`STATUS: ${res.statusCode}`);
    console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
    
    let data = ''
    const options = {
        hostname: hostname,
        port: portTaskMgr,
        path: '/tasksAll',
        method: 'GET',
        headers: {}
    }

    const req2 = http.request(options, (response) => {    
        response.on('data', (chunk) => {
            data += chunk.toString()
        })

        response.on('end', () => {
            const allChunks = JSON.parse(data)
            console.log(allChunks);
            res.send(allChunks)
        })
    })

    req2.on('error', (e) => {
        console.error(e)
    })

    req2.end()
})

// USERS - CREATE
app.post('/users', async (req, res) => {
    let creds = req.headers.credentials
    // let test = JSON.parse(creds)
    console.log(creds);


    // console.log(creds.email)
    // console.log(creds.password);
    // console.log(creds.name);

    const options = {
        hostname: hostname,
        port: portTaskMgr,
        path: '/users',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(creds)
          },
        body: JSON.stringify({creds})
    }

    const req2 = http.request(options, (response) => {    
        // console.log(`STATUS: ${response.statusCode}`);
        // console.log(`HEADERS: ${JSON.stringify(response.headers)}`);
        // console.log(response.headers['set-cookie'][0]);
        response.setEncoding('utf8');

        let data = ''
        response.on('data', (chunk) => {
            data += chunk.toString()
        })

        response.on('end', () => {
            const allChunks = JSON.parse(data)
            console.log(allChunks);
            
            res.status(200).send(allChunks)
        })
    })

    req2.on('error', (e) => {
        console.error(e)
    })

    // Write data to request body
    req2.write(creds);
    req2.end()
    
})

// USERS - Login
// CHANGED to POST to test
app.post('/login', async (req, res) => {
    let creds = req.headers.credentials
    creds = JSON.parse(creds)

    console.log(creds.email)
    console.log(creds.password);
    // console.log(req.headers)
    // console.log(req.cookies);
    
    const postData = JSON.stringify({
        "email": creds.email,
	    "password": creds.password
    });

    const options = {
        hostname: hostname,
        port: portTaskMgr,
        path: '/users/login',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
          }
    }

    const req2 = http.request(options, (response) => {    
        // console.log(`STATUS: ${response.statusCode}`);
        // console.log(`HEADERS: ${JSON.stringify(response.headers)}`);
        // console.log(response.headers['set-cookie'][0]);
        response.setEncoding('utf8');

        let data = ''
        response.on('data', (chunk) => {
            data += chunk.toString()
        })

        response.on('end', () => {
            const allChunks = JSON.parse(data)
            // console.log(allChunks);
            // res.send(allChunks)
            // res.sendFile((path.join(__dirname, '/public/html/index.html')))


            // Need to send cookie to client-side after login to make future calls
            // const token = response.headers['set-cookie'][0]
            // console.log(token);
            // const options = {
            //     root: path.join(__dirname, 'public/html/'),
            //     dotfiles: 'deny',
            //     headers: {
            //       'x-timestamp': Date.now(),
            //       'x-sent': true,
            //       token
            //     }
            // }
            res.status(200).send(allChunks)
            // res.send(token, function (err) {
            //     if (err) {
            //       next(err)
            //     } else {
            //       console.log('Sent options')
            //     }
            // })
            

            // old, to test functionality prior to React - serves index.html
            //   res.sendFile('index.html', options, function (err) {
            //     if (err) {
            //       next(err)
            //     } else {
            //       console.log('Serving index.html')
            //     }
            //   })
        })
    })

    req2.on('error', (e) => {
        console.error(e)
    })

    // Write data to request body
    req2.write(postData);
    req2.end()
})


// USERS - Logout
app.post('/logout', async (req, res) => {
    // let token = req.headers.token
    // console.log(token);
    // token = JSON.parse(creds)

    // console.log(creds.email)
    // console.log(creds.password);
    // console.log(req.headers)
    // console.log(req.cookies);

    const options = {
        hostname: hostname,
        port: portTaskMgr,
        path: '/users/logout',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': req.header('Authorization')
        }
    }

    const req2 = http.request(options, (response) => {    
        response.setEncoding('utf8');

        let data = ''
        response.on('data', (chunk) => {
            data += chunk.toString()
        })

        response.on('end', () => {
            res.status(200).send()
        })
    })

    req2.on('error', (e) => {
        console.error(e)
    })

    req2.end()
})


// Tasks - POST
app.post('/tasks', async (req, res) => {
    console.log('post task');
    const body = JSON.stringify({
        'description': req.body.description
    })
    
    const options = {
        hostname: hostname,
        port: portTaskMgr,
        path: '/tasks/',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(body),
            'Authorization': req.header('Authorization')
          },
        body: body
    }

    const req2 = http.request(options, (response) => {    
        // console.log(`STATUS: ${response.statusCode}`);
        // console.log(`HEADERS: ${JSON.stringify(response.headers)}`);
        // console.log(response.headers['set-cookie'][0]);
        response.setEncoding('utf8');

        let data = ''
        response.on('data', (chunk) => {
            data += chunk.toString()
        })

        response.on('end', () => {
            const allChunks = JSON.parse(data)
            res.status(200).send(allChunks)
        })
    })

    req2.on('error', (e) => {
        console.error(e)
    })

    // Write data to request body
    req2.write(body);
    req2.end()
})


// TASKS - GET
app.get('/tasks', async (req, res) => {
    console.log('get tasks, token: ' + req.header('Authorization'));

    const options = {
        // hostname: hostname,
        hostname: 'taskappmgr-env.eba-tdqrarch.us-west-2.elasticbeanstalk.com',
        port: portTaskMgr,
        path: '/tasks',
        method: 'GET',
        headers: {
            'Access-Control-Allow-Origin':'*',
            'Content-Type': 'application/text',
            'Content-Length': Buffer.byteLength(req.header('Authorization')),
            'Authorization': req.header('Authorization')
          }
    }

    console.log('task client, before req2');
    const req2 = http.request(options, (response) => {    
        // console.log(`STATUS: ${response.statusCode}`);
        // console.log(`HEADERS: ${JSON.stringify(response.headers)}`);
        response.setEncoding('utf8');
        console.log('task client, contacting task server');
        let data = ''
        response.on('data', (chunk) => {
            data += chunk.toString()
            console.log(data);
        })

        response.on('end', () => {
            // const allChunks = JSON.parse(data)
            res.send(data)
        })
    })

    req2.on('error', (e) => {
        console.error(e)
        res.send(e)
    })

    req2.end()
})


// TASKS - PATCH
app.patch('/tasks/:id', async (req, res) => {
    // console.log('token: ' + req.header('Authorization'));
    console.log('completed', req.body.completed);
    console.log('description', req.body.description);

    let body = ''
    if(req.body.completed !== undefined) {
        console.log('in completed');
        body = JSON.stringify({
            'completed': req.body.completed
        })
    } else {
        console.log('in description');
        body = JSON.stringify({
            'description': req.body.description
        })
    }

    const options = {
        hostname: hostname,
        port: portTaskMgr,
        path: '/tasks/'+req.params.id,
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(body),
            'Authorization': req.header('Authorization')
          },
        body: body
    }

    const req2 = http.request(options, (response) => {
        response.setEncoding('utf8');

        let data = ''
        response.on('data', (chunk) => {
            data += chunk.toString()
        })
        
        response.on('end', () => {
            // const allChunks = JSON.parse(data)
            console.log('patch done');
            res.status(201).send()
        })
    })

    req2.on('error', (e) => {
        console.error(e)
    })

    // Write data to request body
    req2.write(body);
    req2.end()
})


// TASKS - DELETE
app.delete('/tasks/:id', async (req, res) => {
    console.log('in delete', req.params.id);
    const options = {
        hostname: hostname,
        port: portTaskMgr,
        path: '/tasks/'+req.params.id,
        method: 'DELETE',
        headers: {
            'Authorization': req.header('Authorization')
          }
    }

    const req2 = http.request(options)

    req2.on('error', (e) => {
        console.error(e)
    })

    req2.end()
    res.send()
})


app.listen(port, () => {
    console.log('Server is running on port ' + port)
})


