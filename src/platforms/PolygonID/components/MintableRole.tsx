import {
  Card,
  HStack,
  Heading,
  Skeleton,
  SkeletonCircle,
  Spacer,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react"
import useAccess from "components/[guild]/hooks/useAccess"
import useGuild from "components/[guild]/hooks/useGuild"
import useUser from "components/[guild]/hooks/useUser"
import Button from "components/common/Button"
import GuildLogo from "components/common/GuildLogo"
import useShowErrorToast from "hooks/useShowErrorToast"
import { SignedValdation, useSubmitWithSign } from "hooks/useSubmit"
import useToast from "hooks/useToast"
import { Role } from "types"
import fetcher from "utils/fetcher"
import useClaimedRoles from "../hooks/useClaimedRoles"
import PolygonIDQRCodeModal from "./PolygonIDQRCodeModal"

type Props = {
  role: Role
}

const join = (signedValidation: SignedValdation) =>
  fetcher(`/user/join`, signedValidation)

const MintableRole = ({ role }: Props) => {
  const toast = useToast()
  const showErrorToast = useShowErrorToast()

  const { isOpen, onOpen, onClose } = useDisclosure()
  const { id: userId } = useUser()
  const { hasAccess } = useAccess(role.id)
  const { id: guildId } = useGuild()
  const {
    data: claimedRoles,
    isValidating,
    mutate: mutateClaimedRoles,
  } = useClaimedRoles()

  const hasClaimed = claimedRoles
    ?.find((guild) => guild.guildId === guildId)
    ?.roleIds.find((roleId) => roleId === role.id)

  const claim = async (signedValidation: SignedValdation) =>
    fetcher(`${process.env.NEXT_PUBLIC_POLYGONID_API}/v1/polygon-id/claim`, {
      method: "POST",
      ...signedValidation,
    })

  const { isLoading: isClaimLoading, onSubmit: onClaimSubmit } = useSubmitWithSign(
    claim,
    {
      onSuccess: () => {
        toast({
          status: "success",
          title: "Successfully claimed proof",
        })
        onOpen()
        mutateClaimedRoles(
          (prevClaimedRoles) => {
            if (!prevClaimedRoles.find((crData) => crData.guildId === guildId)) {
              return [
                ...prevClaimedRoles,
                {
                  guildId,
                  roleIds: [role.id],
                },
              ]
            }

            return prevClaimedRoles.map((crData) => {
              if (crData.guildId !== guildId) return crData
              return {
                guildId,
                roleIds: [...crData.roleIds, role.id],
              }
            })
          },
          {
            revalidate: false,
          }
        )
      },
      onError: () => showErrorToast("Couldn't claim proof"),
    }
  )

  const { isLoading: isJoinLoading, onSubmit: onJoinAndClaim } = useSubmitWithSign(
    join,
    {
      onSuccess: () =>
        onClaimSubmit({
          userId: userId,
          data: {
            guildId: guildId,
            roleId: role.id,
          },
        }),
      onError: (err) =>
        showErrorToast({
          error: "Couldn't check eligibility",
          correlationId: err.correlationId,
        }),
    }
  )

  const isLoading = isJoinLoading || isClaimLoading

  return (
    <Card p={4} mb="3" borderRadius="2xl">
      <HStack spacing={4}>
        <GuildLogo imageUrl={role.imageUrl} size={12} />
        <Heading
          as="h3"
          fontSize="lg"
          fontFamily="display"
          wordBreak="break-all"
          noOfLines={1}
        >
          {role.name}
        </Heading>
        <Spacer />
        <Tooltip
          label="You don't satisfy the requirements to this role"
          isDisabled={hasAccess}
          placement="top"
          hasArrow
        >
          <Button
            colorScheme={"purple"}
            h={10}
            isLoading={isValidating || isLoading}
            isDisabled={!hasAccess}
            onClick={() => {
              if (hasClaimed) {
                onOpen()
                return
              }

              onJoinAndClaim({ guildId })
            }}
          >
            {hasClaimed ? "Show QR code" : "Mint proof"}
          </Button>
        </Tooltip>
      </HStack>

      <PolygonIDQRCodeModal isOpen={isOpen} onClose={onClose} role={role} />
    </Card>
  )
}

const MintableRoleSkeleton = () => (
  <Card p={4} mb="3" borderRadius="2xl">
    <HStack spacing={4}>
      <SkeletonCircle boxSize={12} />
      <Skeleton h={6} w="50%" />
      <Spacer />
      <Skeleton h={10} w={24} borderRadius="xl" />
    </HStack>
  </Card>
)

export default MintableRole
export { MintableRoleSkeleton }
