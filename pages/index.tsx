import { Button } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import Head from "next/head"
import Account from "../components/Account"
import ETHBalance from "../components/ETHBalance"
import useEagerConnect from "../hooks/useEagerConnect"
import usePersonalSign from "../hooks/usePersonalSign"

const Home = (): JSX.Element => {
  const { account, library } = useWeb3React()

  const triedToEagerConnect = useEagerConnect()

  const sign = usePersonalSign()

  const handleSign = async () => {
    const msg = "something"
    const sig = await sign(msg)
  }

  const isConnected = typeof account === "string" && !!library

  return (
    <div>
      <Head>
        <title>Agora Space</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Account triedToEagerConnect={triedToEagerConnect} />

      {isConnected && (
        <div>
          <ETHBalance />
          <Button type="button" onClick={handleSign}>
            Personal Sign
          </Button>
        </div>
      )}
    </div>
  )
}

export default Home
