  const express = require('express'); // Import Express
  let todos = [
{  
    id: 1, 
    task: 'Buy groceries', 
    completed: false },
{  id: 2, task: 'Walk the dog', completed: true },
];
let nextId = 3;
   const app = express(); // Create an Express application instance
  app.use(express.json()); // To parse JSON bodies
  const PORT = process.env.PORT || 3000; // Use environment port or 3000
  app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:3000`);
});
 app.get('/', (req, res) => {
    res.send('Welcome to the To-Do API!');
});
 app.get('/todos', (req, res) => {
    res.json(todos);
});
app.get('/todos/:id', (req, res) => {
    const todoId = parseInt(req.params.id, 10);
    const todo = todos.find(t => t.id === todoId);
    if (todo) {
        res.json(todo);
    } else {
        res.status(404).json({ message: 'Todo not found' });
    }
});
 app.post('/todos', (req, res) => {
    const { task, completed = false } = req.body; // Destructure, default completed to false
    if (!task) {
        return res.status(400).json({ message: 'Task is required' });
    }
    const newTodo = {
        id: nextId++,
        task: task,
        completed: completed,
    };
    todos.push(newTodo);
    res.status(201).json(newTodo);
});
app.delete('/todos/:id', (req, res) => {
const todoId = parseInt(req.params.id, 10);
const todoIndex = todos.findIndex(t => t.id === todoId);
if (todoIndex !== -1) {
todos.splice(todoIndex, 1); // Remove 1 element at todoIndex
// res.status(204).send(); // No content, successful deletion
res.status(200).json({ message: 'Todo deleted successfully' });
} else {
res.status(404).json({ message: 'Todo not found' });
}
});
app.put('/todos/:id', (req, res) => {
  const todoId = parseInt(req.params.id, 10);
  const { task, completed } = req.body;
  const todoIndex = todos.findIndex(t => t.id === todoId);

  if (todoIndex !== -1) {
    // Basic validation for update
    if (task === undefined || typeof completed !== 'boolean') {
      return res.status(400).json({ message: 'Task and completed status (boolean) are required for update' });
    }

    todos[todoIndex] = { id: todoId, task, completed };
    res.json(todos[todoIndex]);
  } else {
    res.status(404).json({ message: 'Todo not found' });
  }
});
app.patch('/todos/:id', (req, res) => {
  const todoId = parseInt(req.params.id, 10);
  const { task, completed } = req.body;
  const todoIndex = todos.findIndex(t => t.id === todoId);

  if (todoIndex === -1) {
    return res.status(404).json({ message: 'Todo not found' });
  }

  // Get the existing todo
  const existingTodo = todos[todoIndex];

  // Validate provided fields
  if (task !== undefined && typeof task !== 'string') {
    return res.status(400).json({ message: 'Task must be a string' });
  }

  if (completed !== undefined && typeof completed !== 'boolean') {
    return res.status(400).json({ message: 'Completed must be a boolean' });
  }

  // Update only the fields that are provided
  if (task !== undefined) existingTodo.task = task;
  if (completed !== undefined) existingTodo.completed = completed;

  res.json(existingTodo);
});