import {
  Box,
  ButtonGroup,
  Divider,
  HStack,
  Spacer,
  Spinner,
  Text,
  useClipboard,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import Card from "components/common/Card"
import useBalancy from "components/create-guild/Requirements/hooks/useBalancy"
import useIsStuck from "hooks/useIsStuck"
import { Copy, DownloadSimple } from "phosphor-react"
import { useWatch } from "react-hook-form"
import pluralize from "utils/pluralize"

const BalancyBar = ({ ...rest }) => {
  const { ref, isStuck } = useIsStuck()
  const { holders, addresses, isLoading, inaccuracy, usedLogic } = useBalancy()

  const logic = useWatch({ name: "logic" })

  const { hasCopied, onCopy } = useClipboard(addresses ? addresses?.join("\n") : "")

  const exportAddresses = () => {
    const csvContent = "data:text/csv;charset=utf-8," + addresses?.join("\n")
    const encodedUri = encodeURI(csvContent)
    window.open(encodedUri, "_blank")
  }

  return (
    <Box ref={ref} position="sticky" top={0} zIndex="9">
      <Card
        p="6"
        isFullWidthOnMobile
        {...(isStuck && {
          boxShadow: "dark-lg",
          borderTopLeftRadius: "0px !important",
          borderTopRightRadius: "0px !important",
        })}
        transition="box-shadow .2s, borderRadius .2s"
      >
        <HStack w="full" {...rest}>
          <Text fontWeight="bold">
            {typeof holders === "number"
              ? `${
                  inaccuracy > 0
                    ? usedLogic === "OR"
                      ? "At least "
                      : "At most "
                    : ""
                }${
                  ["NAND", "NOR"].includes(logic)
                    ? pluralize(holders, "excluded address", "es")
                    : pluralize(holders, "eligible address", "es")
                }`
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
      </Card>
    </Box>
  )
}

export default BalancyBar
