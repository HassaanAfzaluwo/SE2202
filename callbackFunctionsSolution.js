let even_predicate = function (value) {
  // check whether the value is even
  return value % 2 === 0;
};

let odd_predicate = function (value) {
  // check whether the value is odd
  return value % 2 !== 0;
};

let undefined_predicate = function (value) {
  // check whether the given value is undefined
  return value === undefined;
};

let null_predicate = function (value) {
  // check whether the given value is null
  return value === null;
};

// function that takes predicate function (callback) and value
let check = function (predicate, value) {
  // apply predicate to value and return result
  return predicate(value);
};

console.log(check(even_predicate, 9));  // false
console.log(check(odd_predicate, 9));   // true
console.log(check(even_predicate, 8));  // true
console.log(check(odd_predicate, 8));   // false

let x;
console.log(check(undefined_predicate, x)); // true
console.log(check(null_predicate, x));      // false
