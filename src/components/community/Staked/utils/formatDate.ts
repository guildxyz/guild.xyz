const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
]

const formatDate = (date: Date): string =>
  `${
    months[date.getMonth()]
  } ${date.getDate()} ${date.getHours()}:${date.getMinutes()}`

export default formatDate
