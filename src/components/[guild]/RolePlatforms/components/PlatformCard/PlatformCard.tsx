import {
  Box,
  Divider,
  Flex,
  GridItem,
  HStack,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react"
import ColorCard from "components/common/ColorCard"
import ColorCardLabel from "components/common/ColorCard/ColorCardLabel"
import { platforms } from "components/create-guild/PlatformsGrid/PlatformsGrid"
import useServerData from "hooks/useServerData"
import Image from "next/image"
import { PropsWithChildren } from "react"
import { PlatformName, Rest, Role } from "types"
import { useRolePlatrform } from "../RolePlatformProvider"
import DiscordCardComponents from "./components/DiscordCardComponents"
import EditButton from "./components/EditButton"

const platformBackgroundColor: Partial<Record<PlatformName, string>> = {
  DISCORD: "var(--chakra-colors-DISCORD-500)",
  TELEGRAM: "var(--chakra-colors-TELEGRAM-500)",
}

const platformTypeLabel = Object.fromEntries(
  Object.entries(platforms).map(([key, { label }]) => [key, label])
)

type Props = {
  onRemove: () => void
  role?: Role
} & Rest

const platformSpecificCardComponents = {
  DISCORD: DiscordCardComponents,
}

const PlatformCard = ({ role, onRemove, ...rest }: PropsWithChildren<Props>) => {
  const { type, nativePlatformId, platformId } = useRolePlatrform()

  const serverData = useServerData(
    (type === "DISCORD" && nativePlatformId) || undefined
  )

  const label =
    (serverData?.data?.serverName?.length > 0 && serverData.data.serverName) ||
    role?.name

  const displayDivider = useBreakpointValue({ base: true, md: false })

  const isNew =
    role === undefined || // From add role drawer
    role?.platforms.every((rp) => rp.platformId !== platformId)
  const EditComponent = platformSpecificCardComponents[type]

  const cols = useBreakpointValue({ base: 1, md: 2 })

  return (
    <GridItem
      colSpan={
        +(
          ((!isNew && !!EditComponent?.EditModal) ||
            (!!isNew && !!EditComponent?.NewPlatform?.EditModal)) &&
          cols > 1
        ) + 1
      }
    >
      <ColorCard
        color={platformBackgroundColor[type]}
        pt={{ base: 10, sm: 11 }}
        {...rest}
      >
        {/*<CloseButton
        position="absolute"
        top={2}
        right={2}
        width={8}
        height={8}
        rounded="full"
        aria-label="Remove requirement"
        zIndex="1"
        onClick={onRemove}
      />*/}

        <Flex
          justifyContent={"space-between"}
          flexDirection={{ base: "column", md: "row" }}
        >
          <HStack spacing={3}>
            <Box
              overflow={"hidden"}
              borderRadius="full"
              width={10}
              height={10}
              position="relative"
            >
              {(serverData?.data?.serverIcon?.length > 0 ||
                role?.imageUrl?.length > 0) && (
                <Image
                  src={
                    (serverData?.data?.serverIcon?.length > 0 &&
                      serverData.data.serverIcon) ||
                    role?.imageUrl
                  }
                  alt={label}
                  layout="fill"
                />
              )}
            </Box>
            <Text fontWeight={"bold"}>{label}</Text>
          </HStack>

          {displayDivider && <Divider my={3} />}

          <Flex
            flexDirection={{ base: "column", md: "row" }}
            alignItems={{ base: "stretch", md: "center" }}
          >
            {((isNew && !!EditComponent?.NewPlatform?.Label) ||
              (!isNew && !!EditComponent?.Label)) &&
              ((isNew && <EditComponent.NewPlatform.Label />) || (
                <EditComponent.Label />
              ))}

            {((isNew && !!EditComponent?.NewPlatform?.EditModal) ||
              (!isNew && !!EditComponent?.EditModal)) && (
              <EditButton
                ml={{ base: 0, md: 3 }}
                mt={{ base: 3, md: 0 }}
                Modal={
                  (isNew && EditComponent.NewPlatform.EditModal) ||
                  EditComponent.EditModal
                }
              />
            )}
          </Flex>
        </Flex>

        <ColorCardLabel
          fallbackColor="white"
          type={type}
          typeBackgroundColors={platformBackgroundColor}
          typeLabel={platformTypeLabel}
          top="-px"
          left="-px"
          borderBottomRightRadius="xl"
          borderTopLeftRadius="xl"
        />
      </ColorCard>
    </GridItem>
  )
}

export default PlatformCard
