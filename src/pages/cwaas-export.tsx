import GoogleLoginButton from "@/components/Web3ConnectionManager/WalletSelectorModal/components/GoogleLoginButton"
import { useColorModeValue } from "@chakra-ui/react"
import Card from "components/common/Card"
import { Layout } from "components/common/Layout"

const CWaaSExportPage = () => {
  const bgColor = useColorModeValue("var(--chakra-colors-gray-800)", "#1d1d1f")

  return (
    <Layout.Root>
      <Layout.Head ogTitle="Export Google wallet" />
      <Layout.HeaderSection>
        <Layout.Background
          opacity={1}
          bgColor={bgColor}
          _before={{
            content: '""',
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            bg: `radial-gradient(circle at bottom, transparent 5%, ${bgColor}), url('/banner.png ')`,
            bgSize: { base: "auto 100%", sm: "auto 115%" },
            bgPosition: "top 5px right 0px",
            opacity: 0.06,
          }}
          offset={100}
          boxShadow="inset 1px -2px 8px 0px rgba(0, 0, 0, 0.06)"
        />
        <Layout.Header />
      </Layout.HeaderSection>

      <Layout.MainSection
        display="flex"
        alignItems="center"
        justifyContent="center"
        py={16}
      >
        <Card px={{ base: 5, md: 6 }} py={{ base: 6, md: 7 }} w="full" maxW="md">
          <GoogleLoginButton />
        </Card>
      </Layout.MainSection>
    </Layout.Root>
  )
}

export default CWaaSExportPage
