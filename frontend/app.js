const apiUrl = 'http://localhost:8000/api/todo/';
const authUrl = 'http://localhost:8000/api-token-auth/';

// 🔐 Token Management
function getToken() {
  return localStorage.getItem('token');
}

function setToken(token) {
  localStorage.setItem('token', token);
}

function clearToken() {
  localStorage.removeItem('token');
}

// UI Update
function updateUI() {
  const isLoggedIn = !!getToken();

  document.getElementById('login-section').style.display = isLoggedIn ? 'none' : 'block';
  document.getElementById('todo-section').style.display = isLoggedIn ? 'block' : 'none';
  document.getElementById('list-section').style.display = isLoggedIn ? 'block' : 'none';
  document.getElementById('logout-section').style.display = isLoggedIn ? 'block' : 'none';
}


// Login and Fetch Todos
function login() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  axios.post(authUrl, { username, password })
    .then(response => {
      const token = response.data.token;
      setToken(token);
      document.getElementById('username').value = '';
      document.getElementById('password').value = '';
      updateUI();
      fetchTodos();
    })
    .catch(error => {
      console.error('Login failed:', error);
      alert('Invalid credentials');
    });
}

// Fetch Todos
function fetchTodos() {
  const token = getToken();
  if (!token) return;

  axios.get(apiUrl, {
    headers: { Authorization: `Token ${token}` }
  })
  .then(response => {
    const todos = response.data;
    const list = document.getElementById('todo-list');
    list.innerHTML = '';

    todos.forEach(todo => {
      const item = document.createElement('li');
      item.className = 'todo-item';
      item.textContent = `${todo.title} - ${todo.completed ? '✅' : '❌'}`;

      //  Update Button
      const toggleBtn = document.createElement('button');
      toggleBtn.className = 'btn btn-toggle';
      toggleBtn.textContent = 'Update';
      toggleBtn.onclick = () => toggleTodo(todo.id, !todo.completed);

      //  Delete Button
      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'btn btn-delete';
      deleteBtn.textContent = 'Delete';
      deleteBtn.onclick = () => deleteTodo(todo.id);

      item.appendChild(toggleBtn);
      item.appendChild(deleteBtn);
      list.appendChild(item);
    });
  })
  .catch(error => {
    console.error('Error fetching todos:', error);
  });
}

// Create Todo
function createTodo() {
  const token = getToken();
  const title = document.getElementById('todo-title').value;

  if (!token || !title.trim()) return;

  axios.post(apiUrl, { title, completed: false }, {
    headers: { Authorization: `Token ${token}` }
  })
  .then(() => {
    document.getElementById('todo-title').value = '';
    fetchTodos();
  })
  .catch(error => {
    console.error('Error creating todo:', error);
  });
}

//  update Todo Status
function toggleTodo(id, newStatus) {
  const token = getToken();
  axios.patch(`${apiUrl}${id}/`, { completed: newStatus }, {
    headers: { Authorization: `Token ${token}` }
  })
  .then(() => fetchTodos())
  .catch(error => {
    console.error('Error updating todo:', error);
  });
}

// Delete Todo
function deleteTodo(id) {
  const token = getToken();
  axios.delete(`${apiUrl}${id}/`, {
    headers: { Authorization: `Token ${token}` }
  })
  .then(() => fetchTodos())
  .catch(error => {
    console.error('Error deleting todo:', error);
  });
}

//  Add Todo Button Listener
document.getElementById('add-todo').addEventListener('click', createTodo);


//  Initial Load
window.onload = () => {
  updateUI();
  if (getToken()) {
    fetchTodos();
  }
};


function logout() {
  clearToken();
  updateUI();
}

document.getElementById('logout-btn').addEventListener('click', logout);
