import './Experience.css';
import react, {useRef, useEffect, useFrame} from 'react';
// import react three fiber
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import {Sphere, Plane, shaderMaterial} from '@react-three/drei';
import * as THREE from 'three';
import { extend } from '@react-three/fiber'

const ColorShiftMaterial = shaderMaterial(
  { time: 0, color: new THREE.Color(0.2, 0.0, 0.1) },
  // vertex shader
  /*glsl*/`
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // fragment shader
  /*glsl*/`
    uniform float time;
    uniform vec3 color;
    varying vec2 vUv;
    void main() {
      gl_FragColor.rgba = vec4(0.5 + 0.3 * sin(vUv.yxx + time) + color, 1.0);
    }
  `
)

// declaratively
extend({ ColorShiftMaterial })

export default function Experience() {
  const plane = useRef();
  useEffect(() => {
    // console.log('useEffect:', plane.current); // You may see "undefined" here during the initial render
  }, []);

  useFrame(() => {
    if (plane.current) {
      plane.current.rotation.x += 0.01; // Perform continuous rotation here
    }
  });
  return (
    <>
      <Canvas>
        <axesHelper args={[2]} />
        <OrbitControls />
        <ambientLight intensity={0.5} />
        <Sphere>
          {/* <meshStandardMaterial attach="material" color="hotpink" /> */}
          <colorShiftMaterial/>
        </Sphere>
        <Plane args={[2, 2]} ref={plane}>
          <colorShiftMaterial side={THREE.DoubleSide}/>
        </Plane>
      </Canvas>
    </>
  )
}