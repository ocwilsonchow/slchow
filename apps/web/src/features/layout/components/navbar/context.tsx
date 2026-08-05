"use client";

import {
  createContext,
  type Dispatch,
  type RefObject,
  type SetStateAction,
  use,
} from "react";

export const SITE_NAV_PANEL_ID = "site-nav-panel";
export const SITE_NAV_TRIGGER_ID = "site-nav-trigger";

export type NavbarContextValue = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  toggle: () => void;
  navRef: RefObject<HTMLElement | null>;
  panelRef: RefObject<HTMLDivElement | null>;
  backdropRef: RefObject<HTMLButtonElement | null>;
  triggerRef: RefObject<HTMLButtonElement | null>;
  shouldReduceMotion: boolean;
};

export const NavbarContext = createContext<NavbarContextValue | null>(null);

export function useNavbarContext() {
  const context = use(NavbarContext);
  if (!context) {
    throw new Error("Navbar components must be used within Navbar.Root");
  }
  return context;
}
