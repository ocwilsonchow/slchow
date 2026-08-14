import type { Variants } from "motion/react"

export const listVariants: Variants = {
  hidden: {
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
  visible: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.225,
    },
  },
}

export const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    transition: {
      duration: 0.25,
    },
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5,
    },
  },
}

export const reducedListVariants: Variants = {
  hidden: { transition: { duration: 0 } },
  visible: { transition: { duration: 0 } },
}

export const reducedItemVariants: Variants = {
  hidden: { opacity: 1, transition: { duration: 0 } },
  visible: { opacity: 1, transition: { duration: 0 } },
}

export const contentVariants: Variants = {
  hidden: {
    height: 0,

    transition: {
      when: "afterChildren",
      staggerChildren: 0,
      staggerDirection: -1,
      type: "spring",
      stiffness: 600,
      damping: 60,
    },
  },
  visible: {
    height: "auto",

    transition: {
      delayChildren: 0.2,
      type: "spring",
      stiffness: 500,
      damping: 50,
    },
  },
}

export const reducedContentVariants: Variants = {
  hidden: { height: 0, transition: { duration: 0 } },
  visible: { height: "auto", transition: { duration: 0 } },
}

export const backdropVariants: Variants = {
  hidden: {
    opacity: 0,
    transition: {
      duration: 0.35,
      delay: 0.5,
    },
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.25,
    },
  },
}

export const reducedBackdropVariants: Variants = {
  hidden: {
    opacity: 0,
    transition: { duration: 0 },
  },
  visible: {
    opacity: 1,
    transition: { duration: 0 },
  },
}

export const triggerIconVariants: Variants = {
  hidden: {
    rotate: 0,
    transition: {
      delay: 0.25,
      ease: "easeIn",
    },
  },
  visible: {
    rotate: 135,
    transition: {
      ease: "easeOut",
    },
  },
}

export const reducedTriggerIconVariants: Variants = {
  hidden: {
    rotate: 0,
    transition: { duration: 0 },
  },
  visible: {
    rotate: 135,
    transition: { duration: 0 },
  },
}
