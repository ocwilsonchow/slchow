"use client"

import { cn } from "@repo/ds"
import { Portal } from "@repo/ds/components/ui/portal"
import { PlusIcon } from "lucide-react"
import { HTMLMotionProps, motion } from "motion/react"
import { create } from "zustand"

export type NavbarState = {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

export const useNavbar = create<NavbarState>((set) => ({
  isOpen: false,
  setIsOpen: (isOpen) => set({ isOpen }),
}))

const Root = (props: HTMLMotionProps<"nav">) => {
  return (
    <motion.nav {...props} className={cn("fixed top-0 left-0 right-0 z-50")} />
  )
}

const Header = (props: HTMLMotionProps<"div">) => {
  return (
    <motion.div {...props} className={cn("flex items-center p-4")}></motion.div>
  )
}

const Trigger = (props: HTMLMotionProps<"button">) => {
  const { isOpen, setIsOpen } = useNavbar()

  return (
    <motion.button
      className={cn("p-2")}
      onClick={() => setIsOpen(!isOpen)}
      {...props}
    ></motion.button>
  )
}

const Content = (props: HTMLMotionProps<"div">) => {
  return (
    <Portal>
      <motion.div {...props}></motion.div>
    </Portal>
  )
}

export const Navbar = {
  Root,
  Header,
  Trigger,
  Content,
}

export const RenderNavbar = () => {
  return (
    <Navbar.Root>
      <Navbar.Header>
        <div></div>
      </Navbar.Header>
      <Navbar.Content></Navbar.Content>
    </Navbar.Root>
  )
}
