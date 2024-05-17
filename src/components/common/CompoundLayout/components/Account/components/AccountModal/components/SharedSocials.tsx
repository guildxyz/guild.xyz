import {
  Box,
  Center,
  Divider,
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
  Skeleton,
  SkeletonCircle,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react"
import useGuild, { useSimpleGuild } from "components/[guild]/hooks/useGuild"
import useUser from "components/[guild]/hooks/useUser"
import Button from "components/common/Button"
import GuildLogo from "components/common/GuildLogo"
import { Modal } from "components/common/Modal"
import {
  ArrowSquareOut,
  CaretDown,
  Check,
  Shield,
  ShieldCheck,
} from "phosphor-react"
import { useEffect, useRef } from "react"
import pluralize from "utils/pluralize"
import useEditSharedSocials from "../hooks/useEditSharedSocials"

const SharedSocials = () => {
  const { id } = useGuild()
  const { sharedSocials } = useUser()
  const { isOpen, onOpen, onClose } = useDisclosure()

  const guildSharedSocial =
    id && sharedSocials?.find((sharedSocial) => sharedSocial.guildId === id)
  const restSharedSocials = !guildSharedSocial
    ? sharedSocials
    : sharedSocials?.filter((sharedSocial) => sharedSocial.guildId !== id)

  const buttonProps = {
    size: "sm",
    variant: "ghost",
    ml: "auto",
    my: "-1 !important",
    onClick: onOpen,
    // so we can focus it from useNewSharedSocialsToast
    id: "sharedSocialsButton",
    _focus: {
      boxShadow: "var(--chakra-shadows-outline)",
    },
  }

  // so the button doesn't get the focus ring on close
  const dummyRef = useRef(null)

  return (
    <>
      <span ref={dummyRef} />
      {!guildSharedSocial ? (
        <Button {...buttonProps} leftIcon={<Shield />}>
          {`Shared with ${pluralize(
            sharedSocials?.filter((sharedSocial) => sharedSocial.isShared !== false)
              ?.length,
            "guild"
          )}`}
        </Button>
      ) : guildSharedSocial.isShared !== false ? (
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
        scrollBehavior="inside"
        finalFocusRef={dummyRef}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader pb="6" display={"flex"}>
            <Text>Shared account connections</Text>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text mb="10">
              Choose which guilds you'd like to share your profile with.{" "}
              <Link
                href="https://help.guild.xyz/en/articles/8489031-privacy-for-members"
                isExternal
                colorScheme="gray"
                fontWeight={"semibold"}
              >
                Learn more <Icon as={ArrowSquareOut} ml="1" />
              </Link>
            </Text>
            <Stack divider={<Divider />} spacing="4">
              {guildSharedSocial && (
                <ShareSocialsWithGuildSelect
                  key={guildSharedSocial.guildId}
                  guildId={guildSharedSocial.guildId}
                  sharedSocials={sharedSocials}
                />
              )}
              {restSharedSocials.map((sharedSocial) => (
                <ShareSocialsWithGuildSelect
                  key={sharedSocial.guildId}
                  guildId={sharedSocial.guildId}
                  sharedSocials={sharedSocials}
                />
              ))}
            </Stack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

/**
 * Passing sharedSocials as prop instead of just isShared, because it doesn't change
 * on edit success that way for some reason, regardless of the mutate
 */
const ShareSocialsWithGuildSelect = ({ guildId, sharedSocials }) => {
  const { imageUrl, name } = useSimpleGuild(guildId)
  const { onSubmit, isLoading, submit } = useEditSharedSocials(guildId)

  const isShared = sharedSocials?.find(
    (sharedSocial) => sharedSocial.guildId === guildId
  ).isShared

  /**
   * Change null to true on mount (without toast), indicating that the user has seen
   * the notification, and the useNewSharedSocialsToast won't fire again
   */
  useEffect(() => {
    if (isShared === null) submit(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const isSharedBoolean = isShared !== false

  return (
    <HStack gap={4}>
      <SkeletonCircle isLoaded={!!imageUrl} size="36px">
        <GuildLogo imageUrl={imageUrl} size="36px" />
      </SkeletonCircle>
      <Skeleton w="full" h="7" isLoaded={!!name?.length}>
        <Text as="span" fontSize="lg" fontWeight="bold" noOfLines={1}>
          {name}
        </Text>
      </Skeleton>
      <Menu placement="bottom-end" size={"sm"} strategy="fixed" autoSelect={false}>
        <MenuButton
          as={Button}
          leftIcon={isSharedBoolean ? <ShieldCheck /> : <Shield />}
          color={
            isSharedBoolean ? "green.500" : "var(--chakra-colors-chakra-body-text)"
          }
          variant="ghost"
          size="sm"
          rightIcon={<CaretDown />}
          isLoading={isLoading}
          flexShrink="0"
        >
          {isSharedBoolean ? "Shared" : "Hidden"}
        </MenuButton>
        <MenuList
          py="0"
          overflow={"hidden"}
          borderRadius={"lg"}
          w="370px"
          maxW="100vw"
        >
          <MenuItemOption
            title="Shared"
            description="The guild owner can see your profile"
            icon={ShieldCheck}
            onClick={() => onSubmit(true)}
            selected={isSharedBoolean}
          />
          <Divider />
          <MenuItemOption
            title="Hidden"
            description="Your profile is kept private"
            icon={Shield}
            onClick={() => onSubmit(false)}
            selected={!isSharedBoolean}
          />
        </MenuList>
      </Menu>
    </HStack>
  )
}

const MenuItemOption = ({ title, description, icon, onClick, selected }) => (
  <MenuItem onClick={!selected ? onClick : null} p="4">
    <HStack spacing={4} w="full">
      <Center boxSize="3">{selected && <Icon as={Check} />}</Center>
      <Box w="full">
        <Text fontWeight={"bold"}>{title}</Text>
        <Text colorScheme="gray">{description}</Text>
      </Box>
      <Icon as={icon} />
    </HStack>
  </MenuItem>
)

export default SharedSocials
