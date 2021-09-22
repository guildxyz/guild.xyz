import Icon from "@chakra-ui/icon"
import { useWeb3React } from "@web3-react/core"
import ColorButton from "components/common/ColorButton"
import { TrashSimple } from "phosphor-react"
import { useMemo } from "react"
import { useGuild } from "../Context"

type Props = {
  isLoading?: boolean
  onClick: () => void
}

const DeleteButton = ({ isLoading = false, onClick }: Props): JSX.Element => {
  const { account } = useWeb3React()
  const { owner } = useGuild()

  const isOwner = useMemo(
    () =>
      owner?.addresses
        ?.map((user) => user.address)
        ?.includes(account?.toLowerCase()),
    [account, owner]
  )

  return (
    isOwner && (
      <ColorButton
        color="red.500"
        rounded="2xl"
        isLoading={isLoading}
        onClick={onClick}
      >
        <Icon as={TrashSimple} />
      </ColorButton>
    )
  )
}

export default DeleteButton
