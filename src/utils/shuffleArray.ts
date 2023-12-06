export const shuffleArray = (array: any[]) =>
  [...array].sort(() => 0.5 - Math.random())
