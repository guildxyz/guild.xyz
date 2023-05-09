import { Circle, Img, useColorModeValue } from "@chakra-ui/react"

type Props = {
  name: string
  image: string
  guildId: string | number
}

const Credential = ({ name, image, guildId }: Props) => {
  const borderWidth = useColorModeValue(2, 0)
  const boxShadow = useColorModeValue(
    "none",
    "0 0 0.25rem 0.15rem var(--chakra-colors-gray-800)"
  )

  return (
    <Circle
      bgColor="#27272A"
      size={24}
      borderWidth={borderWidth}
      boxShadow={boxShadow}
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
    >
      <Img src={image} alt={name} />
    </Circle>
  )
}

export default Credential
