/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { forwardRef } from "react"
import ReactSelect from "react-select"
import ChakraReactSelect from "./ChakraReactSelect"
import { ChakraSelectProps } from "./types"

const Select = forwardRef<any, ChakraSelectProps>((props, ref) => (
  <ChakraReactSelect {...props}>
    <ReactSelect ref={ref} />
  </ChakraReactSelect>
))

export default Select
