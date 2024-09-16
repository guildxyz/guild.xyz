const pluralize = (
  count: number,
  noun: string,
  includeNumber = true,
  suffix = "s"
) => `${includeNumber ? (count ?? 0) : ""} ${noun}${count !== 1 ? suffix : ""}`

export default pluralize
