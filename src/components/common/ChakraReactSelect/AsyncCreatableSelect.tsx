/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { forwardRef } from "react"
import AsyncCreatableReactSelect from "react-select/async-creatable"
import ChakraReactSelect from "./ChakraReactSelect"
import { ChakraSelectProps } from "./types"

const AsyncCreatableSelect = forwardRef<any, ChakraSelectProps>((props, ref) => (
  <ChakraReactSelect {...props}>
    <AsyncCreatableReactSelect ref={ref} />
  </ChakraReactSelect>
))

export default AsyncCreatableSelect
