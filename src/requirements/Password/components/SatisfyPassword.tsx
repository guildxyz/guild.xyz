import {
  ButtonProps,
  Icon,
  Input,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  useDisclosure,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import { Modal } from "components/common/Modal"
import useAccess from "components/[guild]/hooks/useAccess"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"
import { Key } from "phosphor-react"
import { useEffect, useState } from "react"
import useSWRImmutable from "swr/immutable"
import { useFetcherWithSign } from "utils/fetcher"
import useVerifyPassword from "../hooks/useVerifyPassword"

const CompleteCaptcha = (props: ButtonProps): JSX.Element => {
  const { id, roleId } = useRequirementContext()
  const { onOpen, onClose, isOpen } = useDisclosure()

  const { data: roleAccess } = useAccess(roleId, isOpen && { refreshInterval: 5000 })

  const hasAccess = roleAccess?.requirements?.find(
    (req) => req.requirementId === id
  )?.access

  if (!roleAccess || hasAccess) return null

  return (
    <>
      <Button
        size="xs"
        onClick={onOpen}
        colorScheme="cyan"
        leftIcon={<Icon as={Key} />}
        iconSpacing="1"
        {...props}
      >
        Satisfy password
      </Button>

      <CompletePasswordModal onClose={onClose} isOpen={isOpen} />
    </>
  )
}

const CompletePasswordModal = ({ isOpen, onClose }) => {
  const fetcherWithSign = useFetcherWithSign()
  const [password, setPassword] = useState("")
  const { data: getGateCallbackData } = useSWRImmutable(
    isOpen ? ["/util/getGateCallback/PASSWORD", { body: {} }] : null,
    fetcherWithSign
  )
  const { onSubmit, isLoading, response } = useVerifyPassword()
  const onVerify = () => {
    onSubmit({
      callback: getGateCallbackData?.callbackUrl,
      password,
    })
  }
  useEffect(() => {
    if (!response) return
    onClose()
  }, [response])

  return (
    <Modal
      {...{
        isOpen,
        onClose,
      }}
    >
      <ModalOverlay />

      <ModalContent>
        <ModalHeader>Satisfy password</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={5}>
          {" "}
          <Input
            type="password"
            autoComplete="off" // TODO: doesn't work
            maxLength={32}
            placeholder="Required password"
            onChange={(e) => setPassword(e.target.value)}
          />{" "}
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="green"
            ml="auto"
            onClick={onVerify}
            leftIcon={isLoading ? <Spinner size="sm" /> : null}
          >
            Satisfy
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default CompleteCaptcha
export { CompletePasswordModal }
