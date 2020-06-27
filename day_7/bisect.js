let random = d3.randomNormal(20, 2);

let test = d3.range(10).map(random);

console.log(test);

//first argument is the array or accessor function, and the second argument is the value you want to find the nearest index for
//bisectLeft + right look to the left or right for a matching index value, especially for multiples, so always use left
console.log("bisectLeft", d3.bisectLeft(test, 20));
console.log('bisectRight', d3.bisectRight(test, 20));

