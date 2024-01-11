import useUser from "components/[guild]/hooks/useUser"
import useSWRImmutable from "swr/immutable"

const useConnectedDID = () => {
  const { id: userId } = useUser()
  const did = useSWRImmutable<string>(
    userId
      ? `${process.env.NEXT_PUBLIC_POLYGONID_API}/v1/users/${userId}/polygon-id`
      : null,
    null,
    {
      onErrorRetry: (err) => {
        if (err.status === 500) return
      },
    }
  )

  return did
}

export default useConnectedDID
