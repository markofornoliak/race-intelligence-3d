import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { AdditiveBlending, Color, ShaderMaterial } from 'three';
import type { SceneMode } from './types';

export function FillMaterial({ mode, selected = false, accent = '#1c96ff', opacity = 0.82 }: { mode: SceneMode; selected?: boolean; accent?: string; opacity?: number }) {
  const material = useRef<ShaderMaterial | null>(null);
  const modeValue = mode === 'race' ? 0 : mode === 'engineering' ? 1 : 2;
  useEffect(() => {
    if (!material.current) return;
    material.current.uniforms.uMode.value = modeValue;
    material.current.uniforms.uSelected.value = selected ? 1 : 0;
  }, [modeValue, selected]);
  useFrame((state) => {
    if (!material.current) return;
    material.current.uniforms.uTime.value = state.clock.elapsedTime;
  });

  return (
    <shaderMaterial
      ref={material}
      transparent
      depthWrite
      uniforms={{
        uTime: { value: 0 },
        uMode: { value: modeValue },
        uSelected: { value: selected ? 1 : 0 },
        uOpacity: { value: opacity },
        uAccent: { value: new Color(accent) },
      }}
      vertexShader={/* glsl */`
        varying vec3 vWorld;
        varying vec3 vNormal;
        varying vec3 vView;
        void main(){
          vec4 world = modelMatrix * vec4(position,1.0);
          vWorld = world.xyz;
          vNormal = normalize(mat3(modelMatrix) * normal);
          vView = cameraPosition - world.xyz;
          gl_Position = projectionMatrix * viewMatrix * world;
        }
      `}
      fragmentShader={/* glsl */`
        uniform float uTime;
        uniform float uMode;
        uniform float uSelected;
        uniform float uOpacity;
        uniform vec3 uAccent;
        varying vec3 vWorld;
        varying vec3 vNormal;
        varying vec3 vView;
        vec3 thermal(float value){
          vec3 cold = vec3(0.02,0.12,0.42);
          vec3 mid = vec3(0.08,0.78,1.0);
          vec3 hot = vec3(1.0,0.14,0.03);
          return value < .55 ? mix(cold,mid,value/.55) : mix(mid,hot,(value-.55)/.45);
        }
        void main(){
          vec3 N = normalize(vNormal);
          vec3 V = normalize(vView);
          float fresnel = pow(1.0 - max(dot(N,V),0.0),2.2);
          float scan = smoothstep(.74,1.0,.5+.5*sin(vWorld.y*16.0 + vWorld.x*2.4 - uTime*2.1));
          float carbon = .5+.5*sin((vWorld.x+vWorld.z)*42.0)*sin((vWorld.x-vWorld.z)*42.0);
          vec3 base = mix(vec3(.015,.024,.038),vec3(.035,.065,.10),carbon*.18);
          if(uMode > .5 && uMode < 1.5){ base = mix(vec3(.008,.035,.075),uAccent,.15 + fresnel*.42); }
          if(uMode > 1.5){
            float heat = clamp(.48 + vWorld.x*.11 + abs(vWorld.z)*.22 + sin(uTime*.45)*.05,0.0,1.0);
            base = thermal(heat);
          }
          vec3 color = base + uAccent*(fresnel*.32 + scan*.07 + uSelected*.42);
          float alpha = uOpacity;
          if(uMode > .5 && uMode < 1.5) alpha *= .48 + fresnel*.44;
          if(uSelected > .5) alpha = min(1.0,alpha+.12);
          gl_FragColor = vec4(color,alpha);
        }
      `}
    />
  );
}

export function WireMaterial({ mode, selected = false, accent = '#9bdcff', opacity = 0.42 }: { mode: SceneMode; selected?: boolean; accent?: string; opacity?: number }) {
  const material = useRef<ShaderMaterial | null>(null);
  useEffect(() => {
    if (!material.current) return;
    material.current.uniforms.uSelected.value = selected ? 1 : 0;
    material.current.uniforms.uMode.value = mode === 'race' ? 0 : mode === 'engineering' ? 1 : 2;
  }, [mode, selected]);
  useFrame((state) => {
    if (!material.current) return;
    material.current.uniforms.uTime.value = state.clock.elapsedTime;
  });
  return (
    <shaderMaterial
      ref={material}
      transparent
      depthWrite={false}
      blending={AdditiveBlending}
      wireframe
      uniforms={{
        uTime: { value: 0 },
        uSelected: { value: selected ? 1 : 0 },
        uMode: { value: mode === 'race' ? 0 : mode === 'engineering' ? 1 : 2 },
        uAccent: { value: new Color(accent) },
        uOpacity: { value: opacity },
      }}
      vertexShader={/* glsl */`
        varying vec3 vWorld;
        void main(){
          vec4 world = modelMatrix * vec4(position,1.0);
          vWorld = world.xyz;
          gl_Position = projectionMatrix * viewMatrix * world;
        }
      `}
      fragmentShader={/* glsl */`
        uniform float uTime;
        uniform float uSelected;
        uniform float uMode;
        uniform vec3 uAccent;
        uniform float uOpacity;
        varying vec3 vWorld;
        void main(){
          float pulse = .72 + .28*sin(uTime*1.9 + vWorld.x*5.0 + vWorld.z*3.0);
          vec3 thermal = mix(vec3(.1,.7,1.0),vec3(1.0,.18,.04),clamp(.5+vWorld.x*.13,0.0,1.0));
          vec3 color = uMode > 1.5 ? thermal : uAccent;
          float alpha = uOpacity*pulse + uSelected*.36;
          gl_FragColor = vec4(color,alpha);
        }
      `}
    />
  );
}
