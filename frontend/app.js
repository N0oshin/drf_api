const token = 'eefed2ca37d41b11dce0b8c04bfcde43262cf09f';  
const apiUrl = 'http://localhost:8000/api/todo/';

// Fetch and display todos
function fetchTodos() {
  axios.get(apiUrl, {
    headers: {
      Authorization: `Token ${token}`
    }
  })
  .then(response => {
    const todos = response.data;
    const list = document.getElementById('todo-list');
    list.innerHTML = '';

    todos.forEach(todo => {
      const item = document.createElement('li');
      item.className = 'todo-item';
      item.textContent = `${todo.title} - ${todo.completed ? '✅' : '❌'}`;
      //toggle button for task completion
      const toggleBtn = document.createElement('button');
      toggleBtn.className = 'btn btn-toggle';
      toggleBtn.textContent = 'update';
      toggleBtn.onclick = () => toggleTodo(todo.id, !todo.completed);
      //delete btn
      const deleteBtn = document.createElement('button');
      deleteBtn.className ='btn btn-delete'
      deleteBtn.textContent = 'Delete';
      deleteBtn.onclick = () =>deleteTodo(todo.id);

      item.appendChild(toggleBtn);
      item.appendChild(deleteBtn);
      list.appendChild(item);
    });
  })
  .catch(error => {
    console.error('Error fetching todos:', error);
  });
}

// Create a new todo
function createTodo() {
  const title = document.getElementById('todo-title').value;
  axios.post(apiUrl, { title, completed: false }, {
    headers: {
      Authorization: `Token ${token}`
    }
  })
  .then(() => {
    document.getElementById('todo-title').value = '';
    fetchTodos();  // Refresh list
  })
  .catch(error => {
    console.error('Error creating todo:', error);
  });
}

function toggleTodo(id, newStatus){
  axios.patch(`${apiUrl}${id}/`, {completed : newStatus},{
    headers : {Authorization :`Token ${token}`}
  })
  .then(()=> fetchTodos())
  .catch(error => console.error('Error updating todo:', error.response || error));
}

function deleteTodo(id){
  axios.delete(`${apiUrl}${id}/`,{
    headers : {Authorization :`Token ${token}`}
  })
  .then(() => fetchTodos())
  .catch(error => console.error('error deleting a todo:', error));
}

//Add Event Listener for Add Button
document.getElementById('add-todo').addEventListener('click', createTodo);

//  Initial load
fetchTodos();