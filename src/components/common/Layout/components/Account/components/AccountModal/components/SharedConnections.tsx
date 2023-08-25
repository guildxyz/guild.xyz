import {
  Box,
  Center,
  HStack,
  Icon,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  VStack,
  useDisclosure,
} from "@chakra-ui/react"
import useGuild from "components/[guild]/hooks/useGuild"
import Button from "components/common/Button"
import GuildLogo from "components/common/GuildLogo"
import { Modal } from "components/common/Modal"
import {
  ArrowSquareOut,
  CaretDown,
  Check,
  EyeSlash,
  Shield,
  ShieldCheck,
} from "phosphor-react"

const SharedConnections = () => {
  const { name, imageUrl } = useGuild()
  const { isOpen, onOpen, onClose } = useDisclosure()

  const isShared = false

  const buttonProps = {
    size: "sm",
    variant: "ghost",
    ml: "auto",
    my: "-1 !important",
    onClick: onOpen,
  }

  return (
    <>
      {!name ? (
        <Button {...buttonProps} leftIcon={<Shield />}>
          Shared with x guilds
        </Button>
      ) : isShared ? (
        <Button {...buttonProps} leftIcon={<ShieldCheck />} color={"green.500"}>
          Shared with guild
        </Button>
      ) : (
        <Button {...buttonProps} leftIcon={<Shield />}>
          Hidden to guild
        </Button>
      )}
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        colorScheme="duotone"
        scrollBehavior="inside"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader pb="6" display={"flex"}>
            <Text>Shared account connections</Text>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text mb="8">
              Choose which CRM enabled guilds you share your connections with.{" "}
              <Link colorScheme="gray" fontWeight={"semibold"}>
                Learn more <Icon as={ArrowSquareOut} ml="1" />
              </Link>
            </Text>
            <Stack>
              <HStack gap={4}>
                <GuildLogo imageUrl={imageUrl} size="36px" />
                <VStack spacing={2} alignItems="start" w="full">
                  <HStack spacing={1}>
                    <Text
                      as="span"
                      fontSize="lg"
                      fontWeight="bold"
                      maxW="full"
                      noOfLines={1}
                    >
                      {name}
                    </Text>
                  </HStack>
                </VStack>
                <Menu placement="bottom-end" size={"sm"} strategy="fixed">
                  <MenuButton
                    as={Button}
                    leftIcon={<ShieldCheck />}
                    color="green.500"
                    variant="ghost"
                    size="sm"
                    rightIcon={<CaretDown />}
                    flexShrink="0"
                  >
                    Shared
                  </MenuButton>
                  <MenuList>
                    <MenuItem>
                      <HStack spacing={4} w="full">
                        <Center boxSize="3">
                          <Icon as={Check} />
                        </Center>
                        <Box w="290px">
                          <Text fontWeight={"bold"}>Shared</Text>
                          <Text colorScheme="gray">
                            The guild owner can see your account connections
                          </Text>
                        </Box>
                        <Icon as={ShieldCheck} />
                      </HStack>
                    </MenuItem>
                    <MenuItem>
                      <HStack spacing={4} w="full">
                        <Center boxSize="3"></Center>
                        <Box w="290px">
                          <Text fontWeight={"bold"}>Hidden</Text>
                          <Text colorScheme="gray">
                            Your connections are kept private
                          </Text>
                        </Box>
                        <Icon as={EyeSlash} />
                      </HStack>
                    </MenuItem>
                  </MenuList>
                </Menu>
              </HStack>
            </Stack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default SharedConnections
