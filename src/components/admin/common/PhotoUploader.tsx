import { Box, Button, HStack, Icon, useColorMode } from "@chakra-ui/react"
import Image from "next/image"
import { forwardRef, LegacyRef, useEffect, useRef, useState } from "react"
import type { Icon as IconType } from "temporaryData/types"

type Props = {
  isInvalid?: boolean
  buttonIcon?: IconType
  buttonText?: string
  currentImage?: string
  isDisabled?: boolean
  onPhotoChange?: (newPhoto: File) => void
}

const PhotoUploader = forwardRef(
  (
    {
      isInvalid,
      buttonIcon,
      buttonText,
      currentImage,
      isDisabled = false,
      onPhotoChange,
    }: Props,
    ref: LegacyRef<HTMLDivElement>
  ): JSX.Element => {
    const fileInputRef = useRef()
    const { colorMode } = useColorMode()
    const [pickedPhoto, setPickedPhoto] = useState<File>()
    const [photoPreview, setPhotoPreview] = useState(currentImage)

    // Needed for displaying blob files
    const customImageLoader = ({ src }) => `${src}`

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
      <HStack position="relative" spacing={4} ref={ref}>
        {photoPreview ? (
          <Box
            position="relative"
            width={10}
            height={10}
            borderRadius="full"
            overflow="hidden"
          >
            <Image
              loader={customImageLoader}
              src={photoPreview}
              alt="Placeholder"
              layout="fill"
            />
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
    )
  }
)

export default PhotoUploader
