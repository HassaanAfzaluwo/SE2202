// Global scope
var message = "hello world!"; // global message

function greetingFunction(saySomethingElse) {
  // Function scope
  var message = "hi"; // function-level message
  console.log(message);

  if (saySomethingElse) {
    // Block scope
    let message = "hello!"; // block-level message
    console.log(message);
  }
}

// DO NOT change the next 3 lines
greetingFunction();         // Should return "hi"
greetingFunction(true);     // Should return "hi" and "hello!"
console.log(message);       // Should return "hello world!"

if (true) {
  var message = "goodbye!"; // redefines global message because var ignores block scope
}

// DO NOT change this line
console.log(message);       // Should return "goodbye!"
