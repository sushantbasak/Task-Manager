// // Passed then accepted else if fail then rejected
const {
  calculateTip,
  celsiusToFahrenheit,
  fahrenheitToCelsius,
  add,
} = require('../src/maths');

test('Calculation of Tip', () => {
  const total = calculateTip(10, 0.3);

  // if (total !== 13) {
  //   throw new Error('There might be something wrong');
  // }

  expect(total).toBe(13);
});

// test('Celcius to Fahrenheit test case', () => {
//   const foo = celsiusToFahrenheit(0);

//   expect(foo).toBe(32);
// });

// test('Fahrenheit to Celcius test case', () => {
//   const foo = fahrenheitToCelsius(32);

//   expect(foo).toBe(0);
// });

// // By passing an argument we can stop test function untill done is invoked

// test('Async test demo', (done) => {
//   setTimeout(() => {
//     expect(2).toBe(2);
//     done();
//   }, 2000);
// });

// test('Aysnc Add function demo', (done) => {
//   add(2, 3).then((sum) => {
//     expect(sum).toBe(5);
//     done();
//   });
// });

// test('Should add two numbers', async () => {
//   const sum = await add(2, 3);

//   expect(sum).toBe(5);
// });
