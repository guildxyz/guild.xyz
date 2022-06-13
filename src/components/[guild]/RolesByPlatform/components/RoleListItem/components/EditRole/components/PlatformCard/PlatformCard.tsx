import { Box, CloseButton, HStack, Text } from "@chakra-ui/react"
import ColorCard from "components/common/ColorCard"
import ColorCardLabel from "components/common/ColorCard/ColorCardLabel"
import Image from "next/image"
import { PropsWithChildren } from "react"
import { PlatformName, Rest } from "types"
import { useRolePlatrform } from "../RolePlatformProvider"
import EditButton from "./components/EditButton"

const platformBackgroundColor: Partial<Record<PlatformName, string>> = {
  DISCORD: "var(--chakra-colors-DISCORD-500)",
  TELEGRAM: "var(--chakra-colors-TELEGRAM-500)",
}

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
  const { type } = useRolePlatrform()

  return (
    <ColorCard
      color={platformBackgroundColor[type]}
      pt={{ base: 9, sm: 11 }}
      {...rest}
    >
      <CloseButton
        position="absolute"
        top={2}
        right={2}
        width={8}
        height={8}
        rounded="full"
        aria-label="Remove requirement"
        zIndex="1"
        onClick={onRemove}
      />

      <HStack justifyContent={"space-between"}>
        <HStack spacing={3}>
          <Box
            overflow={"hidden"}
            borderRadius="full"
            width={10}
            height={10}
            position="relative"
          >
            <Image src={imageUrl} alt={name} layout="fill" />
          </Box>
          <Text fontWeight={"bold"}>{name}</Text>
        </HStack>
        <HStack>
          {children}
          {EditModal && <EditButton EditModal={EditModal} />}
        </HStack>
      </HStack>

      <ColorCardLabel
        fallbackColor="white"
        type={type}
        typeBackgroundColors={platformBackgroundColor}
        top="-px"
        left="-px"
        borderBottomRightRadius="xl"
        borderTopLeftRadius="xl"
      />
    </ColorCard>
  )
}

export default PlatformCard
