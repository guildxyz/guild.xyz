"use client"

import {
  AccumulativeShadows,
  Environment,
  Float,
  Gltf,
  RandomizedLight,
  useGLTF,
} from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import { FunctionComponent } from "react"
import * as THREE from "three"
import { SUBSCRIPTIONS } from "../constants"

type SceneVariant = (typeof SUBSCRIPTIONS)[number]["title"]

function SinglePass() {
  return (
    <Gltf
      src={"models/basic_guild_pass.glb"}
      rotation={new THREE.Euler(Math.PI / 2, 0.0, 0.0)}
      scale={2}
    />
  )
}

function BundlePass() {
  return (
    <Gltf
      src={"models/basic_guild_pass.glb"}
      rotation={new THREE.Euler(Math.PI / 2, 0.0, 0.0)}
      scale={2}
    />
  )
}

function LifetimePass() {
  return (
    <Gltf
      src={"models/gold_guild_pass.glb"}
      rotation={new THREE.Euler(Math.PI / 2, 0.0, 0.0)}
      scale={2}
    />
  )
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
      <AccumulativeShadows
        temporal
        frames={100}
        color="white"
        colorBlend={2}
        toneMapped={true}
        alphaTest={0.75}
        opacity={2}
        scale={12}
      >
        <RandomizedLight
          intensity={Math.PI}
          amount={8}
          radius={4}
          ambient={0.5}
          position={[5, 5, -10]}
          bias={0.001}
        />
      </AccumulativeShadows>
      <Environment preset="city" />
    </Canvas>
  )
}

useGLTF.preload("models/gold_guild_pass.glb")
useGLTF.preload("models/basic_guild_pass.glb")
