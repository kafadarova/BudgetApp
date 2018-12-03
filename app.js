//BUDGET CONTROLLER
//creating a controller module using IIEF - immediately invoked expression function
//IIFE allow data pravicy because it creates a new scope that is not visible from outside scope
var budgetController = (function() {
  //function Constructor Expense
  var Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
    this.percentage = -1; // when is not defined
  };

  // Add the method to the Expense object prototype to calculate the percentage
  Expense.prototype.calcPercentage = function(totalIncome){
    if(totalIncome > 0){
      this.percentage = Math.round((this.value / totalIncome) * 100);
    } else {
      this.percentage = -1;
    }
  };

  // Retrieve and return the percentage from the expense object
  Expense.prototype.getPercentage = function() {
    return this.percentage;
  };

  // function Constructor Income
  var Income = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  //private function - check if income or expense
  var calculateTotal = function(type) {
    //sum variable stores the sum
    var sum = 0;
    data.allItems[type].forEach(function(cur) {
      sum += cur.value;
    });
    data.totals[type] = sum;
  }

  var totalExpenses = 0;

  //creating an array with two objects
  var data = {
    allItems: {
      exp: [],
      inc: []
    },
    totals: {
      exp: 0,
      inc: 0
    },
    budget: 0,
    //-1 means that it is nonexistent
    //if there are no budget values or total exp or inc
    percentage: -1
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

    deleteItem: function(type, id) {

      // id = 6
      // data.allItems[type][id];
      // ids = [1 2 4 6 8]
      // index = 3
      var ids, index;

      ids = data.allItems[type].map(function(current) {
          return current.id;
        });

        index = ids.indexOf(id);

        // -1 means that there is no index
        if (index !== -1) {
          // first parameter - the position of what we want to delete
          // second parameter - the number of items which we want to delete
          data.allItems[type].splice(index, 1);
        }
    },

    //first calculate all of the incomes and expenses - total income and total expense
    // budget = income - expense
    calculateBudget: function() {

      // Calculate total income and expenses
      //after running the code below - the data array.total - exp or inc - will be not equal to 0
      calculateTotal('exp');
      calculateTotal('inc');

      // Calculate the budget: income - expenses and then stores the variable again in the ata budget
      data.budget = data.totals.inc - data.totals.exp;

      // Calculate the percentage of income that we spent
      // calculate only when we have already added an item
      if (data.totals.inc > 0) {
         data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
      } else {
        //when it is equal to -1 that means that is basically the nonexistent
        data.percentage = -1;
      }
    },

    // Calculate percentages
    calculatePercentages: function() {
      // Loop over the expense array
      data.allItems.exp.forEach(function(cur) {
        cur.calcPercentage(data.totals.inc);
      })
    },

    // Call this method on each of the expense objects
    getPercentages: function(){
      var allPerc = data.allItems.exp.map(function(cur) {
        return cur.getPercentage();
      });
      return allPerc;
    },

    // create an object - return the budget, total inc and exp, the percentage
    getBudget: function() {
      return {
        budget: data.budget,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        percentage: data.percentage
      }
    },

    //create a test method to check in console, when we called the method, the object data
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
    expensesContainer: '.expenses__list',
    budgetLabel: '.budget__value',
    incomeLabel: '.budget__income--value',
    expenseLabel: '.budget__expenses--value',
    percentageLabel: '.budget__expenses--percentage',
    container: '.container',
    expensesPercLabel: '.item__percentage',
    dateLabel: '.budget__title--month'
  };
  // format the number we write in the input field
  var formatNumber = function(num, type) {
      var numSplit, int, dec, type;

      // + or - before the number, exactly 2 decimal points, comma separing the thousands

      // Abs method removes the sign of the number
      num = Math.abs(num);
      // When using a method on a primitive, js converts them to objects
      num = num.toFixed(2);

      numSplit = num.split('.');

      int = numSplit[0];
      if(int.length > 3) {
        int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);
      }
      dec = numSplit[1];

      return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;
    };
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

    //add an element to the list of our exp and income
    addListItem: function(obj, type) {
      var html, newHtml, element;
      //Create HTML string with placeholder text
      if (type === 'inc') {
        element = DOMstrings.incomeContainer;

        html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"> <div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div></div> </div>'
      } else if (type === 'exp') {
        element = DOMstrings.expensesContainer;

        html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
      }

      //Replace the placeholder text with some actual data
      //with replace method we search for string and replace it with the data we put into the parathesis in the method
      newHtml = html.replace('%id%', obj.id);
      newHtml = newHtml.replace('%description%', obj.description);
      newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));

      // Insert the HTML into the DOM
      //beforeend = right before the closing tag as a last child in the list
      document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
    },
    //
    deleteListItem: function(selectorID) {
      // we can remove only a child, so we move up to the parent node
      var el = document.getElementById(selectorID);
      el.parentNode.removeChild(el);
    },

    //after adding an input we need to clear the input field
    clearFields: function() {
      var fields, fieldsArr;

      fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);
      //Array - function constructor for all arrays
      //all methods, which the arrays inherite, are in arrays prootype prorperty
      //tricking the slice method that we are giving an array, but 'fields' is actually a list
      fieldsArr = Array.prototype.slice.call(fields);

      fieldsArr.forEach(function(current, index, array) {
        current.value = "";
      });
      //set the focus on the first element of the array
      fieldsArr[0].focus();
    },

// Call an object where to whole data is stored
    displayBudget: function(obj) {
      var type;
      obj.budget > 0 ? type = 'inc' : type = 'exp';

      document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
      document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
      document.querySelector(DOMstrings.expenseLabel).textContent = formatNumber(obj.totalExp, 'exp');

      //percentage is only shown when it is greater than 0
      if (obj.percentage > 0) {
        document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
      } else {
        document.querySelector(DOMstrings.percentageLabel).textContent = '---';
      }
    },
    // Pass an array argument as parameter
    displayPercentages: function(percentages) {
      // Use querySelectorAll, because we need all the percentage of all items
      // Return a node list
      var fields = document.querySelectorAll(DOMstrings.expensesPercLabel);

      // Create a function to loop over the node list
      var nodeListForEach = function(list, callback) {
         for (var i = 0; i < list.length; i++) {
           callback(list[i], i);
         }
      };

      nodeListForEach(fields, function(current, index) {

      if (percentages[index] > 0) {
            current.textContent = percentages[index] + '%';
          } else {
              current.textContent = '---';
          }
        });
    },

    displayMonat: function() {
      var now, year, months, month;
      // return the date of today
    now = new Date();
    months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    year = now.getFullYear();
    month = now.getMonth();
    document.querySelector(DOMstrings.dateLabel).textContent = months[month] + ' ' + year;
    },

    //exposing the DOMstrings to the public
    getDOMstrings: function() {
      return DOMstrings;
    }
  };
})();

//GLOBAL APP CONTROLLER
// pass both others controllers and asign them to the parametes in iief
var controller = (function(budgetCtrl, UICtrl) {

  // Set up an event listeners
  var setupEventListeners = function() {

    // Get the DOM strings and stored them into the var called DOM
    var DOM = UICtrl.getDOMstrings();

    // Event listener for input button
    document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
    // Keypress event doesnt happen on any specific element, but on the global web page (anywhere on the document)
    document.addEventListener('keypress', function(event) {
      if (event.keyCode === 13 || event.which === 13) {
        event.preventDefault();
        ctrlAddItem();
      }
    });
    // Add an event listener for the parent element of the income/expense delete button
    document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
  };

  var updateBudget = function() {

    // 1. Calculate the budget
    budgetCtrl.calculateBudget();

    // 2. Return the budget
    var budget = budgetCtrl.getBudget();

    // 3. Display the budget on the UI
    // console.log(budget);
    UICtrl.displayBudget(budget);
  }


    var updatePercentages = function() {
      // 1. Calculate percentage
      budgetCtrl.calculatePercentages();

      // 2. Read percentages from the budget controller
      var percentages = budgetCtrl.getPercentages();

      // 3. Update the UI with the new percentages
      UICtrl.displayPercentages(percentages);
    }

  var ctrlAddItem = function() {
    var input, newItem;

    // 1. Get the field input data
    input = UICtrl.getinput();

    //input description should not be empty and the number should actually be a number
    if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
      // 2. Add the item to the budget controller
      newItem = budgetCtrl.addItem(input.type, input.description, input.value);

      // 3. Add the item to the UI
      UICtrl.addListItem(newItem, input.type);

      // 4. Clear the fields;
      UICtrl.clearFields();

      // 5. Calculate and update budget
      updateBudget();

      // 6. Calculate and update the percentage
      updatePercentages();
    }

  };

// add a name function for the event passing as parameter the event object
  var ctrlDeleteItem = function(event) {
    var itemID, splitID, type, ID;
    itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

      if(itemID) {
          // inc-1
          splitID = itemID.split('-');
          type = splitID[0];
          ID = parseInt(splitID[1]);

          // 1. Delete the item from the data structure
          budgetCtrl.deleteItem(type, ID);

          // 2. Delete the item from the UI
          UICtrl.deleteListItem(itemID);

          // 3. Update and show the new budget
          updateBudget();

          // 4. Calculate and update percentages
          updatePercentages();
    }
  };

  //public function - so we will return it into an object
  return {
    init: function() {
      console.log('Application has started');
      UICtrl.displayMonat();
      //set everything to zero on reload
      UICtrl.displayBudget({
        budget: 0,
        totalInc: 0,
        totalExp: 0,
        percentage: -1 //there is no percentage at all
      });
      setupEventListeners();
    }
  };

})(budgetController, UIController);

//execute rigth at the begging when our app has started
controller.init();
