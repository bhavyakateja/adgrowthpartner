"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function HeroCanvas({
  className,
}: {
  className?: string;
}) {
  const hostRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const host = hostRef.current;

    if (!host) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let renderer: THREE.WebGLRenderer;

    try {
      renderer = new THREE.WebGLRenderer({
        antialias: false,
        alpha: true,
        powerPreference: "low-power",
      });
    } catch {
      return;
    }

    renderer.setPixelRatio(
      Math.min(window.devicePixelRatio, 1.75),
    );

    renderer.setSize(
      host.clientWidth,
      host.clientHeight,
      false,
    );

    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";

    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();

    const camera = new THREE.OrthographicCamera(
      -1,
      1,
      1,
      -1,
      0,
      1,
    );

    const uniforms = {
      uTime: { value: 0 },
      uAspect: {
        value:
          host.clientWidth /
          Math.max(host.clientHeight, 1),
      },
      uPointer: {
        value: new THREE.Vector2(0, 0),
      },
    };

    const material = new THREE.ShaderMaterial({
      transparent: true,
      uniforms,

      vertexShader: `
        varying vec2 vUv;

        void main() {
          vUv = uv;
          gl_Position = vec4(position, 1.0);
        }
      `,

      fragmentShader: `
        precision highp float;

        varying vec2 vUv;

        uniform float uTime;
        uniform float uAspect;
        uniform vec2 uPointer;

        const vec3 SUNSET = vec3(0.94, 0.36, 0.14);
        const vec3 GOLD = vec3(0.98, 0.75, 0.35);
        const vec3 STEEL = vec3(0.62, 0.68, 0.76);

        float ribbon(
          vec2 p,
          float phase,
          float freq,
          float thickness
        ) {
          float y =
            sin(p.x * freq + phase) * 0.22
            +
            sin(
              p.x * freq * 0.47
              - phase * 0.7
            ) * 0.12;

          float d = abs(p.y - y);

          return thickness / (d + thickness);
        }

        void main() {
          vec2 p = vec2(
            (vUv.x - 0.5) * uAspect,
            vUv.y - 0.5
          );

          p += uPointer * 0.06;

          float t = uTime * 0.16;

          vec3 col = vec3(0.0);
          float glow = 0.0;

          for (int i = 0; i < 4; i++) {
            float fi = float(i);

            float phase = t + fi * 1.7;

            float band = ribbon(
              p + vec2(
                0.0,
                (fi - 1.5) * 0.16
              ),
              phase,
              1.6 + fi * 0.35,
              0.035 + fi * 0.012
            );

            band = pow(band, 3.4) * 0.55;

            vec3 tint = mix(
              SUNSET,
              mix(
                GOLD,
                STEEL,
                fract(fi * 0.5)
              ),
              fi / 3.0
            );

            col += tint * band;
            glow += band;
          }

          float sheen = smoothstep(
            0.35,
            1.0,
            sin(
              p.x * 1.2 -
              t * 1.4
            ) * 0.5 + 0.5
          );

          col += STEEL * sheen * glow * 0.12;

          float vignette = smoothstep(
            1.05,
            0.15,
            length(p)
          );

          float alpha = clamp(
            glow * 0.9,
            0.0,
            1.0
          ) * vignette;

          gl_FragColor = vec4(
            col * vignette,
            alpha * 0.9
          );
        }
      `,
    });

    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(2, 2),
      material,
    );

    scene.add(mesh);

    const pointerTarget = new THREE.Vector2(0, 0);

    const onPointer = (event: PointerEvent) => {
      pointerTarget.set(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(
          (event.clientY / window.innerHeight) * 2 -
          1
        ),
      );
    };

    window.addEventListener(
      "pointermove",
      onPointer,
      { passive: true },
    );

    const resize = () => {
      const width = host.clientWidth;
      const height = host.clientHeight;

      if (!width || !height) return;

      renderer.setSize(
        width,
        height,
        false,
      );

      uniforms.uAspect.value = width / height;
    };

    const resizeObserver = new ResizeObserver(resize);

    resizeObserver.observe(host);

    let visible = true;

    const intersectionObserver =
      new IntersectionObserver(([entry]) => {
        visible =
          entry?.isIntersecting ?? true;
      });

    intersectionObserver.observe(host);

    const clock = new THREE.Timer();

    let animationFrame = 0;

    const loop = () => {
      animationFrame =
        requestAnimationFrame(loop);

      if (!visible || document.hidden) {
        return;
      }

      if (!reduced) {
        uniforms.uTime.value +=
          clock.getDelta();
      } else {
        clock.getDelta();
      }

      uniforms.uPointer.value.lerp(
        pointerTarget,
        0.05,
      );

      renderer.render(
        scene,
        camera,
      );
    };

    renderer.render(scene, camera);

    loop();

    return () => {
      cancelAnimationFrame(animationFrame);

      window.removeEventListener(
        "pointermove",
        onPointer,
      );

      resizeObserver.disconnect();
      intersectionObserver.disconnect();

      mesh.geometry.dispose();
      material.dispose();
      renderer.dispose();

      if (
        renderer.domElement.parentNode ===
        host
      ) {
        host.removeChild(
          renderer.domElement,
        );
      }
    };
  }, []);

  return (
    <div
      ref={hostRef}
      className={className}
      aria-hidden
    />
  );
}