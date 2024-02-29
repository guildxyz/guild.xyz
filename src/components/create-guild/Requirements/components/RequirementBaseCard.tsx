import Card from "components/common/Card"
import { PropsWithChildren } from "react"

const RequirementBaseCard = ({ children }: PropsWithChildren<unknown>) => (
  <Card
    px="6"
    py="4"
    pr="8"
    pos="relative"
    sx={{
      ":has([data-req-name-editor]) [data-req-image-editor]": {
        opacity: 1,
      },
    }}
  >
    {children}
  </Card>
)

export default RequirementBaseCard
