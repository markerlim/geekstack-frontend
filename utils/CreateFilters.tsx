import { FilterSection } from "../components/features/FilterBar";

export function processCardsByTCG(
  cards: any[],
  onChangeFactory: (title: string) => (value: string) => void,
  activeFilters: Record<string, string>
): FilterSection[] {
  const colorSet = new Set<string>();
  const raritySet = new Set<string>();
  const boosterSet = new Set<string>();

  cards.forEach((card) => {
    if (card.color) colorSet.add(card.color);
    if (card.rarity) raritySet.add(card.rarity);
    if (card.booster) boosterSet.add(card.booster);
  });

  const toOptions = (set: Set<string>) =>
    Array.from(set).map((val) => ({ label: val, value: val }));

  return [
    {
      title: "Color",
      options: toOptions(colorSet),
      active: activeFilters["Color"] || "",
      onChange: onChangeFactory("Color"),
    },
    {
      title: "Rarity",
      options: toOptions(raritySet),
      active: activeFilters["Rarity"] || "",
      onChange: onChangeFactory("Rarity"),
    },
    {
      title: "Booster",
      options: toOptions(boosterSet),
      active: activeFilters["Booster"] || "",
      onChange: onChangeFactory("Booster"),
    },
  ];
}
