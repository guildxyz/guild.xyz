"use client"

import { Float } from "@react-three/drei"
import { Canvas, ThreeElements } from "@react-three/fiber"
import * as THREE from "three"

function GuildPass(props: ThreeElements["mesh"]) {
  return (
    <mesh {...props} scale={4} rotation={new THREE.Euler(0.0, 0.1, 0.0)}>
      <boxGeometry args={[1.8, 1.0, 0.1]} />
      <meshStandardMaterial color="orange" wireframe />
    </mesh>
  )
}

export const GuildPassScene = () => {
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
      <Float floatIntensity={6}>
        <GuildPass position={[0, 0, 0]} />
      </Float>
    </Canvas>
  )
}
