import { atom } from "jotai";
import { ACTIVE_SECTION } from "./constants";

export const searchAtom = atom<string | undefined>(undefined);
export const isNavStuckAtom = atom(false);
export const isSearchStuckAtom = atom(false);
export const activeSectionAtom = atom<
  (typeof ACTIVE_SECTION)[keyof typeof ACTIVE_SECTION]
>(ACTIVE_SECTION.yourGuilds);
