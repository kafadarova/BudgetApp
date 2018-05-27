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
      if (data.allItems[type].length > 0) {
        ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
      } else {
        ID = 0;
      }

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
    },
    testing: function() {
      console.log(data);
    }
  };
})();

//module = function expression

//UI CONTROLLER
var UIController = (function() {
  var DOMstrings = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    inputBtn: '.add__btn',
    incomeContainer: '.income__list',
    expensesContainer: '.expenses__list'
  }
  return {
    getinput: function() {
      return {
        //will be either inc or exp
        type: document.querySelector(DOMstrings.inputType).value,
        description: document.querySelector(DOMstrings.inputDescription).value,
        //use the function parseFloat - convert a string to a floating number
        value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
      };
    },

    addListItem: function(obj, type) {
      var html, newHtml, element;
      //Create HTML string with placeholder text
      if (type === 'inc') {
        element = DOMstrings.incomeContainer;

        html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"> <div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div></div> </div>'
      } else if (type === 'exp') {
        element = DOMstrings.expensesContainer;

        html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
      }

      //Replace the placeholder text with some actual data
      //with replace method we search for string and replace it with the data we put into the parathesis in the method
      newHtml = html.replace('%id%', obj.id);
      newHtml = newHtml.replace('%description%', obj.description);
      newHtml = newHtml.replace('%value%', obj.value);

      // Insert the HTML into the DOM
      //beforeend = right before the closing tag as a last child in the list
      document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
    },
    //after adding an input we need to clear the input field
    clearFields: function() {
      var fields, fieldsArr;

      fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);
      //Array - function constructor for all arrays
      //all methods, which the arrays inherite, are in arrays prootype prorperty
      //tricking the slice method that we are giving an array, but 'fields' is actually a list
     fieldsArr =  Array.prototype.slice.call(fields);

     fieldsArr.forEach(function(current, index, array) {
       current.value = "";
     });
     //set the focus on the first element of the array
     fieldsArr[0].focus();
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
  var updateBudget = function() {

        // 1. Calculate the budget

        // 2. Return the budget

        // 3. Display the budget
  }

  var ctrlAddItem = function() {
    var input, newItem;

    // 1. Get the field input data
    input = UICtrl.getinput();

    // 2. Add the item to the budget controller
    newItem = budgetCtrl.addItem(input.type, input.description, input.value);

    // 3. Add the item to the UI
    UICtrl.addListItem(newItem, input.type);

    // 4. Clear the fields;
    UICtrl.clearFields();

    // 5. Calculate and update budget
    updateBudget();
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
