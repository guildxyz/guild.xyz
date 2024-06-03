import {
  Icon,
  IconButton,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  Tooltip,
} from "@chakra-ui/react"
import useGuild from "components/[guild]/hooks/useGuild"
import Button from "components/common/Button"
import { Modal } from "components/common/Modal"
import { SectionTitle } from "components/common/Section"
import useSWRWithOptionalAuth from "hooks/useSWRWithOptionalAuth"
import { SignedValidation, useSubmitWithSign } from "hooks/useSubmit"
import useToast from "hooks/useToast"
import { useRouter } from "next/router"
import { ArrowsClockwise, Export, Info } from "phosphor-react"
import fetcher from "utils/fetcher"
import ExportCard from "./ExportCard"

export const crmOrderByParams = { joinedAt: "Join date", roles: "Number of roles" }
type CRMOrderByParams = keyof typeof crmOrderByParams

export type ExportData = {
  id: number
  bucketName: string
  filename: string
  status: "FINISHED" | "CREATED"
  data: {
    count: number
    params: {
      search: string
      roleIds: number[]
      logic: "AND" | "OR"
      order: CRMOrderByParams
      sortOrder: "desc" | "asc"
    }
  }
  createdAt: string
  updatedAt: string
}

type ExportsEndpoint = {
  exports: ExportData[]
}

const useExportMembers = (onSuccess) => {
  const { id } = useGuild()
  const toast = useToast()
  const router = useRouter()

  const { onSubmit, isLoading, ...rest } = useSubmitWithSign(
    (signedValidation: SignedValidation) =>
      fetcher(`/v2/crm/guilds/${id}/exports`, {
        method: "POST",
        ...signedValidation,
      }),
    {
      onSuccess: (res) => {
        toast({
          status: "success",
          title: "Export started",
          description:
            "It might take some time to finish based on the number of members",
        })
        onSuccess?.()
      },
      onError: (err) => {
        toast({
          status: "error",
          title: "Couldn't start export",
        })
      },
    }
  )

  return {
    startExport: () => onSubmit(router.query),
    isStartExportLoading: isLoading,
    ...rest,
  }
}

const ExportMembersModal = ({ isOpen, onClose }) => {
  const { id } = useGuild()

  const { data, isLoading, isValidating, mutate } =
    useSWRWithOptionalAuth<ExportsEndpoint>(
      `/v2/crm/guilds/${id}/exports`,
      { keepPreviousData: true },
      null,
      true
    )

  const { startExport, isStartExportLoading } = useExportMembers(mutate)

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      colorScheme={"dark"}
      scrollBehavior="inside"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        <ModalHeader>Export members</ModalHeader>
        <ModalBody>
          <Button
            colorScheme="blue"
            w="full"
            onClick={startExport}
            isLoading={isStartExportLoading}
            leftIcon={<Export />}
            mb="8"
            variant="subtle"
            // borderWidth={2}
            size="xl"
          >
            Export currently filtered
          </Button>
          <SectionTitle
            title="Recent exports"
            fontSize="md"
            titleRightElement={
              <>
                <Tooltip
                  label={
                    "You can access your last 15 exports here from the last 7 days"
                  }
                >
                  <Info />
                </Tooltip>

                <IconButton
                  icon={
                    <Icon
                      as={ArrowsClockwise}
                      animation={
                        isValidating ? "rotate 1s infinite linear" : undefined
                      }
                    />
                  }
                  aria-label="Refetch exports"
                  size="xs"
                  variant="ghost"
                  onClick={() => mutate()}
                  isDisabled={isValidating}
                  ml="auto"
                >
                  Refetch
                </IconButton>
              </>
            }
          />
          <Stack mb="6" mt="2" spacing={2.5}>
            {isLoading ? (
              <Text mb="10">Loading exports</Text>
            ) : data?.exports ? (
              data.exports.map((exp) => <ExportCard key={exp.id} exp={exp} />)
            ) : (
              <Text mb="10">Your exports will appear here</Text>
            )}
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default ExportMembersModal
