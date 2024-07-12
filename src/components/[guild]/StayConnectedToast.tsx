import { ToastId, useToast } from "@chakra-ui/react"
import useLocalStorage from "hooks/useLocalStorage"
import { useToastWithButton } from "hooks/useToast"
import { useRouter } from "next/router"
import { ArrowRight } from "phosphor-react"
import { useCallback, useEffect, useRef } from "react"
import useGuild from "./hooks/useGuild"
import useGuildPermission from "./hooks/useGuildPermission"

const CONTACT_TOAST_ID = "requireGuildContactToast"

const useStayConnectedToast = (onClick: () => void) => {
  const toastWithButton = useToastWithButton()
  const toastIdRef = useRef<ToastId>()
  const router = useRouter()
  const toast = useToast()
  const { isAdmin } = useGuildPermission()
  const { id, urlName, contacts, isLoading } = useGuild()

  const [hasSeenAddContactInfoToast, setHasSeenAddContactInfoToast] =
    useLocalStorage(`hasSeenAddContactInfoToast-${id}`, false)

  const showAddContactInfoToast = useCallback(() => {
    setHasSeenAddContactInfoToast(true)
    toastIdRef.current = toastWithButton({
      id: CONTACT_TOAST_ID,
      status: "info",
      title: "Stay connected with us",
      description:
        "To keep our services smooth, we occasionally need to reach out. Please add your contact info for timely updates and support!",
      buttonProps: {
        children: "Open guild settings",
        onClick: () => onClick(),
        rightIcon: <ArrowRight />,
      },
      duration: null,
      isClosable: true,
    })
  }, [setHasSeenAddContactInfoToast, toastWithButton, onClick])

  useEffect(() => {
    if (isAdmin && !contacts?.length && !isLoading && !hasSeenAddContactInfoToast)
      showAddContactInfoToast()
  }, [
    isAdmin,
    contacts?.length,
    isLoading,
    hasSeenAddContactInfoToast,
    showAddContactInfoToast,
  ])

  useEffect(() => {
    const handleRouteChange = (url) => {
      if (url === `/${urlName}` || url === `/${id}`) return
      toast.close(CONTACT_TOAST_ID)
    }

    router.events.on("routeChangeStart", handleRouteChange)
    return () => {
      router.events.off("routeChangeStart", handleRouteChange)
    }
  }, [urlName, id, toast, router.events])
}

export default useStayConnectedToast
