"use client"

import { Environment, Float } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import { FunctionComponent } from "react"
import * as THREE from "three"
import { SUBSCRIPTIONS } from "../constants"
import { Model as BasicModel } from "./BasicGuildPass"
import { Model as GoldModel } from "./GoldGuildPass"

type SceneVariant = (typeof SUBSCRIPTIONS)[number]["title"]

function SinglePass() {
  return <BasicModel rotation={new THREE.Euler(Math.PI / 2, 0.0, 0.0)} scale={2} />
}

function BundlePass() {
  return <BasicModel rotation={new THREE.Euler(Math.PI / 2, 0.0, 0.0)} scale={2} />
}

function LifetimePass() {
  return <GoldModel rotation={new THREE.Euler(Math.PI / 2, 0.0, 0.0)} scale={2} />
}

const Variants: Record<SceneVariant, FunctionComponent> = {
  "Single Pass": SinglePass,
  "Bundle Pass": BundlePass,
  "Lifetime Pass": LifetimePass,
}

export const GuildPassScene = ({ sceneVariant }: { sceneVariant: SceneVariant }) => {
  const Variant = Variants[sceneVariant]
  return (
    <Canvas>
      <ambientLight intensity={Math.PI / 2} />
      <spotLight
        position={[10, 10, 10]}
        angle={0.15}
        penumbra={1}
        decay={0}
        intensity={Math.PI}
      />
      <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
      <Float floatIntensity={6} speed={2.4}>
        <Variant />
      </Float>
      <Environment preset="city" />
    </Canvas>
  )
}
