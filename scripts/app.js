var TodoList = function() {

    var todos = []; // Object where to store the data
    var showCompleted = false;
    var todolist = document.querySelector('#todoList');
    var todoInputElement = document.querySelector('#addTodo');
    var showCompletedBtn = document.querySelector('#showCompletedBtn');

    // Check if the browser supports localStorage
    var hasLocalStorage = function(){
        if('localStorage' in window){
            try{
                localStorage.setItem('test',1) ;
                return localStorage.getItem('test');
            } catch(e){
                return false;
            }
        }
    };

    if(hasLocalStorage()){
        var lCompleted = localStorage.getItem('showCompleted');
        if (lCompleted && lCompleted !== 'false'){
            showCompleted = true;
        }
    }

    // Create an element with them the text of the task to do
    var createLi = function(obj, id){
        var id = id || 0;
        var li = document.createElement('li');
        li.id = id;
        var i = document.createElement('i');
        i.className = 'todoCheck';

        var deleteItem = document.createElement('em');
        deleteItem.className = 'deleteItem';
        deleteItem.innerHTML = '&#215;';

        li.appendChild(document.createTextNode(obj.name));
        li.appendChild(i);
        li.appendChild(deleteItem);

        if(obj.completed){
            li.classList.add('completed');
            if(!showCompleted){
                li.classList.add('hidden');
            }
        }

        return li;
    }

    // Reassign the id to the "LI" element when you add a new todo
    var orderList = function(todolist){
        var currentList = todolist.querySelectorAll('li');

        for( var i=1; currentList[i]; i++){
            currentList[i].id = i-1;
        }
    }

    // Change Completed in Unfinished and conversely
    var toggleComplete = function(id){
        todos[id].completed = !todos[id].completed;
    }

    // Put the todo item in localStorage so that there is when you refresh your browser
    var syncLocalStorage = function(){
        if(!hasLocalStorage()){
            return false;
        }
        localStorage.setItem('todos', JSON.stringify(todos));
    }

    // Add listeners to the buttons and list of todo
    var initListener = function(){

        toggleButtonLabel(showCompletedBtn);

        showCompletedBtn.addEventListener('click', function(e){

            toggleViewCompleted();
            toggleButtonLabel(e.target)
            var checkedElements = todolist.querySelectorAll('.completed');

            for(var i=0; checkedElements[i]; i++){
                checkedElements[i].classList.toggle('hidden');
            }

        });

        todolist.addEventListener('click', function(e){
            var listItem = e.target.parentNode;

            if(e.target.className === 'todoCheck'){
                toggleCompleteAndSync(listItem.id);
                listItem.classList.toggle('completed');

                if (!showCompleted) {
                    listItem.classList.add('hidden');
                }
            }

            if(e.target.className === 'deleteItem'){
                removeTodo(listItem.id);
                listItem.parentNode.removeChild(listItem);
            }
        });

        // Check if you pressed ENTER and if the todo has at least 3 characters
        todoInputElement.addEventListener('keypress', function(e){
            if(e.key === "Enter" && e.target.value ){
                if(e.target.value.length >= 3){
                    addTodo(e.target.value);

                    var newElement = createLi({name: e.target.value, completed: false});

                    todolist.insertBefore(newElement, todolist.firstElementChild.nextElementSibling);
                    orderList(todolist);
                    e.target.value = '';
                }else{
                    alert("Please enter at least 3 characters");
                }
            }
        });
    }

    // Helper methods

    var removeTodo= function(id){
        todos.splice(id, 1);
        syncLocalStorage();
    }

    var toggleButtonLabel = function (showCompleteBtn) {
        showCompleteBtn.innerHTML = showCompleted ? 'Hide Completed' : 'Show Completed';
    }

    var toggleViewCompleted = function(){
        showCompleted = !showCompleted;
        if(hasLocalStorage()){
            localStorage.setItem('showCompleted', showCompleted);
        }
    }

    var getTodos = function () {
        if (todos.length) {
            return todos;
        }
        if (hasLocalStorage() && localStorage.getItem('todos')) {
            todos = JSON.parse(localStorage.getItem('todos'));
            return todos;
        }
    }

    var toggleCompleteAndSync = function (id) {
        toggleComplete(id);
        syncLocalStorage();
    }

    var addTodo = function(todo){
        todos.unshift({name: todo, completed: false});
        syncLocalStorage();
    }

    var showTodos = function(){
        var todos = getTodos() || [];
        todos.forEach(function(objItem, id){
            todolist.appendChild( createLi(objItem, id) );
        });
    }

    return {
        init: initListener,
        showTodos: showTodos
    }
};

document.addEventListener('DOMContentLoaded', function(){
    var myApp = TodoList();
    myApp.init();
    myApp.showTodos();
});
