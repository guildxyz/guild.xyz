import {
  Card,
  HStack,
  Heading,
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
  const { data: claimedRoles, isValidating } = useClaimedRoles()

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
      },
      onError: () => showErrorToast("Couldn't claim proof"),
    }
  )

  const { isLoading: isJoinLoading, onSubmit } = useSubmitWithSign(join, {
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
  })

  const isLoading = isJoinLoading || isClaimLoading

  return (
    <Card p={4} mb="3" borderRadius={"2xl"}>
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
              onOpen()
              if (!hasClaimed) onSubmit({ guildId })
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

export default MintableRole
