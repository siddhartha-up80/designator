"use client";
import React, { useCallback } from "react";
import { motion } from "motion/react";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
}

export const InteractiveParticles = () => {
  const [particles, setParticles] = React.useState<Particle[]>([]);
  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });

  const createParticles = useCallback(() => {
    const newParticles: Particle[] = [];
    for (let i = 0; i < 50; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 2,
        speedY: (Math.random() - 0.5) * 2,
        opacity: Math.random() * 0.5 + 0.2,
      });
    }
    setParticles(newParticles);
  }, []);

  React.useEffect(() => {
    createParticles();

    const handleResize = () => {
      createParticles();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [createParticles]);

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  React.useEffect(() => {
    const animateParticles = () => {
      setParticles((prevParticles) =>
        prevParticles.map((particle) => {
          const distanceToMouse = Math.sqrt(
            Math.pow(particle.x - mousePosition.x, 2) +
              Math.pow(particle.y - mousePosition.y, 2)
          );

          let newX = particle.x + particle.speedX;
          let newY = particle.y + particle.speedY;

          // Mouse attraction
          if (distanceToMouse < 150) {
            const force = (150 - distanceToMouse) / 150;
            const angle = Math.atan2(
              mousePosition.y - particle.y,
              mousePosition.x - particle.x
            );
            newX += Math.cos(angle) * force * 2;
            newY += Math.sin(angle) * force * 2;
          }

          // Boundary checking
          if (newX < 0 || newX > window.innerWidth) {
            particle.speedX *= -1;
          }
          if (newY < 0 || newY > window.innerHeight) {
            particle.speedY *= -1;
          }

          return {
            ...particle,
            x: Math.max(0, Math.min(window.innerWidth, newX)),
            y: Math.max(0, Math.min(window.innerHeight, newY)),
          };
        })
      );
    };

    const interval = setInterval(animateParticles, 50);
    return () => clearInterval(interval);
  }, [mousePosition]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <svg width="100%" height="100%" className="absolute inset-0">
        {particles.map((particle) => (
          <motion.circle
            key={particle.id}
            cx={particle.x}
            cy={particle.y}
            r={particle.size}
            fill="currentColor"
            className="text-blue-500/20 dark:text-blue-400/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: particle.opacity }}
            transition={{ duration: 0.5 }}
          />
        ))}

        {/* Connection lines */}
        {particles.map((particle, index) =>
          particles.slice(index + 1).map((otherParticle, otherIndex) => {
            const distance = Math.sqrt(
              Math.pow(particle.x - otherParticle.x, 2) +
                Math.pow(particle.y - otherParticle.y, 2)
            );

            if (distance < 100) {
              return (
                <motion.line
                  key={`${index}-${otherIndex}`}
                  x1={particle.x}
                  y1={particle.y}
                  x2={otherParticle.x}
                  y2={otherParticle.y}
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-blue-500/10 dark:text-blue-400/10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: ((100 - distance) / 100) * 0.3 }}
                  transition={{ duration: 0.2 }}
                />
              );
            }
            return null;
          })
        )}
      </svg>
    </div>
  );
};
