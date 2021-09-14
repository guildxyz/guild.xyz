import { Icon } from "@chakra-ui/react"
import Loading from "static/icons/loading.svg"

const Spinner = () => (
  <Icon
    sx={{
      animation: "rotate 1.5s linear infinite",
      "@keyframes rotate": {
        to: { transform: "rotate(360deg)" },
      },
    }}
    as={Loading}
  />
)

export default Spinner
