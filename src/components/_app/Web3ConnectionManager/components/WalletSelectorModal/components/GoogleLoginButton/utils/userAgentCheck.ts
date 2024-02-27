const checkUserAgentIncludes = (str: string) => {
  try {
    return navigator.userAgent.toLowerCase().includes(str)
  } catch {
    return false
  }
}

const checkUserAgentData = (checker: (brand: string) => boolean) => {
  try {
    return (navigator as any).userAgentData.brands
      .map(({ brand }) => brand.toLowerCase())
      .some(checker)
  } catch {
    return false
  }
}

export { checkUserAgentData, checkUserAgentIncludes }
