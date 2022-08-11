const joinWithUniqueLastSeparator = (
  array: string[],
  separator = ", ",
  lastSeparator = " and "
) =>
  array.reduce(
    (acc, item, i, arr) =>
      `${acc}${item}${
        i === arr.length - 1 ? "" : i === arr.length - 2 ? lastSeparator : separator
      }`,
    ""
  )

export default joinWithUniqueLastSeparator
