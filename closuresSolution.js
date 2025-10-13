let counter = function (increment) {
  let count = 0; // independent count for each closure

  return function () {
    count += increment;
    return count;
  };
};

let countByTwo = counter(2);
let countByOne = counter(1);

console.log(countByTwo()); // Expected: 2
console.log(countByOne()); // Expected: 1
console.log(countByTwo()); // Expected: 4
console.log(countByOne()); // Expected: 2
