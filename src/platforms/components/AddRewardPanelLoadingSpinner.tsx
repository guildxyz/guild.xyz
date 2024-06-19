import { Center, Spinner } from "@chakra-ui/react";
import React from "react";

export const AddRewardPanelLoadingSpinner = ({ height = "51vh" }: any) => (
  <Center w="full" h={height}>
    <Spinner size="xl" thickness="4px" />
  </Center>
)
