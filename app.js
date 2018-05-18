//BUDGET CONTROLLER
//creating a controller module using IIEF - immediately invoked expression function
//IIFE allow data pravicy because it creates a new scope that is not visible from outside scope
var budgetController = (function() {
  //function Constructor Expense
  var Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };
  //function Constructor Income
  var Income = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  var totalExpenses = 0;

  var data = {
    allItems: {
      exp: [],
      inc: []
    },
    totals: {
      exp: 0,
      inc: 0
    }
  }
  //creating a public method - so other modulles will be allowed to add new data to their data structure
  //returning an object which contain all of the public methods
  return {
    addItem: function(type, des, val) {
      var newItem, ID;

      //an unique number wee want to asing to each new exp or inc
      //IID = last ID + 1;
      //create a new ID
      ID = data.allItems[type][data.allItems[type].length - 1].id + 1;

      //Create a new item based on 'inc' or 'exp' type
      if (type === 'exp') {
        newItem = new Expense(ID, des, val);
      } else if (type === 'inc') {
        newItem = new Income(ID, des, val);
      }

      //with [type] we will select one of the arrays in the object allItems
      //Push it into our data structure

      data.allItems[type].push(newItem);
      //returning the newItem so the other modulles will have access to it
      return newItem;
    }
  }
})();

//module = function expression

//UI CONTROLLER
var UIController = (function() {
  var DOMstrings = {
    inputType: '.add__type',
    inputDescription: '.add__description',
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

  //set up an event listeners
  var setupEventListeners = function() {

    //get the DOM strings and stored them into the var called DOM
    var DOM = UICtrl.getDOMstrings();

    //event listener for input button
    document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
    //keypress event doesnt happen on any specific element, but on the global web page (anywhere on the document)
    document.addEventListener('keypress', function(event) {
      if (event.keyCode === 13 || event.which === 13) {
        event.preventDefault();
        ctrlAddItem();
      }
    });
  };


  var ctrlAddItem = function() {
    // 1. Get the field input data
    var input = UICtrl.getinput();

    // 2. Add the tem to the budget controller
    budgetCtrl.addItem(input.type, input.description, input.value);
    // 3. Add the item to the UI
    // 4. Calculate the budget
    // 5. Display the budget
  };

  //public function - so we will return it into an object
  return {
    init: function() {
      console.log('Application has started');
      setupEventListeners();
    }
  };

})(budgetController, UIController);

//execute rigth at the begging when our app has started
controller.init();
