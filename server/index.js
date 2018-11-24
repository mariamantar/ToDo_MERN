// import { GraphQLServer } from 'graphql-yoga';
// ... or using `require()` because its NodeJS:
const { GraphQLServer } = require('graphql-yoga');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/test", { useNewUrlParser: true })
  .then(() => server.start(() => console.log('Server is running localhost:4000')))
  .catch((err) => console.log(err));

//add the 'mongoose' Schema:
const Todo = mongoose.model("Todo", {
    text: String,
    complete: Boolean
});

//this is the GraphQL's 'Schema':
//'hello' takes 1 argument 'name' with data type 'String', another 'String!' is the return type, exclamation mark means its mandatory (you have to pass it):
//'Mutation' will return a type 'Todo' defined above it:
//'id' is created automatically by MongoDB, GraphQL has a dedicated type 'ID' for this:
//we also want to return an array of a type 'Todo' as a 'todos' array:
const typeDefs = `
  type Query {
    hello(name: String): String!
    todos: [Todo]
  }
  type Todo {
    id: ID!
    text: String!
    complete: Boolean!
  }
  type Mutation {
    createTodo(text: String!): Todo
    updateTodo(id: ID!, complete: Boolean!): Boolean
    removeTodo(id: ID!): Boolean
  }
`
//'query' is like a command/function, while 'mutation' is operations involving database changes

//resolvers are similar to the queries (above), dictates what happens to the query (if no 'name' is provided, we just output "Hello World")
const resolvers = {
  Query: {
    hello: (_, { name }) => `Hello ${name || 'World'}`,
    todos: () => Todo.find()
  },
  Mutation: {
    //“async” before a function ensures that a function always returns a promise. If the code has `return <non-promise>` in it, then JavaScript automatically wraps it into a resolved promise with that value:
    createTodo: async (_, { text }) => {
        //when 'createTodo' is called, we create an instance of 'Todo':
        //by default we want 'complete' to be false:
        const todo = new Todo({ text, complete: false });
        //before we return 'todo', we want to save it to the db
        //because .save() returns a promise, we use 'await'
        //'await' makes JavaScript wait until that promise settles and returns its result (it’s just a more elegant syntax of getting the promise result than promise.then)
        await todo.save();
        return todo;
    },
    updateTodo: async (_, { id, complete }) => {
        //we specify 'id' as search parameter and what needs to be changed ('complete'):
        await Todo.findOneAndUpdate(id, { complete }, {new: true});
        //if update was successful, return 'true', otherwise we get an error
        return true;
    },
    removeTodo: async (_, { id }) => {
        //we specify 'id' as search parameter:
        await Todo.findOneAndDelete(id, {new: true});
        //if remove was successful, return 'true', otherwise we get an error
        return true;
    }
  }
};

//starting the GraphQL server with defined parameters above:
const server = new GraphQLServer({ typeDefs, resolvers });
