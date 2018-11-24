import React, { Component } from 'react';
import gql from 'graphql-tag';
import { graphql, compose } from 'react-apollo';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Form from './Form'

const TodosQuery = gql`
  {
    todos {
      id
      text
      complete
    }
  }
`;

const CreateMutation = gql`
  mutation($text: String!) {
    createTodo(text: $text) {
      id
      text
      complete
    }
  }
`;

const UpdateMutation = gql`
  mutation($id: ID!, $complete: Boolean!) {
    updateTodo(id: $id, complete: $complete)
  }
`;

const RemoveMutation = gql`
  mutation($id: ID!) {
    removeTodo(id: $id)
  }
`;

class App extends Component {

  //arrow functioning binds to 'this'
  createTodo = async text => {
    //create todo
    await this.props.createTodo({
      variables: {
        text
      },
      update: (cache, {data: { createTodo }}) => {
        //read the data from our cache for this query
        const data = cache.readQuery({ query: TodosQuery });
        //query returns 'data' with 'todos', then do the front end changes needed (we also creating a copy of original array)
        data.todos.unshift(createTodo)
        //write data back to the cache
        cache.writeQuery({ query: TodosQuery, data });
      }
    });
  };

  updateTodo = async todo => {
    //update todo
    await this.props.updateTodo({
      variables: {
        id: todo.id,
        complete: !todo.complete
      },
      update: cache => {
        //read the data from our cache for this query
        const data = cache.readQuery({ query: TodosQuery });
        //query returns 'data' with 'todos', then do the front end changes needed
        data.todos = data.todos.map(x => x.id === todo.id ? { ...todo, complete: !todo.complete } : x );
        //write data back to the cache
        cache.writeQuery({ query: TodosQuery, data });
      }
    });
  };

  removeTodo = async todo => {
    //remove todo
    await this.props.removeTodo({
      variables: {
        id: todo.id
      },
      update: cache => {
        //read the data from our cache for this query
        const data = cache.readQuery({ query: TodosQuery });
        //query returns 'data' with 'todos', then do the front end changes needed (we also creating a copy of original array)
        data.todos = data.todos.filter(x => x.id !== todo.id)
        //write data back to the cache
        cache.writeQuery({ query: TodosQuery, data });
      }
    });
  };

  render() {
    console.log(this.props);
    const { data: { loading, todos }} = this.props;
    if (loading) {
      return null;
    }


    return (
      <div style={{ display: 'flex' }}>
        <div style={{ margin: "auto", width: 400 }}>
          <Paper elevation={1}>
            <Form submit={this.createTodo} />
            <List>
              {todos.map(todo => (
                <ListItem
                  key={todo.id}
                  role={undefined}
                  dense
                  button
                  onClick={() => this.updateTodo(todo)}
                >
                  <Checkbox
                  //checked can also be 'true' (everything checked) or false (nothing gets checked):
                    checked={todo.complete}
                    tabIndex={-1}
                    disableRipple
                  />
                  <ListItemText primary={todo.text} />
                  <ListItemSecondaryAction>
                    <IconButton onClick={() => this.removeTodo(todo)}>
                      <CloseIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Paper>
        </div>
      </div>
    )
  }
}

//here, 'compose' squishes queries together and wraps around the 'App'
//we also pass props to queries
export default compose(
  graphql(CreateMutation, {name: "createTodo"}),
  graphql(RemoveMutation, {name: "removeTodo"}),
  graphql(UpdateMutation, {name: "updateTodo"}),
  graphql(TodosQuery)
)(App);
