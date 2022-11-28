const convertPoapExpiryDate = (date: string) => {
  const splittedDate = typeof date === "string" ? date.trim().split("-") : undefined

  return typeof date === "string"
    ? parseInt(
        (
          new Date(
            /^[0-9]{2}-[0-9]{2}-[0-9]{4}$/.test(date.trim())
              ? `${splittedDate[2]}-${splittedDate[0]}-${splittedDate[1]}`
              : /^[0-9]{2}-[a-z]{3}-[0-9]{4}$/i.test(date.trim())
              ? `${splittedDate[0]}-${splittedDate[1]}${splittedDate[2]}`
              : date
          ).getTime() / 1000
        ).toString()
      )
    : undefined
}

export default convertPoapExpiryDate
