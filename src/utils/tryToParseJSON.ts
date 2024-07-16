const tryToParseJSON = (jsonString: any) => {
  try {
    return jsonString === "undefined" ? undefined : JSON.parse(jsonString ?? "")
  } catch (_e) {
    return undefined
  }
}

export default tryToParseJSON
