import './Experience.css';
import react, {useRef, useEffect} from 'react';
// import react three fiber
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import {Sphere, Plane, shaderMaterial} from '@react-three/drei';
import * as THREE from 'three';
import { extend } from '@react-three/fiber'

const ColorShiftMaterial = shaderMaterial(
  { time: { value: 0 },
  colorStart: { value: new THREE.Color('hotpink') },
  colorEnd: { value: new THREE.Color('white') }},
  /* vertex shader */
  /* glsl */ `
    varying vec2 vUv;
    void main() {
      vec4 modelPosition = modelMatrix * vec4(position, 1.0);
      vec4 viewPosition = viewMatrix * modelPosition;
      vec4 projectionPosition = projectionMatrix * viewPosition;
      gl_Position = projectionPosition;
      vUv = uv;
    }
  `,
  /* fragment shader */
  /* glsl */ `
  uniform float time;
      varying vec2 vUv;
      void main() {
        const float TAU = 6.28;
        const int MAX_ITER = 40;
        vec2 uv = vUv;
        vec2 p = mod(uv*TAU, TAU)-250.0;
        vec2 i = vec2(p);
        float c = 1.0;
        float inten = .005;
        
        for (int n = 0; n < MAX_ITER; n++) 
        {
          float t = time * (1.0 - (3.5 / float(n+1)));
          i = p + vec2(cos(t - i.x) + sin(t + i.y), sin(t - i.y) + cos(t + i.x));
          c += 1.0/length(vec2(p.x / (sin(i.x+t)/inten),p.y / (cos(i.y+t)/inten)));
        }
        c /= float(MAX_ITER);
        c = 1.17-pow(c, 1.4);
        vec3 colour = vec3(pow(abs(c), 8.0));
        colour = clamp(colour + vec3(0.0, 0.35, 0.5), 0.0, 1.0);
      
        gl_FragColor = vec4(colour, 1.0);
      }`
)

// declaratively
extend({ ColorShiftMaterial })

export default function Experience() {
  const plane = useRef();
  const material = useRef();
  console.log(material)
  return (
    <>
      <Canvas>
        <axesHelper args={[2]} />
        <OrbitControls />
        <ambientLight intensity={0.5} />
        <Sphere scale={[2,1,1]}>
          {/* <meshStandardMaterial wireframe={true} ref = {material} attach="material" color="lightblue" opacity={0.05} transparent={true}/> */}
          <colorShiftMaterial/>
        </Sphere>
        {/* <Plane args={[2, 2]} ref={plane}>
          <colorShiftMaterial side={THREE.DoubleSide}/>
        </Plane> */}
      </Canvas>
    </>
  )
}