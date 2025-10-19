import React, { createContext, useContext, useMemo, useState } from "react";

// Types
export type ItemId = "pants" | "bowTie" | "glasses";
export type Item = {
  id: ItemId;
  name: string;
  price: number;
  // images you already have or will add later
  shopPreview?: any;        // small icon for shop list
  pigSpriteEquipped?: any;  // full pig sprite when equipped (optional)
};

type PigState = {
  tokens: number;
  owned: Set<ItemId>;
  equipped: Set<ItemId>;
  catalog: Item[];
  earnTokens: (n: number) => void;
  buy: (id: ItemId) => boolean;         // returns true if bought
  equip: (id: ItemId) => void;
  unequip: (id: ItemId) => void;
};

const PigCtx = createContext<PigState | null>(null);

export function PigProvider({ children }: { children: React.ReactNode }) {
  // start with a few tokens for testing
  const [tokens, setTokens] = useState<number>(8);
  const [owned, setOwned]   = useState<Set<ItemId>>(new Set());
  const [equipped, setEquipped] = useState<Set<ItemId>>(new Set());
  const pantsShopItem     = require("../../assets/images/pantsShopItem.png");
  const pigPantsEquip     = require("../../assets/images/pigPantsEquipped.png");

  const bowTieShopItem    = require("../../assets/images/bowTieShopItem.png");
  const pigBowTieEquipped = require("../../assets/images/pigbowTieEquipped.png");

  const glassesShopItem   = require("../../assets/images/glassesShopItem.png");
  const pigGlassesEquipped= require("../../assets/images/pigGlassesEquipped.png");

  // catalog
  const catalog: Item[] = useMemo(() => [
    { id: "pants",   name: "Pants",    price: 5, shopPreview: pantsShopItem,   pigSpriteEquipped: pigPantsEquip },
    { id: "bowTie",  name: "Bow Tie",  price: 7, shopPreview: bowTieShopItem,  pigSpriteEquipped: pigBowTieEquipped },
    { id: "glasses", name: "Glasses",  price: 6, shopPreview: glassesShopItem, pigSpriteEquipped: pigGlassesEquipped },
  ], []);

  const earnTokens = (n: number) => setTokens(t => t + n);

  const buy = (id: ItemId) => {
    const item = catalog.find(i => i.id === id);
    if (!item) return false;
    if (owned.has(id)) return true;      // already own
    if (tokens < item.price) return false;
    setTokens(t => t - item.price);
    setOwned(prev => new Set(prev).add(id));
    return true;
  };

  const equip = (id: ItemId) => {
  if (!owned.has(id)) return;
  // Only one equipped at a time
  setEquipped(new Set([id]));
};

  const unequip = (id: ItemId) => {
    setEquipped(prev => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const value: PigState = {
    tokens, owned, equipped, catalog,
    earnTokens, buy, equip, unequip
  };

  return <PigCtx.Provider value={value}>{children}</PigCtx.Provider>;
}

export const usePig = () => {
  const v = useContext(PigCtx);
  if (!v) throw new Error("usePig must be used inside <PigProvider>");
  return v;
};
