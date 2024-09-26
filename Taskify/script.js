const div = document.querySelector(".inputDiv");
const sections = document.querySelectorAll(".sections");
let todosEasy = [];
let todosMedium = [];
let todosHard = [];

setInterval(() => {
    let draggables = document.querySelectorAll(".draggables");
    draggables.forEach(draggable => {
        draggable.addEventListener("dragstart",(e) => {
            let id = draggable.id.split("-")[1];
            let item;
            let level;

            if(e.target.parentNode.parentNode.classList.contains("easy")){
                item = todosEasy[id];
                level = "easy"
            }
            else if(e.target.parentNode.parentNode.classList.contains("medium")){
                item = todosMedium[id];
                level = "medium"
            }
            else if(e.target.parentNode.parentNode.classList.contains("hard")){
                item = todosHard[id];
                level = "hard"
            }
            e.dataTransfer.setData('application/json', JSON.stringify(item));
            e.dataTransfer.setData('text/plain', `${level}-${id}`);
        })
    })
}, 1000);

sections.forEach(section => {
    section.addEventListener("dragover",(e) => {
        e.preventDefault();
    })
    section.addEventListener('drop', (e) => {
        const item = e.dataTransfer.getData('application/json');
        const level = e.dataTransfer.getData('text/plain').split("-")[0]; 
        const id = e.dataTransfer.getData('text/plain').split("-")[1]; 
        console.log(level)
        console.log(id)
        const draggableElement = JSON.parse(item);

        let todoDiv = section.children[2];
        if (section.classList.contains("easy")) {
            todosEasy.push(draggableElement);
            render(todoDiv, todosEasy);
        } else if (section.classList.contains("medium")) {
            todosMedium.push(draggableElement);
            render(todoDiv, todosMedium);
        } else{
            todosHard.push(draggableElement);
            render(todoDiv, todosHard);
        }
        
        if(level == "easy"){
            let newTodoDiv = document.querySelector(".easy").children[2];
            todosEasy.splice(id,1);
            render(newTodoDiv,todosEasy);
        }
        else if(level == "medium"){
            let newTodoDiv = document.querySelector(".medium").children[2];
            todosMedium.splice(id,1);
            render(newTodoDiv,todosMedium);
        }
        else{
            let newTodoDiv = document.querySelector(".hard").children[2];
            todosHard.splice(id,1);
            render(newTodoDiv,todosHard);
        }
        e.dataTransfer.clearData();
      });
})

setInterval(updateTimeForAllTodos, 3000000);

function append(event){
    const btn = event.target;
    if(btn.parentNode.children[1].innerHTML == ""){
        const input = document.createElement("input");
        const input2 = document.createElement("input");
        const submit = document.createElement("button");
        submit.classList.add("submit")
        submit.setAttribute("onclick","addTodo(event)");
        submit.innerHTML = "Submit"
        input.classList.add("todo")
        input.setAttribute("placeholder","Todo")
        input2.setAttribute("placeholder","Description")
        input2.classList.add("todo")
        input.setAttribute("type","text");
        btn.parentNode.children[1].appendChild(input);
        btn.parentNode.children[1].appendChild(input2);
        btn.parentNode.children[1].appendChild(submit);
    }
}

function addTodo(event){
    let submitBtn = event.target;
    let todoDiv = submitBtn.parentNode.parentNode.children[2];
    let inputVal = submitBtn.parentNode.children[0].value;
    let inputDesc = submitBtn.parentNode.children[1].value;
    let createdTime = new Date();
    if(inputVal){
        let parent = submitBtn.parentNode.parentNode;
        submitBtn.parentNode.innerHTML = "";
        if(parent.classList[1] == "easy"){
            todosEasy.push({
                todo:inputVal,
                desc:inputDesc,
                createdTime
            });
            render(todoDiv,todosEasy);
        }
        else if(parent.classList[1] == "medium"){
            todosMedium.push({
                todo:inputVal,
                desc:inputDesc,
                createdTime
            });
            render(todoDiv,todosMedium);
        }
        else{
            todosHard.push({
                todo:inputVal,
                desc:inputDesc,
                createdTime
            });
            render(todoDiv,todosHard);
        }
    }
}

function deleteTodo(todoDiv,todos,index){
    let indexToDelete = index.split("-")[1]; 
    todos.splice(indexToDelete,1);
    render(todoDiv,todos);
}

function updateTimeForAllTodos() {
    updateTimeForTodos(todosEasy);
    updateTimeForTodos(todosMedium);
    updateTimeForTodos(todosHard);
}

function updateTimeForTodos(todos) {
    todos.forEach((todo, index) => {
        let now = new Date();
        let timeElement = document.getElementById(`time-${index}`);
        let diff = Math.floor((now - new Date(todo.createdTime)) / 3600000);
        if (timeElement) {
            timeElement.innerHTML = `${diff} hours ago`;
        }
    });
}

function render(todoDiv,todos){
    todoDiv.innerHTML = "";
    for(let i=0;i<todos.length;i++){
        let deleteBtn = document.createElement("button");
        let index = `idx-${i}`;
        let div = document.createElement("div");
        let todo = document.createElement("h2");
        let todoDesc = document.createElement("p");
        let timeDiv = document.createElement("div");
        let todayDate = document.createElement("p");
        let time = document.createElement("p");
        time.setAttribute("id", `time-${i}`);

        let dateDiv = document.createElement("div");
        let dateIcon = document.createElement("div");
        dateIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-clock" viewBox="0 0 16 16">
  <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71z"/>
  <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0"/>
</svg>`

        deleteBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="black" class="bi bi-trash" viewBox="0 0 16 16">
  <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
  <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
</svg>`;
        deleteBtn.setAttribute("id", `idx-${i}`);
        deleteBtn.classList.add("deleteTodo");
        deleteBtn.addEventListener("click", () => {
            deleteTodo(todoDiv, todos, index);
        });

        div.classList.add("card");
        div.classList.add("draggables");
        div.setAttribute("id",`index-${i}`);
        div.setAttribute("draggable","true");

        timeDiv.classList.add("timeDiv");

        const date = new Date();
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = date.toLocaleDateString('en-US', options);
        todayDate.innerHTML = `${formattedDate}`;

        dateDiv.classList.add("dateDiv");
        dateDiv.appendChild(dateIcon)
        dateDiv.appendChild(todayDate)

        time.innerHTML = "0 hours ago";

        timeDiv.appendChild(dateDiv);
        timeDiv.appendChild(time);

        todoDesc.style.color = "#AE9599";
        timeDiv.style.color = "#AE9599";
        timeDiv.style.fontSize = "12px";

        todo.innerHTML = `${todos[i].todo}`;
        todoDesc.innerHTML = `${todos[i].desc}`;

        div.appendChild(todo);
        div.appendChild(todoDesc);
        div.appendChild(timeDiv);
        div.appendChild(deleteBtn);
        todoDiv.appendChild(div);
    }
}