//BUDGET CONTROLLER
//creating a controller module using IIEF - immediately invoked expression function
//IIFE allow data pravicy because it creates a new scope that is not visible from outside scope
var budgetController = (function() {
  // Some code
})();

//module = function expression

//UI CONTROLLER
var UIController = (function() {
  //Some code
})();

//GLOBAL APP CONTROLLER
var controller = (function(budgetCtrl, UICtrl) {

  var ctrlAddItem = function(){
    // 1. Get the field input data
    // 2. Add the tem to the budget controller
    // 3. Add the item to the UI
    // 4. Calculate the budget
    // 5. Display the budget
  }

  //event listener for input button
  document.querySelector('.add__btn').addEventListener('click', ctrlAddItem);
  //keypress event doesnt happen on any specific element, but on the global web page (anywhere on the document)
  document.addEventListener('keypress', function(event) {
    if (event.keyCode === 13 || event.which === 13) {
      ctrlAddItem();
    }
  });
})(budgetController, UIController);
