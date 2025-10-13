let getDictionary = function (lang) {
  /*
    The value of lang could be:
    - 'E' for English
    - 'F' for French
  */

  // inner English dictionary
  let englishDictionary = function (number) {
    switch (number) {
      case 1:
        return "one";
      case 2:
        return "two";
      case 3:
        return "three";
      default:
        return "unknown";
    }
  };

  // inner French dictionary
  let frenchDictionary = function (number) {
    switch (number) {
      case 1:
        return "un";
      case 2:
        return "deux";
      case 3:
        return "trois";
      default:
        return "inconnu";
    }
  };

  // return the correct dictionary based on lang
  if (lang === "E") {
    return englishDictionary;
  } else if (lang === "F") {
    return frenchDictionary;
  } else {
    return function () {
      return "invalid language";
    };
  }
};

// call getDictionary and store returned functions
let english = getDictionary("E");
let french = getDictionary("F");

console.log(english(1)); // one
console.log(french(1));  // un
console.log(english(2)); // two
console.log(french(2));  // deux
console.log(english(3)); // three
console.log(french(3));  // trois
