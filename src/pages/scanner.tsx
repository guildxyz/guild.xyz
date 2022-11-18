import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react"
import moment from "moment"
import Head from "next/head"
import { CheckCircle, XCircle } from "phosphor-react"
import QrScanner from "qr-scanner"
import { useEffect, useRef, useState } from "react"

const Page = (): JSX.Element => {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const scannerRef = useRef<QrScanner | null>(null)
  const [scanResult, setScanResult] = useState(null)
  const [pending, setPending] = useState(false)

  useEffect(() => {
    const videoElement = videoRef.current
    if (!videoElement) return

    const qrScanner = new QrScanner(
      videoElement,
      async (result) => {
        qrScanner.stop()
        await scanPass(result.data)
      },
      {
        preferredCamera: "environment",
        highlightScanRegion: true,
      }
    )
    scannerRef.current = qrScanner
    if (!scanResult) qrScanner.start().catch((error) => console.error(error))

    return () => qrScanner.stop()
  }, [scanResult])

  const stop = () => {
    const scanner = scannerRef.current
    if (!scanner) {
      return
    }
    scanner.stop()
  }

  const start = () => {
    const scanner = scannerRef.current
    if (!scanner) {
      return
    }
    scanner.start()
  }

  const reset = () => {
    setPending(false)
    setScanResult(null)
  }

  const scanPass = async (data?: string) => {
    setPending(true)
    try {
      const response = await fetch(`/api/ethpass/scan?data=${data}`, {
        headers: new Headers({
          "content-type": "application/json",
        }),
      })

      if (response.status === 200) {
        const json = await response.json()
        setScanResult({ success: true, ...json })
      } else {
        setScanResult({ success: false })
      }
    } catch (error) {
      setScanResult({ success: false, error })
    }
  }

  const renderPassMetadata = () => {
    if (!scanResult) return

    return (
      <Flex direction="column">
        <Text>
          <strong>Guild: </strong>
          {scanResult.guildName}
        </Text>
        <Text>
          <strong>Role: </strong>
          {scanResult.roleName}
        </Text>
        <Text>
          <strong>Address: </strong>
          {`${scanResult?.ownerAddress.slice(
            0,
            6
          )}...${scanResult?.ownerAddress.slice(-4)}`}
        </Text>
        {scanResult?.lastScannedAt && (
          <Text>
            <strong>Last scanned: </strong>{" "}
            {moment(scanResult?.lastScannedAt).format("llll")}
          </Text>
        )}
        {scanResult?.expiredAt && (
          <Text>
            <strong>Pass Expired: </strong>{" "}
            {moment(scanResult?.expiredAt).format("llll")}
          </Text>
        )}
      </Flex>
    )
  }

  const renderIcon = () => {
    if (!scanResult) return
    if (!scanResult?.success || scanResult.expiredAt) {
      return (
        <Flex direction="column" align="center" textAlign="center">
          <XCircle size={60} color="red" />
          <Text fontSize="2xl">Pass Invalid</Text>
        </Flex>
      )
    }
    if (scanResult.lastScannedAt) {
      return (
        <Flex direction="column" align="center" textAlign="center">
          <CheckCircle size={60} color="green" />
          <Text fontSize="2xl">Valid Pass</Text>
          <Text fontSize="sm" fontWeight="normal" fontStyle="italic">
            {`This pass is valid however, it was scanned ${moment(
              scanResult?.lastScannedAt
            ).fromNow()}.`}
          </Text>
        </Flex>
      )
    } else {
      return (
        <Flex direction="column" align="center" textAlign="center">
          <CheckCircle size={60} color="green" />
          <Text fontSize="2xl">Valid Pass</Text>
        </Flex>
      )
    }
  }

  return (
    <>
      <Head>
        <title>Scan Mobile Pass</title>
        <meta name="og:title" content="Scan Mobile Pass" />
      </Head>

      <Container maxW={{ base: "container.sm", lg: "container.lg" }}>
        <Stack pt={16} pb={32}>
          <Heading
            fontFamily="display"
            fontSize={{ base: "4xl", md: "5xl", lg: "7xl" }}
            textAlign="center"
            mb={10}
          >
            Scan Mobile Pass
          </Heading>
          <Flex direction="column" align="center" gap={8}>
            <Box position="relative" maxW={500} h={{ base: "auto", md: 280 }}>
              <video ref={videoRef} muted id="scanner" />
            </Box>

            <Flex w={{ base: "full", md: "xs" }} gap={4}>
              <Button onClick={start} colorScheme="green" flex={1}>
                Start
              </Button>
              <Button onClick={stop} colorScheme="red" flex={1}>
                Stop
              </Button>
            </Flex>
          </Flex>

          <Modal isOpen={pending} onClose={reset} closeOnOverlayClick={scanResult}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader pr={{ base: 6, md: 10 }}>{renderIcon()}</ModalHeader>
              {scanResult?.success ? (
                <ModalBody>{renderPassMetadata()}</ModalBody>
              ) : null}
              {scanResult ? (
                <ModalFooter justifyContent="center">
                  <Button onClick={reset}>Scan another pass</Button>
                </ModalFooter>
              ) : (
                <ModalFooter justifyContent="center" marginTop="-24px">
                  <Flex gap={4}>
                    <Spinner />
                    <Text fontSize="lg" fontWeight="semibold">
                      Verifying...
                    </Text>
                  </Flex>
                </ModalFooter>
              )}
            </ModalContent>
          </Modal>
        </Stack>
      </Container>
    </>
  )
}

export default Page
