import { Card, Circle, Img, Tag, useColorModeValue } from "@chakra-ui/react"
import Link from "components/common/Link"
import { useWeb3ConnectionManager } from "components/_app/Web3ConnectionManager"

type Props = {
  name: string
  image: string
  guild: string
  rank: string
}

const GuildPin = ({ name, image, guild, rank }: Props) => {
  const borderColor = useColorModeValue("white", "gray.700")
  const tagBgColor = useColorModeValue("gray.100", "whiteAlpha.300")

  const { closeAccountModal } = useWeb3ConnectionManager()

  return (
    <Link
      href={`/${guild}`}
      ml={-10}
      _first={{ ml: 0 }}
      className="pin"
      transition="transform 0.2s ease"
      _hover={{
        transform: "scale(1.05)",
        "~ .pin": {
          transform: "translateX(2rem)",
        },
      }}
      onClick={closeAccountModal}
    >
      <Circle
        position="relative"
        bgColor="#27272A"
        size={20}
        borderWidth={2}
        borderColor={borderColor}
      >
        <Img src={image} alt={name} />
        <Card position="absolute" bottom={-1} boxShadow="none">
          <Tag
            bgColor={tagBgColor}
            minH={5}
            fontSize="x-small"
            fontWeight="semibold"
            borderWidth={2}
            borderColor={borderColor}
          >
            #{rank}
          </Tag>
        </Card>
      </Circle>
    </Link>
  )
}

export default GuildPin
