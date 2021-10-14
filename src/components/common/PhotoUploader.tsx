import {
  Box,
  Button,
  FormControl,
  FormLabel,
  HStack,
  Icon,
  Img,
  useColorMode,
} from "@chakra-ui/react"
import { IconProps } from "phosphor-react"
import { useEffect, useRef, useState } from "react"

type Props = {
  label?: string
  isInvalid?: boolean
  buttonIcon?: React.ForwardRefExoticComponent<
    IconProps & React.RefAttributes<SVGSVGElement>
  >
  buttonText?: string
  currentImage?: string
  isDisabled?: boolean
  onPhotoChange?: (newPhoto: File) => void
}

const PhotoUploader = ({
  label,
  isInvalid,
  buttonIcon,
  buttonText,
  currentImage,
  isDisabled = false,
  onPhotoChange,
}: Props): JSX.Element => {
  const fileInputRef = useRef()
  const { colorMode } = useColorMode()
  const [pickedPhoto, setPickedPhoto] = useState<File>()
  const [photoPreview, setPhotoPreview] = useState(currentImage)

  const fileInputClick = () => {
    const fileInput = fileInputRef.current || null
    fileInput?.click()
  }

  const fileInputChange = (e) => {
    setPickedPhoto(e.target.files[0])
  }

  // Set up the preview image & send the new file to the parent component
  useEffect(() => {
    if (pickedPhoto) {
      setPhotoPreview(URL.createObjectURL(pickedPhoto))
      if (onPhotoChange) {
        onPhotoChange(pickedPhoto)
      }
    }
  }, [pickedPhoto])

  return (
    <FormControl isInvalid={false}>
      {label && <FormLabel>{label}</FormLabel>}

      <HStack position="relative" spacing={4}>
        {photoPreview ? (
          <Box
            position="relative"
            width={10}
            height={10}
            borderRadius="full"
            overflow="hidden"
          >
            <Img src={photoPreview} alt="Placeholder" />
          </Box>
        ) : (
          <Box width={10} height={10} rounded="full" bgColor="gray.100" />
        )}

        <Button
          leftIcon={buttonIcon && <Icon as={buttonIcon} />}
          variant="outline"
          borderWidth={1}
          rounded="md"
          size="sm"
          px={6}
          height={10}
          textColor={
            (isInvalid && (colorMode === "light" ? "red.500" : "red.200")) ||
            "current"
          }
          onClick={fileInputClick}
        >
          {buttonText || "Upload image"}
        </Button>

        <input
          type="file"
          style={{ display: "none" }}
          accept="image/png, image/jpeg"
          onChange={fileInputChange}
          ref={fileInputRef}
        />

        {isDisabled && (
          <Box
            position="absolute"
            inset={0}
            ml="0!important"
            bgColor={colorMode === "light" ? "white" : "gray.700"}
            opacity={0.5}
          />
        )}
      </HStack>
    </FormControl>
  )
}

export default PhotoUploader
