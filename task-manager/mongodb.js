// CRUD 

const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient
const ObjectID = mongodb.ObjectID       // Used to convert string ID to the stored MongoDB binary

const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'

MongoClient.connect(connectionURL, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
    if (error) return console.log('Cannot connect to DB')

    const db = client.db(databaseName)

    // READ
    // db.collection('users').findOne({ _id: new ObjectID('5e64136ab126466037e1e2c5')}, (error, user) => {
    //     if (error) return console.log('Cannot find');

    //     console.log(user);
    // })

    // @toArray: From cursors
    // db.collection('users').find({ age: 12}).toArray((error, users) => {
    //     console.log(users);
    // })

    // db.collection('tasks').find({ completed: false }).toArray((error, tasks) => {
    //     if (error) return console.log('Cannot find');

    //     console.log(tasks);
    // })


    // UPDATE
    // db.collection('users').updateOne({
    //     _id: new ObjectID('5e64118e28ee4260349d0a38')
    // }, {
    //     // $set: {
    //     //     name: 'Daniel2'
    //     // }
    //     $inc: {
    //         age: 1
    //     }
    // }).then((result) => {
    //     console.log(result);
    // }).catch((error) => {
    //     console.log(error);
    // })

    // db.collection('tasks').updateMany({
    //     completed: false
    // }, {
    //     $set: {
    //         completed: true
    //     }
    // }).then((result) => {
    //     console.log(result);
    // }).catch((error) => {
    //     console.log(error);
    // })


    // DELETE
    // db.collection('users').deleteMany({
    //     age: 13
    // }).then((result) => {
    //     console.log(result);
    // }).catch((error) => {
    //     console.log(error);
    // })

    // db.collection('tasks').deleteOne({
    //     _id: ObjectID('5e6414b25375e2603db5dad9')
    // }).then((result) => {
    //     console.log(result);
    // }).catch((error) => {
    //     console.log(error);
    // })
})