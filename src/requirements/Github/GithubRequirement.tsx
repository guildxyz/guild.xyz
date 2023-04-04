import { Icon } from "@chakra-ui/react"
import ConnectRequirementPlatformButton from "components/[guild]/Requirements/components/ConnectRequirementPlatformButton"
import DataBlockWithDate from "components/[guild]/Requirements/components/DataBlockWithDate"
import RelativeDataBlockDate from "components/[guild]/Requirements/components/RelativeDataBlockDate"
import Requirement, {
  RequirementProps,
} from "components/[guild]/Requirements/components/Requirement"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"
import Link from "components/common/Link"
import { GithubLogo } from "phosphor-react"

const GithubRequirement = (props: RequirementProps) => {
  const requirement = useRequirementContext()

  return (
    <>
      {requirement.type === "GITHUB_STARRING" ? (
        <Requirement
          image={<Icon as={GithubLogo} boxSize={6} />}
          footer={<ConnectRequirementPlatformButton />}
          {...props}
        >
          Give a star to the{" "}
          <Link
            href={requirement.data.id ?? ""}
            isExternal
            colorScheme="blue"
            fontWeight="medium"
          >
            {requirement.data.id.match(/https:\/\/github\.com\/(.+)$/i)[1]}
          </Link>{" "}
          repository
        </Requirement>
      ) : requirement.type === "GITHUB_ACCOUNT_AGE" ? (
        <Requirement
          image={<Icon as={GithubLogo} boxSize={6} />}
          footer={<ConnectRequirementPlatformButton />}
          {...props}
        >
          {" Github account was created "}
          {requirement.data.maxAmount && requirement.data.minAmount ? (
            <>
              {" between "}
              <DataBlockWithDate timestamp={requirement.data.minAmount} />
              {" and "}
              <DataBlockWithDate timestamp={requirement.data.maxAmount} />
            </>
          ) : requirement.data.minAmount ? (
            <>
              {"after "}
              <DataBlockWithDate timestamp={requirement.data.minAmount} />
            </>
          ) : requirement.data.maxAmount ? (
            <>
              {"before "}
              <DataBlockWithDate timestamp={requirement.data.maxAmount} />
            </>
          ) : null}
        </Requirement>
      ) : requirement.type === "GITHUB_ACCOUNT_AGE_RELATIVE" ? (
        <Requirement
          image={<Icon as={GithubLogo} boxSize={6} />}
          footer={<ConnectRequirementPlatformButton />}
          {...props}
        >
          {" Github account was created "}
          {requirement.data.maxAmount && requirement.data.minAmount ? (
            <>
              {" between "}
              <RelativeDataBlockDate data={requirement.data.minAmount} />
              {" and "}
              <RelativeDataBlockDate data={requirement.data.maxAmount} />
            </>
          ) : requirement.data.minAmount ? (
            <>
              {"before "}
              <RelativeDataBlockDate data={requirement.data.minAmount} />
            </>
          ) : requirement.data.maxAmount ? (
            <>
              {"after "}
              <RelativeDataBlockDate data={requirement.data.maxAmount} />
            </>
          ) : null}
        </Requirement>
      ) : requirement.type === "GITHUB_COMMIT_COUNT" ? (
        <Requirement
          image={<Icon as={GithubLogo} boxSize={6} />}
          footer={<ConnectRequirementPlatformButton />}
          {...props}
        >
          {" Github account was created "}
          {requirement.data.maxAmount && requirement.data.minAmount ? (
            <>
              {" between "}
              <DataBlockWithDate timestamp={requirement.data.minAmount} />
              {" and "}
              <DataBlockWithDate timestamp={requirement.data.maxAmount} />
            </>
          ) : requirement.data.minAmount ? (
            <>
              {"before "}
              <RelativeDataBlockDate data={requirement.data.minAmount} />
            </>
          ) : requirement.data.maxAmount ? (
            <>
              {"after "}
              <DataBlockWithDate timestamp={requirement.data.maxAmount} />
            </>
          ) : null}
          {" and"} it has {requirement.data.id} commit
          {requirement.data.id > 1 ?? "s"}
        </Requirement>
      ) : requirement.type === "GITHUB_COMMIT_COUNT_RELATIVE" ? (
        <Requirement
          image={<Icon as={GithubLogo} boxSize={6} />}
          footer={<ConnectRequirementPlatformButton />}
          {...props}
        >
          {" Github account was created "}
          {requirement.data.maxAmount && requirement.data.minAmount ? (
            <>
              {" between "}
              <RelativeDataBlockDate data={requirement.data.minAmount} />
              {" and "}
              <RelativeDataBlockDate data={requirement.data.maxAmount} />
            </>
          ) : requirement.data.minAmount ? (
            <>
              {"before "}
              <RelativeDataBlockDate data={requirement.data.minAmount} />
            </>
          ) : requirement.data.maxAmount ? (
            <>
              {"after "}
              <RelativeDataBlockDate data={requirement.data.maxAmount} />
            </>
          ) : null}{" "}
          {" and"} it has {requirement.data.id} commit
          {requirement.data.id > 1 ?? "s"}
        </Requirement>
      ) : null}
    </>
  )
}

export default GithubRequirement
