export const easeOut = [0.22, 1, 0.36, 1] as const;

export const springSoft = {
  type: "spring" as const,
  stiffness: 120,
  damping: 22,
  mass: 0.9,
};

export const springSnappy = {
  type: "spring" as const,
  stiffness: 180,
  damping: 26,
  mass: 0.85,
};

export const viewOnce = {
  once: true,
  amount: 0.4,
  margin: "0px 0px -12% 0px",
} as const;

export const viewRow = {
  once: true,
  amount: 0.35,
  margin: "0px 0px -8% 0px",
} as const;
