import * as THREE from "three";

export const createSparkleTexture = (): THREE.CanvasTexture => {
  const c = document.createElement("canvas");
  c.width = 64;
  c.height = 64;
  const ctx = c.getContext("2d")!;
  const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, "rgba(255, 250, 220, 1)");
  grad.addColorStop(0.25, "rgba(242, 208, 124, 0.9)");
  grad.addColorStop(0.65, "rgba(212, 175, 55, 0.3)");
  grad.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(32, 32, 32, 0, Math.PI * 2);
  ctx.fill();
  return new THREE.CanvasTexture(c);
};

export interface ParticleSystemHandle {
  points: THREE.Points;
  geometry: THREE.BufferGeometry;
  material: THREE.PointsMaterial;
  velocities: Float32Array;
  count: number;
}

export const createGoldenParticleSystem = (
  slotXPositions: number[],
  slotYPos: number,
  particleCount = 180
): ParticleSystemHandle => {
  const particleGeo = new THREE.BufferGeometry();
  const particlePositions = new Float32Array(particleCount * 3);
  const particleVelocities = new Float32Array(particleCount * 3);

  for (let p = 0; p < particleCount; p++) {
    const slotX = slotXPositions[p % slotXPositions.length];
    particlePositions[p * 3] = slotX + (Math.random() - 0.5) * 1.4;
    particlePositions[p * 3 + 1] = slotYPos + (Math.random() - 0.5) * 1.8;
    particlePositions[p * 3 + 2] = 0.05 + Math.random() * 0.4;

    particleVelocities[p * 3] = (Math.random() - 0.5) * 0.35;
    particleVelocities[p * 3 + 1] = 0.3 + Math.random() * 0.7;
    particleVelocities[p * 3 + 2] = (Math.random() - 0.5) * 0.2;
  }
  particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));

  const particleMat = new THREE.PointsMaterial({
    size: 0.16,
    map: createSparkleTexture(),
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  const points = new THREE.Points(particleGeo, particleMat);

  return {
    points,
    geometry: particleGeo,
    material: particleMat,
    velocities: particleVelocities,
    count: particleCount,
  };
};

export const updateParticleAnimation = (
  handle: ParticleSystemHandle,
  delta: number,
  slotXPositions: number[]
) => {
  const posAttr = handle.geometry.attributes.position as THREE.BufferAttribute;
  const positions = posAttr.array as Float32Array;
  const velocities = handle.velocities;

  for (let p = 0; p < handle.count; p++) {
    positions[p * 3 + 1] += velocities[p * 3 + 1] * delta;
    positions[p * 3] += velocities[p * 3] * delta;
    if (positions[p * 3 + 1] > 3.2) {
      positions[p * 3 + 1] = 1.2;
      const sX = slotXPositions[p % slotXPositions.length];
      positions[p * 3] = sX + (Math.random() - 0.5) * 1.2;
    }
  }
  posAttr.needsUpdate = true;
};
