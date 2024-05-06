const getNumOfDecimals = (value: string | number): number => {
  return value?.toString().split(".")[1]?.length || 0
}
export default getNumOfDecimals
