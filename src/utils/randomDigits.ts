// const getRandomNumber = (digits = 4) =>
//   (Math.random() * (10 ** digits - 10 ** (digits - 1)) + 10 ** (digits - 1)).toFixed(
//     0
//   )

const getRandomDigit = () => +(Math.random() * 9).toFixed()

const getRandomDigits = (digits = 4) =>
  [...new Array(digits)].map(() => getRandomDigit().toString()).join("")

export { getRandomDigit, getRandomDigits }
