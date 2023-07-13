import {
  AspectRatio,
  FormControl,
  FormLabel,
  Icon,
  Img,
  Text,
  VStack,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import FormErrorMessage from "components/common/FormErrorMessage"
import useDropzone from "hooks/useDropzone"
import { Image } from "phosphor-react"
import { useState } from "react"

const ImagePicker = () => {
  const [preview, setPreview] = useState<string>()

  const { isDragActive, fileRejections, getRootProps, getInputProps } = useDropzone({
    multiple: false,
    noClick: false,
    onDrop: (acceptedFiles) => {
      setPreview(URL.createObjectURL(acceptedFiles[0]))
      console.log("accepted files:", acceptedFiles)
    },
  })

  return (
    <FormControl isInvalid={!!fileRejections?.[0]}>
      <FormLabel>Media</FormLabel>

      <AspectRatio ratio={1}>
        <Button p={0} borderWidth={1} variant="ghost" {...getRootProps()}>
          {preview ? (
            <Img aspectRatio={1} objectFit="cover" src={preview} alt="NFT image" />
          ) : (
            <VStack p={4}>
              <Icon as={Image} weight="light" boxSize={16} color="gray" />
              <Text
                display={{ base: "none", md: "inline" }}
                colorScheme="gray"
                fontSize="sm"
                fontWeight="normal"
              >
                {isDragActive ? "Drop" : "Choose or drop image here"}
              </Text>
            </VStack>
          )}
          <input {...getInputProps()} hidden />
        </Button>
      </AspectRatio>

      <FormErrorMessage>
        {fileRejections?.[0]?.errors?.[0]?.message}
      </FormErrorMessage>
    </FormControl>
  )
}

export default ImagePicker
