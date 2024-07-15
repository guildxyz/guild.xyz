import { HStack, Icon, Text, Tooltip, useClipboard } from "@chakra-ui/react"
import { PropsWithChildren } from "react"
import { PiCheck } from "react-icons/pi"
import DataBlock from "./DataBlock"

type Props = {
  text: string
}

const DataBlockWithCopy = ({
  text,
  children,
}: PropsWithChildren<Props>): JSX.Element => {
  const { onCopy, hasCopied } = useClipboard(text)

  return (
    <Tooltip
      hasArrow
      closeOnClick={false}
      label={
        <HStack spacing={0.5}>
          {hasCopied && <Icon as={PiCheck} />}
          <Text as="span">{hasCopied ? "Copied" : "Click to copy"}</Text>
        </HStack>
      }
      placement="top"
      shouldWrapChildren
    >
      <DataBlock>
        <Text as="span" cursor="pointer" onClick={onCopy}>
          {children ?? text}
        </Text>
      </DataBlock>
    </Tooltip>
  )
}

export default DataBlockWithCopy
