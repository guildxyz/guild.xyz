import fetcher from "utils/fetcher"
import { useSubmitWithSign } from "./useSubmit"

const useGateables = () =>
  useSubmitWithSign(({ data, validation }) =>
    fetcher("/guild/listGateables", {
      method: "POST",
      body: { payload: data, ...validation },
    }).then((body) => {
      if ("errorMsg" in body) {
        throw body
      }
      return body
    })
  )

export default useGateables
