let counter = function (increment) {
  // Each counter must have its own count
  let count = 0;

  // Return a function that increments and returns count
  return function () {
    count += increment;
    return count;
  };
};

let countByTwo = counter(2); // closure that adds 2
let countByOne = counter(1); // closure that adds 1

// DO NOT change the lines below
console.log(countByTwo()); // 2
console.log(countByTwo()); // 4
console.log(countByTwo()); // 6
console.log(countByOne()); // 1
