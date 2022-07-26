import useShowErrorToast from "hooks/useShowErrorToast"
import { useSubmitWithSign, WithValidation } from "hooks/useSubmit"
import { GoogleFile, PlatformName } from "types"
import fetcher from "utils/fetcher"

type Data = { platformName: PlatformName }
type Response = GoogleFile[]

const useGoogleGateables = () => {
  const showErrorToast = useShowErrorToast()

  const fetchGateables = ({
    data,
    validation,
  }: WithValidation<Data>): Promise<Response> =>
    fetcher("/guild/listGateables", {
      body: data,
      validation,
    })

  return useSubmitWithSign<Data, Response>(fetchGateables, {
    onError: (error) => showErrorToast(error),
  })
}

export default useGoogleGateables
