import { Circle, Img, useColorModeValue } from "@chakra-ui/react"
import { useWeb3ConnectionManager } from "components/_app/Web3ConnectionManager"
import Link from "components/common/Link"

type Props = {
  name: string
  image: string
  guild: string
}

const GuildPin = ({ name, image, guild }: Props) => {
  const borderColor = useColorModeValue("white", "gray.700")

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
      <Circle bgColor="#27272A" size={20} borderWidth={2} borderColor={borderColor}>
        <Img src={image} alt={name} />
      </Circle>
    </Link>
  )
}

export default GuildPin
