const express = require('express');
const database = require('mysql')
const cors = require("cors");

const app = express()
app.use(cors());

const connection = database.createConnection({
    host:'10.0.0.101',
    user:'root',
    database:'porfolio'
})

connection.connect()

app.get('/',(req,res)=>{
    res.send('go to /todolist to see todos')
})

app.get('/todolist/add',(req,res)=>{
        const { id, todo,datestamp}= req.query;
        const statement = `INSERT INTO todolist(id,todo,datestamp) VALUES ('${id}', '${todo}','${datestamp}')`

        let onDone =(error) =>{
            if(error){
                return res.send(JSON.stringify(error))
            }
            return res.send("adding todos")
        }
        connection.query(statement,onDone)
    }
)

app.get('/todolist/delete',(req,res)=>{
    const { id }= req.query;
    const deleteStatement = `DELETE FROM todolist WHERE id = '${id}' `
    let onDone =(error) =>{
        if(error){
            return res.send(JSON.stringify(error))
        }
        return res.send("deleting todos")
    }
    connection.query(deleteStatement,onDone)
})


const getFullTodolist = (req,res)=> {
    let onDone = (error, results) => {
        if (error) {
            return res.send(error)
        }

        return res.json(results)
    }

    connection.query("select * from todolist", onDone)
}

app.get('/todolist', getFullTodolist)


app.listen(4000,()=>{
    console.log('server is running')
})