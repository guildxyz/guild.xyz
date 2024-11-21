import { atom } from "jotai";

export const searchAtom = atom<string | undefined>(undefined);
export const isNavStuckAtom = atom(false);
export const isSearchStuckAtom = atom(false);
