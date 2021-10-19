import groupsJSON from "temporaryData/groups"

const DEBUG = false

const fetchGroups = () =>
  DEBUG && process.env.NODE_ENV !== "production"
    ? groupsJSON
    : fetch(`${process.env.NEXT_PUBLIC_API}/group`).then((response) =>
        response.ok ? response.json() : []
      )

export default fetchGroups
