import {
  ButtonGroup,
  Divider,
  HStack,
  Spacer,
  Spinner,
  Text,
  useClipboard,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import StickyBar from "components/common/Layout/StickyBar"
import useBalancy from "components/create-guild/Requirements/hooks/useBalancy"
import { Copy, DownloadSimple } from "phosphor-react"
import { useEffect } from "react"
import pluralize from "utils/pluralize"

const BalancyBar = () => {
  const { holders, addresses, isLoading, inaccuracy, usedLogic } = useBalancy()

  const { hasCopied, onCopy, setValue } = useClipboard("")

  useEffect(() => {
    if (!addresses) return
    setValue(addresses.join("\n"))
  }, [addresses])

  const exportAddresses = () => {
    const csvContent = "data:text/csv;charset=utf-8," + addresses?.join("\n")
    const encodedUri = encodeURI(csvContent)
    window.open(encodedUri, "_blank")
  }

  return (
    <StickyBar>
      <HStack w="full">
        <Text fontWeight="bold">
          {typeof holders === "number"
            ? `${
                inaccuracy > 0 ? (usedLogic === "OR" ? "At least " : "At most ") : ""
              }${pluralize(holders, "eligible address", "es")}`
            : "Add requirements below to calculate eligible addresses"}
        </Text>
        {isLoading && <Spinner size="sm" color="gray" mx={2} />}
        <Spacer />
        <ButtonGroup
          flexShrink="0"
          colorScheme="green"
          isDisabled={!addresses?.length}
          display={{
            base: typeof holders !== "number" ? "none" : "inline-flex",
            md: "inline-flex",
          }}
          isAttached
        >
          <Button onClick={onCopy} leftIcon={<Copy />}>
            {hasCopied ? "Copied!" : "Copy"}
          </Button>
          <Divider orientation="vertical" />
          <Button onClick={exportAddresses} leftIcon={<DownloadSimple />}>
            Export
          </Button>
        </ButtonGroup>
      </HStack>
    </StickyBar>
  )
}

export default BalancyBar
