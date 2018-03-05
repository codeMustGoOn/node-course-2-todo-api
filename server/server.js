require('./config/config.js');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();
const port = process.env.PORT;
app.use(bodyParser.json());

app.post('/todos', (req, res) => {
  let newTodo = new Todo({
    text: req.body.text
  });
  newTodo.save().then((docs) => {
    res.send(docs);
    // console.log(`Saved to do: ${JSON.stringify(docs, undefined, 2)}`);
  }, (e) => {
    res.status(400).send(e);
    // console.log('Unable to save');
  });
});

app.get('/todos', (req, res) => {
  Todo.find().then((todos) => {
    res.send({todos});
    // console.log(`Saved to do: ${JSON.stringify(todos, undefined, 2)}`);
  }, (e) => {
    res.status(400).send(e);
    // console.log('Unable to save');
  });
});

app.get('/todos/:id', (req, res) => {
  let id = req.params.id;

  if (!ObjectID.isValid(id)) return res.status(404).send();

  Todo.findById(id).then((todo) => {
    if (!todo) return res.status(404).send();
    res.send({todo});
  }).catch((err) => {
    res.status(400).send();
  });

});

app.delete('/todos/:id', (req, res) => {
  let id = req.params.id;

  if (!ObjectID.isValid(id)) return res.status(404).send();

  Todo.findByIdAndRemove(id).then((todo) => {
    if (!todo) return res.status(404).send();
    res.send({todo});
  }).catch((err) => {
    res.status(400).send();
  });

});

app.patch('/todos/:id', (req, res) => {
  let id = req.params.id;
  var body = _.pick(req.body, ['text', 'completed']);

  if (!ObjectID.isValid(id)) return res.status(404).send();

  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
    if (!todo) return res.status(404).send();
    res.send({todo});
  }).catch((err) => {
    res.status(400).send();
  });

});

app.post('/users', (req, res) => {
  let newUser = new User({
    email: req.body.text
  });
  newUser.save().then((docs) => {
    res.send(docs);
    // console.log(`Saved to do: ${JSON.stringify(docs, undefined, 2)}`);
  }, (e) => {
    res.status(400).send(e);
    // console.log('Unable to save');
  });
});

app.listen(port, () => {
  console.log(`App started on port ${port}`);
});


module.exports = {app};
