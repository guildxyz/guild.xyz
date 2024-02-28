export const truncate = (input: string, length: number): string =>
  input.length > length ? `${input.substring(0, length)}...` : input
