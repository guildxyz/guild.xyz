import { Img } from "@chakra-ui/react"
import Button from "components/common/Button"
import { ArrowSquareOut } from "phosphor-react"
import { PropsWithChildren } from "react"
import { Rest } from "types"

type Props = PropsWithChildren<Rest>

const RequirementButton = ({ children, ...rest }: Props) => (
  <Button
    variant={"link"}
    size="xs"
    fontWeight={"medium"}
    color="gray"
    iconSpacing={rest.isLoading ? 2 : 1}
    loadingText="Loading..."
    {...rest}
  >
    {children}
  </Button>
)

type LinkProps = Props & { imageUrl: string }

const RequirementLinkButton = ({ children, imageUrl, ...rest }: LinkProps) => (
  <RequirementButton
    as="a"
    target="_blank"
    rel="noopener"
    leftIcon={<Img src={imageUrl} alt="Link image" boxSize={3} mr="1" />}
    rightIcon={<ArrowSquareOut />}
    {...rest}
  >
    {children}
  </RequirementButton>
)

export { RequirementButton, RequirementLinkButton }
