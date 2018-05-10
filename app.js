//creating a controller module using IIEF - immediately invoked expression function
//IIFE allow data pravicy because it creates a new scope that is not visible from outside scope
var budgetController = (function() {
  var x = 23;

  var add = function(a) {
    return a + x;
  }

  return {
    publicTest: function(b)  {
      return add(b);
    }
  }
})();

//module = function expression

//module
var UIController = (function(){
  //Some code
})();

//module
var controller = (function(budgetCtrl, UICtrl){
   var z = budgetCtrl.publicTest(5);

   return {
     anotherPublic: function(){
       console.log(z);
     }
   }
})(budgetController, UIController);
