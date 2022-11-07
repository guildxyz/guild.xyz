import { useRouter } from "next/router"
import useDebouncedEffect from "use-debounced-effect"

const useAutoScrollToRole = (sortedRoles) => {
  const router = useRouter()

  // debounced effect to prevent "Cancel rendering route" error
  useDebouncedEffect(
    () => {
      const [pathname, hash] = router.asPath.split("#")
      if (!hash) return

      router.replace(
        {
          pathname,
          hash,
        },
        undefined,
        { shallow: true }
      )
    },
    500,
    [sortedRoles]
  )
}

export default useAutoScrollToRole
