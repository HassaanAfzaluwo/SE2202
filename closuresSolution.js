let counter = function (increment) {
  let count = 0; // keep each counter independent

  return function () {
    count += increment;
    return count;
  };
};

// each counter must start from 0 and work independently
let countByTwo = counter(2);
let countByOne = counter(1);

// assignment’s expected call orde
console.log(countByOne()); // Expected: 1
console.log(countByTwo()); // Expected: 2
console.log(countByTwo()); // Expected: 4
console.log(countByTwo()); // Expected: 6
