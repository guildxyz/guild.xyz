import { useDisclosure } from "@chakra-ui/react"
import Button from "components/common/Button"
import { GuildPlatform } from "types"
import ViewFullTextModal from "./ViewFullTextModal"

type Props = {
  platform: GuildPlatform
}

const TextCardButton = ({ platform }: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <Button onClick={onOpen}>View text</Button>

      <ViewFullTextModal isOpen={isOpen} onClose={onClose}>
        {platform.platformGuildData.text}
      </ViewFullTextModal>
    </>
  )
}

export default TextCardButton
