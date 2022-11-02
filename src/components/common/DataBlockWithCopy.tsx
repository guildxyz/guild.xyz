import { HStack, Icon, Text, Tooltip, useClipboard } from "@chakra-ui/react"
import { Check } from "phosphor-react"
import DataBlock from "./DataBlock"

type Props = {
  text: string
}

const DataBlockWithCopy = ({ text }: Props): JSX.Element => {
  const { onCopy, hasCopied } = useClipboard(text)

  return (
    <Tooltip
      hasArrow
      closeOnClick={false}
      label={
        <HStack spacing={0.5}>
          {hasCopied && <Icon as={Check} />}
          <Text as="span">{hasCopied ? "Copied" : "Click to copy"}</Text>
        </HStack>
      }
      shouldWrapChildren
    >
      <DataBlock>
        <Text as="span" cursor="pointer" onClick={onCopy}>
          {text}
        </Text>
      </DataBlock>
    </Tooltip>
  )
}

export default DataBlockWithCopy
