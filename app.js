const select = document.getElementById("user-todo");
const btnCreateTodo = document.getElementById("btn-add-todo");
const inputCreateTodo = document.getElementById("new-todo");
const prevPageButton = document.getElementById("prev-page");
const nextPageButton = document.getElementById("next-page");
const currentPageDisplay = document.getElementById("currentPage");
const usersData = [];
const todosData = [];
let currentPage = 1;
const tasksPerPage = 10;

btnCreateTodo.addEventListener("click", (event) => {
  event.preventDefault();
  createTodo();
});

document.addEventListener("keydown", (event) => {
  const maxPage = Math.ceil(todosData.length / tasksPerPage);
  if (event.code === "ArrowRight" && currentPage < maxPage) {
    currentPage++;
    displayTodos();
  } else if (event.code === "ArrowLeft" && currentPage > 1) {
    currentPage--;
    displayTodos();
  }
});
prevPageButton.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    displayTodos();
  }
});
nextPageButton.addEventListener("click", () => {
  const maxPage = Math.ceil(todosData.length / tasksPerPage);
  if (currentPage < maxPage) {
    currentPage++;
    displayTodos();
  }
});

async function fetchUsers() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/users");
    if (!response.ok) {
      throw new Error(`${response.status}`);
    } else {
      const newUsers = await response.json();

      usersData.length = 0;
      usersData.push(...newUsers);
      usersData.forEach((item) => {
        const newUser = document.createElement("option");
        newUser.textContent = item.name;
        newUser.value = item.id;
        select.appendChild(newUser);
      });
      console.log("Данные пользователей обновлены.");
    }
  } catch (error) {
    alert(`Ошибка при получении списка пользователей: ${error}`);
  }
}

async function fetchTodos() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/todos");
    if (!response.ok) {
      throw new Error(`${response.status}`);
    } else {
      const newTodos = await response.json();
      todosData.length = 0;
      todosData.push(...newTodos);
      console.log("Данные задач обновлены.");
      displayTodos();
    }
  } catch (error) {
    alert(`Ошибка при получении списка задач: ${error}`);
  }
}

async function updateTodoStatus(event) {
  const todoId = event.target.getAttribute("data-id");
  const checkbox = event.target;
  event.target.checked = !event.target.checked;
  try {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/todos/${todoId}`,
      {
        method: "PATCH",
        body: JSON.stringify({
          completed: !checkbox.checked,
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      }
    );
    if (!response.ok) {
      throw new Error(`${response.status}`);
    } else {
      event.target.checked = !event.target.checked;
    }
  } catch (error) {
    if (!navigator.onLine) {
      alert(`Ошибка подключения к интернету`);
    } else {
      alert(`Ошибка при обновление задачи: ${error}`);
    }
  }
}

async function deleteTodo(event) {
  const todoId = event.target.getAttribute("data-id");
  try {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/todos/${todoId}`,
      {
        method: "DELETE",
      }
    );
    if (!response.ok) {
      throw new Error(`${response.status}`);
    }
    const index = todosData.findIndex((todo) => todo.id.toString() === todoId);
    if (index !== -1) {
      todosData.splice(index, 1);
      displayTodos();
    }
  } catch (error) {
    if (!navigator.onLine) {
      alert(`Ошибка подключения к интернету`);
    } else {
      alert(`Ошибка при удаление задачи: ${error}`);
    }
  }
}

function createTodoElement(todo) {
  const listItem = document.createElement("li");
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = todo.completed;
  checkbox.setAttribute("data-id", todo.id);
  checkbox.addEventListener("change", updateTodoStatus);

  const titleSpan = document.createElement("span");
  titleSpan.textContent = todo.title;

  listItem.appendChild(checkbox);
  listItem.appendChild(titleSpan);
  return listItem;
}

function displayTodos() {
  const todoList = document.getElementById("todo-list");
  todoList.innerHTML = "";

  const startIndex = (currentPage - 1) * tasksPerPage;
  const endIndex = startIndex + tasksPerPage;
  const currentTodos = todosData.slice(startIndex, endIndex);

  currentTodos.forEach((todo) => {
    const user = usersData.find((user) => +user.id === +todo.userId);
    const listItem = createTodoElement(todo);
    listItem.innerHTML = `
          <input type="checkbox" ${todo.completed ? "checked" : ""} data-id="${
      todo.id
    }"/>
          <span>${todo.title}</span>
          <span class="user-name"> <strong> ${
            user ? user.name : "Unknown User"
          } </strong></span>
          <button class="delete-todo" data-id="${todo.id}">Х</button>
        `;

    const checkbox = listItem.querySelector("input[type='checkbox']");
    checkbox.addEventListener("change", updateTodoStatus);

    todoList.appendChild(listItem);
  });
  currentPageDisplay.innerHTML = `${currentPage}`;
  const deleteButtons = document.querySelectorAll(".delete-todo");
  deleteButtons.forEach((button) => {
    button.addEventListener("click", deleteTodo);
  });
}

async function createTodo() {
  const selectedUserId = select.value;
  const newTodoTitle = inputCreateTodo.value;

  if (!selectedUserId || !newTodoTitle) {
    alert("Пожалуйста, выберите пользователя и введите заголовок задачи.");
    return;
  }

  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/todos", {
      method: "POST",
      body: JSON.stringify({
        userId: selectedUserId,
        title: newTodoTitle,
        completed: false,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });
    if (!response.ok) {
      throw new Error(`${response.status}`);
    }
    const newTodo = await response.json();
    todosData.unshift(newTodo);
    displayTodos();
    inputCreateTodo.value = "";
  } catch (error) {
    if (!navigator.onLine) {
      alert(`Ошибка подключения к интернету`);
    } else {
      alert(`Ошибка при создании задачи: ${error}`);
    }
  }
}

fetchUsers().then(() => {
  fetchTodos();
});
