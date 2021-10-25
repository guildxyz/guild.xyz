import hallsJSON from "temporaryData/halls"

const DEBUG = false

const fetchHalls = () =>
  DEBUG && process.env.NODE_ENV !== "production"
    ? hallsJSON
    : fetch(`${process.env.NEXT_PUBLIC_API}/group`).then((response) =>
        response.ok ? response.json() : []
      )

export default fetchHalls
