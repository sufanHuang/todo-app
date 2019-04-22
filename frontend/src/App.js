import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import uuid from 'uuid';


class App extends Component {
   state ={
     todos:[],
     item:{
        todo:"",
        id: uuid(),
        datestamp:""
     },
   }

   componentDidMount(){
        this.getTodolist();
    }

    getTodolist = () => {
       let setState = (todos) => {
           console.log('Setting JSON', JSON.stringify(todos))
           this.setState({ todos })
       }

        fetch('http://localhost:4000/todolist')
            .then(response => response.json())
            .then(setState)
            .catch(error => console.error(JSON.stringify(error)))
    }

    addTodo = ()=>{
       const { item } = this.state
       fetch(`http://localhost:4000/todolist/add?id=${item.id}&todo=${item.todo}&datestamp=${item.datestamp}`)
           .then(() => console.log('data saved'))
           .then(this.getTodolist)
           .then(this.setState({
               item: {
                   todo:'',
                   datestamp:""
               },
           }))
           .catch(error=> console.error(JSON.stringify(error)))
    }

    deleteTodo = (id)=>{
        const filteredItems = this.state.todos.filter(item=>{return item.id!==id})
        fetch(`http://localhost:4000/todolist/delete?id=${id}`)
            .then(() => console.log('data deleted'))
            .then(this.getTodolist)
            .then(this.setState({
                todos:filteredItems
            }))
            .catch(error=> console.error(JSON.stringify(error)))
    }


   handleChange = (e) =>{
       const DATE_OPTIONS = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
       this.setState({
       item: {
       todo:e.target.value,
       id:uuid(),
       datestamp:(new Date()).toLocaleDateString('en-US', DATE_OPTIONS)
       }
   })
   }


  render() {
      const {todos,item,datestamp}=this.state;
      const DATE_OPTIONS = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
      const headerDate = (new Date()).toLocaleDateString('en-US', DATE_OPTIONS)
    return(
      <div className="container">
        <div className="row">
          <div className="col-10 mx-auto col-md-8 mt=4">
              <div className="jumbotron jumbotron-fluid">
                  <div className="container">
                      <h1 className="display-4 text-center text-info" >{headerDate}</h1>
                      <h4 className="lead text-center">What's Your Today's Action Piece? </h4>
                  </div>
              </div>

              <div>
                  <div className="input-group flex-nowrap">
                      <div className="input-group-prepend">
                    <span className="input-group-text" id="addon-wrapping">
                        <i className="fas fa-book-open"></i>
                    </span>
                      </div>
                      <input value={item.todo} className="form-control" placeholder="Add todo"  onChange={this.handleChange}
                      />
                  </div>
                  <br/>
                  <button type ='button' className= 'btn btn-secondary btn-lg btn-block'
                          onClick={this.addTodo}>Add Item</button>
              </div>

              <div>
                  <ul className="list-group">
                      <h1 className='text-center'>Action List</h1>
                      {todos.map( item => {
                          return(
                              <li key = {item.id} className='list-group-item d-flex justify-content-between my-2'>
                                  <h6>{item.todo}</h6>
                                  <h6>{item.datestamp}</h6>
                                  <div className= 'todo-icon'>
                                        <span className= 'mx-2 text-danger' >
                                             <i className='fas fa-trash' onClick={()=>this.deleteTodo(item.id)}/>
                                        </span>
                                  </div>
                              </li>
                         )}
                      )}
                  </ul>
              </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
