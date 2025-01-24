export const prettyDate = (date: Date | string) => {
  return (
    date &&
    new Intl.DateTimeFormat("en-US", {
      dateStyle: "short",
      timeStyle: "short",
    }).format(new Date(date))
  )
}
