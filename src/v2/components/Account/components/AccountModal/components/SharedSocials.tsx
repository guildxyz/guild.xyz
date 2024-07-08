import { ArrowSquareOut, Shield, ShieldCheck } from "@phosphor-icons/react/dist/ssr"
import useGuild, { useSimpleGuild } from "components/[guild]/hooks/useGuild"
import useUser from "components/[guild]/hooks/useUser"
import GuildLogo from "components/common/GuildLogo"

import { Button, ButtonProps } from "@/components/ui/Button"
import {
  Dialog,
  DialogCloseButton,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/Dialog"
import { Skeleton } from "@/components/ui/Skeleton"
import { useEffect } from "react"
import pluralize from "utils/pluralize"
import useEditSharedSocials from "../../../../../../components/common/Layout/components/Account/components/AccountModal/hooks/useEditSharedSocials"

const SharedSocials = () => {
  const { id } = useGuild()
  const { sharedSocials } = useUser()

  const guildSharedSocial =
    id && sharedSocials?.find((sharedSocial) => sharedSocial.guildId === id)
  const restSharedSocials = !guildSharedSocial
    ? sharedSocials
    : sharedSocials?.filter((sharedSocial) => sharedSocial.guildId !== id)

  const buttonProps = {
    size: "sm",
    variant: "ghost",
    className: "ml-auto -my-1",
  } satisfies ButtonProps

  return (
    <Dialog>
      {/* TODO: scrollBehavior="inside" */}
      <DialogTrigger>
        {!guildSharedSocial ? (
          <Button {...buttonProps}>
            <Shield weight="bold" className="mr-1" />
            {`Shared with ${pluralize(
              sharedSocials?.filter(
                (sharedSocial) => sharedSocial.isShared !== false
              )?.length,
              "guild"
            )}`}
          </Button>
        ) : guildSharedSocial.isShared !== false ? (
          <Button {...buttonProps}>
            <ShieldCheck weight="bold" className="mr-1 text-primary" />
            Shared with guild
          </Button>
        ) : (
          <Button {...buttonProps}>
            <Shield weight="bold" className="mr-1" />
            Hidden to guild
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Shared account connections</DialogTitle>
        </DialogHeader>

        <p className="mb-10">
          Choose which guilds you'd like to share your profile with.{" "}
          <a
            href="https://help.guild.xyz/en/articles/8489031-privacy-for-members"
            className="font-semibold text-muted-foreground"
            target="_blank"
          >
            Learn more{" "}
            <ArrowSquareOut weight="bold" className="relative -top-px inline" />
          </a>
        </p>

        <div className="flex flex-col gap-4">
          {guildSharedSocial && (
            <>
              <ShareSocialsWithGuildSelect
                key={guildSharedSocial.guildId}
                guildId={guildSharedSocial.guildId}
                sharedSocials={sharedSocials}
              />
              <hr />
            </>
          )}
          {restSharedSocials.map((sharedSocial) => (
            <ShareSocialsWithGuildSelect
              key={sharedSocial.guildId}
              guildId={sharedSocial.guildId}
              sharedSocials={sharedSocials}
            />
          ))}
        </div>

        <DialogCloseButton />
      </DialogContent>
    </Dialog>
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
    <div className="flex items-center gap-4">
      {/* TODO: GuildLogo migration */}
      {imageUrl ? (
        <GuildLogo imageUrl={imageUrl} size="36px" />
      ) : (
        <Skeleton className="size-9 shrink-0 rounded-full" />
      )}

      {name?.length > 0 ? (
        <span className="overflow-hidden text-ellipsis text-lg font-bold">
          {name}
        </span>
      ) : (
        <Skeleton className="h-7 w-[80%]" />
      )}

      {/* <Menu placement="bottom-end" size={"sm"} strategy="fixed" autoSelect={false}>
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
      </Menu> */}
    </div>
  )
}

// const MenuItemOption = ({ title, description, icon, onClick, selected }) => (
//   <MenuItem onClick={!selected ? onClick : null} p="4">
//     <HStack spacing={4} w="full">
//       <Center boxSize="3">{selected && <Icon as={Check} />}</Center>
//       <Box w="full">
//         <Text fontWeight={"bold"}>{title}</Text>
//         <Text colorScheme="gray">{description}</Text>
//       </Box>
//       <Icon as={icon} />
//     </HStack>
//   </MenuItem>
// )

export default SharedSocials
