const tryToParseJSON = (jsonString: any) => {
  try {
    return jsonString === "undefined" ? undefined : JSON.parse(jsonString ?? "")
  } catch (e) {
    return undefined
  }
}

export default tryToParseJSON
