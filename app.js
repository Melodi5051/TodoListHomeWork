let usersAPI = [];
const select = document.getElementById("user-todo");
const btnCreateTodo = document.getElementById("btn-add-todo");
const inputCreateTodo = document.getElementById("new-todo");
const todoList = document.getElementById("todo-list");

btnCreateTodo.addEventListener("click", (event) => {
  event.preventDefault();
  const newTodo = {
    userId: +select.value,
    title: inputCreateTodo.value,
    completed: false,
  };
  fetch("https://jsonplaceholder.typicode.com/todos", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newTodo),
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log(data);
      addTodos(data);
    });
});
fetch("https://jsonplaceholder.typicode.com/users")
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    data.forEach((el) => {
      usersAPI.push(el.name);
    });
    addUsersSelect(data);
  })
  .catch((error) => {
    console.error(error);
  });

fetch("https://jsonplaceholder.typicode.com/todos")
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    data.forEach((element) => {
      addTodos(element);
    });
  })
  .catch((error) => {
    console.error(error);
  });

function addTodos(todo) {
  const newTodo = document.createElement("li");

  const text = document.createElement("p");
  text.textContent = todo.title;

  const nameUser = document.createElement("strong");
  nameUser.textContent = ` ${usersAPI[todo.userId - 1] ?? "Artem Natochin"}`;
  text.appendChild(nameUser);

  const btnDelete = document.createElement("button");
  btnDelete.textContent = "X";

  const inputCheckBox = document.createElement("input");
  inputCheckBox.type = "checkbox";
  inputCheckBox.checked = todo.completed;

  newTodo.appendChild(inputCheckBox);
  newTodo.appendChild(text);
  newTodo.appendChild(btnDelete);
  todoList.appendChild(newTodo);
}

function addUsersSelect(users) {
  users.forEach((element) => {
    const option = document.createElement("option");
    option.value = element.id;
    option.textContent = element.name;
    select.appendChild(option);
  });
}
