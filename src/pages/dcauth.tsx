import Layout from "components/common/Layout"
import { useRouter } from "next/router"
import { useEffect } from "react"

const Auth = () => {
  const router = useRouter()

  useEffect(() => {
    const fragment = new URLSearchParams(window.location.hash.slice(1))
    const state = fragment.get("state")

    router.push(
      `/${state}/community${window.location.hash}` /* , undefined, { shallow: true } */
    )
  })

  return <Layout title="Authentication successful">{null}</Layout>
}

export default Auth
