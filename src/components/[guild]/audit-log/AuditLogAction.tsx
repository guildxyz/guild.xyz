import {
  Box,
  Collapse,
  HStack,
  Icon,
  IconButton,
  Stack,
  Tag,
  TagLabel,
  TagLeftIcon,
  Text,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react"
import Card from "components/common/Card"
import GuildAvatar from "components/common/GuildAvatar"
import { CaretDown, UserSwitch } from "phosphor-react"
import shortenHex from "utils/shortenHex"

const AuditLogAction = (): JSX.Element => {
  const collapseBgColor = useColorModeValue("gray.50", "blackAlpha.400")
  const { isOpen, onToggle } = useDisclosure()

  return (
    <Card>
      <HStack justifyContent="space-between" px={{ base: 5, sm: 6 }} py={7}>
        <HStack alignItems="center" spacing={4}>
          <Icon
            as={UserSwitch}
            boxSize={8}
            color="blue.500"
            sx={{
              "> *": {
                strokeWidth: "1rem",
              },
            }}
          />
          <Stack spacing={0.5}>
            <HStack>
              <Text as="span" fontWeight="semibold">
                Audit log action:
              </Text>

              <Tag variant="solid" colorScheme="gray">
                <TagLeftIcon
                  mr={0.5}
                  as={GuildAvatar}
                  address="0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
                  size={3}
                />
                <TagLabel>
                  {shortenHex("0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48")}
                </TagLabel>
              </Tag>
            </HStack>
            <Text as="span" colorScheme="gray">
              22:00
            </Text>
          </Stack>
        </HStack>
        <IconButton
          aria-label="Show details"
          icon={
            <Icon
              as={CaretDown}
              onClick={onToggle}
              transform={isOpen && "rotate(-180deg)"}
              transition="transform .3s"
            />
          }
          variant="ghost"
          minW={8}
          minH={8}
          boxSize={8}
          borderRadius="full"
        />
      </HStack>

      <Collapse in={isOpen}>
        <Box pr={6} pl="4.5rem" py={4} bgColor={collapseBgColor}>
          Wew, such empty.
        </Box>
      </Collapse>
    </Card>
  )
}

export default AuditLogAction
