import DataBlock from "components/common/DataBlock"
import { RequirementComponentProps } from "requirements"
import Requirement from "requirements/common/Requirement"
import shortenHex from "utils/shortenHex"

const TesseraRequirement = ({
  requirement,
  ...rest
}: RequirementComponentProps): JSX.Element => (
  <Requirement image="/requirementLogos/tessera.svg" {...rest}>
    {(() => {
      switch (requirement.type) {
        case "TESSERA_HOLD":
          return (
            <>
              {`Hold ${
                requirement.data.minAmount > 0
                  ? `at least ${requirement.data.minAmount}`
                  : "a"
              } fraction of the `}
              <DataBlock>{shortenHex(requirement.data.vault, 3)}</DataBlock>
              {" NFT"}
            </>
          )
        case "TESSERA_VAULTSHARE":
          return (
            <>
              {`Hold ${
                requirement.data.minShare > 0
                  ? `at least ${requirement.data.minShare}%`
                  : "any percentage"
              } of the fractions of the `}
              <DataBlock>{shortenHex(requirement.data.vault, 3)}</DataBlock>
              {" NFT"}
            </>
          )
        case "TESSERA_LISTINGS":
          return "TODO"
        case "TESSERA_USER_SINCE":
          return `Be a Guild.xyz user at least since ${
            requirement.data.minDate?.split("T")[0]
          }`
      }
    })()}
  </Requirement>
)

export default TesseraRequirement
