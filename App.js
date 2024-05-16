import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber/native'
import { useFrame } from '@react-three/fiber/native';
import { useGLTF, useAnimations,ContactShadows,Environment } from '@react-three/drei/native'
import React, { useEffect,useState } from 'react'
import { SafeAreaView } from 'react-native'
const model = require('./assets/untitled.glb');


const facialExpressions = {
  smile: { Expressions_mouthSmile_max: 0.759124 },
  sad: { Expressions_mouthSmileOpen2_min: 0.390511, Expressions_eyeClosedR_max: 0.2821 }
};

function Model(props) {
  const gltf = useGLTF(model)

  const { actions, mixer } = useAnimations(gltf.animations, gltf.scene);
  const [animation, setAnimation] = useState('sitting')
  const [expression, setExpression] = useState('smile');

  useEffect(() => {
    if (actions[animation]) {
      actions[animation]  
        .reset()
        .fadeIn(mixer.stats.actions.inUse === 0 ? 0 : 0.5)
        .play();
    } else {
      console.error(`No action found for animation: ${animation}`);
    }
  }, [animation, actions, mixer]);

  useFrame(() => {
    gltf.scene.traverse((object) => {
      if (object.isMesh && object.morphTargetDictionary) {
        Object.keys(object.morphTargetDictionary).forEach((key) => {
          if (facialExpressions[expression] && facialExpressions[expression][key]) {
            object.morphTargetInfluences[object.morphTargetDictionary[key]] = facialExpressions[expression][key];
          }
        });
      }
    });
  });

  return <primitive {...props} object={gltf.scene}  position={[0,-0.5,0]} dispose={null} />
}

export default function App() {
  return (
    <Canvas 
      camera={{ position: [2, 1, 6], fov: 25 }}
      onCreated={({ gl }) => {
        const _gl = gl.getContext();
        const pixelStorei = _gl.pixelStorei.bind(_gl);
        _gl.pixelStorei = function (...args) {
          const [parameter] = args;
          switch (parameter) {
            case _gl.UNPACK_FLIP_Y_WEBGL:
              return pixelStorei(...args);
            default:
              break;
          }
        };
      }} style={{ backgroundColor: '#2E4053' }}
    >
      <ambientLight intensity={2} />
      <Suspense>
      <Environment preset="dawn" />
        <Model  />
        <ContactShadows opacity={0.7} />
      </Suspense>
    </Canvas>
  )
}
