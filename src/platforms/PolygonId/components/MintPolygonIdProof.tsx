import useUser from "components/[guild]/hooks/useUser"
import useSWRImmutable from "swr/immutable"
import MintPolygonID from "./MintPolygonIdProofModal"
import NoDID from "./NoDID"

type Props = {
  isOpen: boolean
  onClose: () => void
}

const MintPolygonIdProof = ({ isOpen, onClose }: Props) => {
  const { id: userId } = useUser()
  const { isLoading, error } = useSWRImmutable<string>(
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

  if (isLoading) return null

  if (error) return <NoDID isOpen={isOpen} onClose={onClose} />

  return <MintPolygonID isOpen={isOpen} onClose={onClose} />
}

export { MintPolygonIdProof }
