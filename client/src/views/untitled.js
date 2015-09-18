/**
 * Given a single input string, write a function that produces all possible anagrams
 * of a string and outputs them as an array. At first, don't worry about
 * repeated strings.  What time complexity is your solution?
 *
 * Extra credit: Deduplicate your return array without using uniq().
 */

/**
  * example usage:
  * var anagrams = allAnagrams('abc');
  * console.log(anagrams); // [ 'abc', 'acb', 'bac', 'bca', 'cab', 'cba' ]
  */

var allAnagrams = function(string) {
  var arrayA = string.split('');
  var result = [];
  var tempArray = [];
  var isRepeat = false;
  // debugger;
  var constructRecurse = function(arrayA, tempArray) {
    if(tempArray.length === arrayA.length) {
      result.push(tempArray);
      // tempArray = [];
      return;
    }

    for (var i = 0 ; i < arrayA.length; i++) {
      for (var j = 0 ; j < tempArray.length; j++) {
        if(tempArray[j] === arrayA[i]) {
          isRepeat = true;
        }
      }
      console.log(arrayA[i])
      if(isRepeat) {
        tempArray.push(arrayA[i]);
      }
      console.log(tempArray);
      constructRecurse(arrayA, tempArray.slice());
      tempArray.pop(arrayA[i]);
      isRepeat = false;
    }
  }

  constructRecurse(arrayA, tempArray);
  return result;
  // Your code here.
};
