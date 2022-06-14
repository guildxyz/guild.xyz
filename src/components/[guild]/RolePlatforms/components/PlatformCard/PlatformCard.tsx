import {
  Box,
  Divider,
  Flex,
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
import { PlatformName, Rest } from "types"
import { useRolePlatrform } from "../RolePlatformProvider"
import EditButton from "./components/EditButton"

const platformBackgroundColor: Partial<Record<PlatformName, string>> = {
  DISCORD: "var(--chakra-colors-DISCORD-500)",
  TELEGRAM: "var(--chakra-colors-TELEGRAM-500)",
}

const platformTypeLabel = Object.fromEntries(
  Object.entries(platforms).map(([key, { label }]) => [key, label])
)

type Props = {
  imageUrl: string
  name: string
  EditModal?: (props: { isOpen: boolean; onClose: () => void }) => JSX.Element
  onRemove: () => void
} & Rest

const PlatformCard = ({
  imageUrl,
  name,
  children,
  EditModal,
  onRemove,
  ...rest
}: PropsWithChildren<Props>) => {
  const { type, nativePlatformId } = useRolePlatrform()

  const serverData = useServerData(
    (type === "DISCORD" && nativePlatformId) || undefined
  )

  const label =
    (serverData?.data?.serverName?.length > 0 && serverData.data.serverName) || name

  const displayDivider = useBreakpointValue({ base: true, md: false })

  return (
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
            {(serverData?.data?.serverIcon?.length > 0 || imageUrl?.length > 0) && (
              <Image
                src={
                  (serverData?.data?.serverIcon?.length > 0 &&
                    serverData.data.serverIcon) ||
                  imageUrl
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
          {children}
          {EditModal && (
            <EditButton
              ml={{ base: 0, md: 3 }}
              mt={{ base: 3, md: 0 }}
              EditModal={EditModal}
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
  )
}

export default PlatformCard
