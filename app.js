//BUDGET CONTROLLER
//creating a controller module using IIEF - immediately invoked expression function
//IIFE allow data pravicy because it creates a new scope that is not visible from outside scope
var budgetController = (function() {
  // Some code
})();

//module = function expression

//UI CONTROLLER
var UIController = (function() {
  var DOMstrings = {
    inputType: '.add__type',
    inputDescription : '.add__description',
    inputValue: '.add__value',
    inputBtn: '.add__btn'
  }
  return {
    getinput: function() {
      return {
      //will be either inc or exp
      type: document.querySelector(DOMstrings.inputType).value,
      description: document.querySelector(DOMstrings.inputDescription).value,
      value: document.querySelector(DOMstrings.inputValue).value
      };
    },
    //exposing the DOMstrings to the public
    getDOMstrings: function() {
      return DOMstrings;
    }
  };
})();

//GLOBAL APP CONTROLLER
var controller = (function(budgetCtrl, UICtrl) {
  //get the DOM strings and stored them into the var called DOM
  var DOM = UICtrl.getDOMstrings();

  var ctrlAddItem = function() {
    // 1. Get the field input data
    var input = UICtrl.getinput();
    console.log(input);
    // 2. Add the tem to the budget controller
    // 3. Add the item to the UI
    // 4. Calculate the budget
    // 5. Display the budget
  }

  //event listener for input button
  document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
  //keypress event doesnt happen on any specific element, but on the global web page (anywhere on the document)
  document.addEventListener('keypress', function(event) {
    if (event.keyCode === 13 || event.which === 13) {
      ctrlAddItem();
    }
  });
})(budgetController, UIController);
