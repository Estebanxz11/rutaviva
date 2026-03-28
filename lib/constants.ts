export const PLACE_CATEGORIES = [
  "Naturaleza",
  "Cultura",
  "Gastronomía",
  "Aventura",
  "Historia",
  "Arte",
  "Religioso",
  "Entretenimiento",
] as const;

export type PlaceCategory = (typeof PLACE_CATEGORIES)[number];

export const BADGES = [
  {
    id: "first-visit",
    name: "Primer Paso",
    description: "Visitaste tu primer lugar",
    icon: "🏅",
    condition: (v: number) => v >= 1,
  },
  {
    id: "walker-3",
    name: "Caminante",
    description: "Visitaste 3 lugares",
    icon: "🚶",
    condition: (v: number) => v >= 3,
  },
  {
    id: "explorer-5",
    name: "Explorador",
    description: "Visitaste 5 lugares",
    icon: "🗺️",
    condition: (v: number) => v >= 5,
  },
  {
    id: "nature-8",
    name: "Amante de la Naturaleza",
    description: "Visitaste 8 lugares",
    icon: "🌿",
    condition: (v: number) => v >= 8,
  },
  {
    id: "adventurer-10",
    name: "Aventurero",
    description: "Visitaste 10 lugares",
    icon: "⛰️",
    condition: (v: number) => v >= 10,
  },
  {
    id: "master-15",
    name: "Maestro Viajero",
    description: "Visitaste 15 lugares",
    icon: "🌟",
    condition: (v: number) => v >= 15,
  },
  {
    id: "citizen-world-20",
    name: "Ciudadano del Mundo",
    description: "Visitaste 20 lugares",
    icon: "🌍",
    condition: (v: number) => v >= 20,
  },
  {
    id: "backpacker-25",
    name: "Mochilero",
    description: "Visitaste 25 lugares",
    icon: "🎒",
    condition: (v: number) => v >= 25,
  },
  {
    id: "royalty-30",
    name: "Nómada Real",
    description: "Visitaste 30 lugares",
    icon: "👑",
    condition: (v: number) => v >= 30,
  },
  {
    id: "legend-40",
    name: "Leyenda Viajera",
    description: "Visitaste 40 lugares",
    icon: "🏆",
    condition: (v: number) => v >= 40,
  },
  {
    id: "ambassador-50",
    name: "Embajador RutaViva",
    description: "Visitaste 50 lugares",
    icon: "🌎",
    condition: (v: number) => v >= 50,
  },
] as const;

export const LEVEL_TITLES = [
  "Curioso Local",
  "Explorador",
  "Aventurero",
  "Nómada Urbano",
  "Maestro Viajero",
  "Leyenda Viajera",
  "Embajador RutaViva",
] as const;

export function getLevelTitle(level: number): string {
  return LEVEL_TITLES[Math.min(level - 1, LEVEL_TITLES.length - 1)];
}
