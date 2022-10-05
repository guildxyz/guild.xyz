const convertPoapExpiryDate = (date: string) =>
  typeof date === "string"
    ? parseInt(
        (
          new Date(
            /^[0-9]{2}-[0-9]{2}-[0-9]{4}$/.test(date.trim())
              ? `${date.split("-")[2]}-${date.split("-")[0]}-${date.split("-")[1]}`
              : date
          ).getTime() / 1000
        ).toString()
      )
    : undefined

export default convertPoapExpiryDate
