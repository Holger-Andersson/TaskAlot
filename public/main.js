let task = "";
let taskList = [];

const taskInput = document.getElementById("task");
const button = document.getElementById("submit");
const list = document.getElementById("task-List");
const loadingMessage = document.getElementById("loading");
const errorMessage = document.getElementById("error");

const getTask = async () => {
    const res = await fetch("/task", {
        method: "POST",
        body: JSON.stringify({ task }),
        headers: {
            "Content-Type": "application/json",
        },
    });
    const body = await res.json();
    const addtask = body.message;
    document.getElementById("whatTask").innerHTML = addtask;
    renderTasks();
    taskInput.value = "";
    task = "";
};

const getList = async () => {
    const res = await fetch("/tasks");
    const tasks = await res.json();
    taskList = tasks;
};

const createTextNode = (item) => {
    const container = document.createElement("div");
    container.textContent = `${item.task}`;
    return container;
};

const createLiNoDataAvailable = () => {
    const container = document.createElement("li");
    container.textContent = "This is an empty list, let's change that.";
    return container;
};

const createCheckBox = (item) => {
    const container = document.createElement("div");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = item.id;
    checkbox.checked = item.checked;

    container.appendChild(checkbox);

    checkbox.addEventListener("click", checkedBox);

    return container;
};

const checkedBox = async (event) => {
    await fetch(`/task/checked/${event.target.id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
    });
    renderTasks();
};

const createDeleteButton = (id) => {
    const container = document.createElement("div");
    const button = document.createElement("button");
    button.id = id;
    button.innerText = "X";

    container.appendChild(button);

    container.addEventListener("click", deleteTask);

    return container;
};

const createLiElement = (item) => {
    const container = document.createElement("li");
    container.appendChild(createCheckBox(item));
    container.appendChild(createTextNode(item));
    container.appendChild(createDeleteButton(item.id));
    return container;
};

const deleteTask = async (event) => {
    await fetch(`/delete/${event.target.id}`, {
        method: "DELETE",
    });
    renderTasks();
};

const renderTasks = async () => {
    await getList();
    list.innerHTML = "";
    if (!taskList.length) {
        const el = createLiNoDataAvailable();
        list.appendChild(el);
    } else {
        loadingMessage.remove();
        for (taskItem of taskList) {
            const listElement = createLiElement(taskItem);

            list.appendChild(listElement);
        }
    }
};

const setNewTask = (event) => {
    task = event.target.value;
    event.target.value = task;
};

const handleEnter = (event, newTask) => {
    if (event.key === "Enter") {
        if (newTask === task) {
            setNewTask(event);
        }
        //error.innerText = "";
        getTask();
    }
};

button.addEventListener("click", getTask);

taskInput.addEventListener("input", setNewTask);

taskInput.addEventListener("keypress", (event) =>
    handleEnter(event, "newTask"),
);

document.addEventListener("DOMContentLoaded", renderTasks);