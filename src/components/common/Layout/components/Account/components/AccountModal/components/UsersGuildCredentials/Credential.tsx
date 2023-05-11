import { Circle, Img, useColorModeValue } from "@chakra-ui/react"
import Link from "components/common/Link"
import { useWeb3ConnectionManager } from "components/_app/Web3ConnectionManager"

type Props = {
  name: string
  image: string
  guild: string
}

const Credential = ({ name, image, guild }: Props) => {
  const borderWidth = useColorModeValue(2, 0)
  const boxShadow = useColorModeValue(
    "none",
    "0 0 0.25rem 0.15rem var(--chakra-colors-blackAlpha-300)"
  )

  const { closeAccountModal } = useWeb3ConnectionManager()

  return (
    <Link
      href={`/${guild}`}
      ml={-12}
      _first={{ ml: 0 }}
      className="credential"
      transition="transform 0.2s ease"
      _hover={{
        transform: "translate(0,-0.5rem) scale(1.05)",
        "~ .credential": {
          transform: "translateX(2rem)",
        },
      }}
      onClick={closeAccountModal}
    >
      <Circle
        bgColor="#27272A"
        size={24}
        borderWidth={borderWidth}
        boxShadow={boxShadow}
      >
        <Img src={image} alt={name} />
      </Circle>
    </Link>
  )
}

export default Credential
