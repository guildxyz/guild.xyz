import { ProvidedValueHook } from "requirements"

const useTokenProvidedValue: ProvidedValueHook = () => {
  return {
    type: "Token",
    info: "Number of tokens held",
    image: "",
  }
}

export default useTokenProvidedValue
