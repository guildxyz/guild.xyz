const parseFromObject = (
  obj: Record<string, unknown>,
  path: string
): unknown => {
  if (!path) return obj
  return path
    .split(".")
    .filter((p) => !!p)
    .reduce(
      (accObj: Record<string, unknown>, currKey) =>
        (accObj as Record<string, unknown>)?.[currKey] as Record<
          string,
          unknown
        >,
      obj
    )
}

export default parseFromObject
