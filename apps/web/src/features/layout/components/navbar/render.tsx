"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Fragment } from "react";
import profilePicture from "@/assets/profile-pic.webp";
import { Link, usePathname } from "@/i18n/navigation";
import { LanguageSettings, ThemeSettings } from "../navbar-settings";
import { useNavbarContext } from "./context";
import { Navbar } from "./parts";

const PATH_TITLE_KEYS = {
  "/": "homePage",
  "/resume": "resume",
  "/works": "works",
  "/notes": "notes",
  "/contact": "contact",
} as const;

type NavItem =
  | {
      type: "link";
      href: "/" | "/resume" | "/notes" | "/works" | "/contact";
      labelKey: "home" | "resume" | "notes" | "works" | "contact";
    }
  | { type: "soon"; labelKey: "designs" };

const NAV_ITEMS: NavItem[] = [
  { type: "link", href: "/", labelKey: "home" },
  { type: "link", href: "/resume", labelKey: "resume" },
  { type: "link", href: "/notes", labelKey: "notes" },
  { type: "link", href: "/works", labelKey: "works" },
  { type: "soon", labelKey: "designs" },
  { type: "link", href: "/contact", labelKey: "contact" },
];

const SOCIAL_LINKS = [
  { href: "https://github.com/ocwilsonchow", label: "GitHub" },
  { href: "https://www.linkedin.com/in/wilsonslchow/", label: "LinkedIn" },
  { href: "https://www.instagram.com/duoengineers/", label: "Instagram" },
] as const;

function getPathTitleKey(pathname: string) {
  if (pathname in PATH_TITLE_KEYS) {
    return PATH_TITLE_KEYS[pathname as keyof typeof PATH_TITLE_KEYS];
  }
  if (pathname.startsWith("/notes/")) return "notes";
  if (pathname.startsWith("/works/")) return "works";
  return null;
}

function LanguageSettingsClose() {
  const { setOpen } = useNavbarContext();
  return <LanguageSettings onBeforeChange={() => setOpen(false)} />;
}

export function RenderNewNavbar() {
  const pathname = usePathname();
  const t = useTranslations("navigation");
  const tA11y = useTranslations("a11y");

  const pathTitleKey = getPathTitleKey(pathname);
  const pathLabel = pathTitleKey
    ? t(pathTitleKey)
    : pathname.replace(/^\//, "");

  return (
    <Navbar.Root>
      <Navbar.Backdrop />
      <Navbar.Frame>
        <Navbar.Content>
          <Navbar.StaggerList className="p-5">
            {NAV_ITEMS.map((item) => (
              <Navbar.StaggerItem key={item.labelKey}>
                {item.type === "link" ? (
                  <Navbar.Link href={item.href}>{t(item.labelKey)}</Navbar.Link>
                ) : (
                  <span className="block py-0.5 font-semibold text-base text-content-body-on-popover">
                    {t(item.labelKey)} ({t("comingSoon")})
                  </span>
                )}
              </Navbar.StaggerItem>
            ))}
          </Navbar.StaggerList>
          <Navbar.StaggerList className="p-5 space-y-3">
            <Navbar.StaggerItem>
              <ThemeSettings />
            </Navbar.StaggerItem>
            <Navbar.StaggerItem>
              <LanguageSettingsClose />
            </Navbar.StaggerItem>
            <Navbar.StaggerItem className="space-y-1">
              <div className="text-xs text-content-body-on-popover mt-1.5">
                {t("socials")}
              </div>
              <div className="flex items-center flex-wrap gap-x-2">
                {SOCIAL_LINKS.map((social, index) => (
                  <Fragment key={social.href}>
                    {index > 0 ? (
                      <div aria-hidden className="text-content-body-on-popover">
                        /
                      </div>
                    ) : null}
                    <Link
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-content-ink-on-popover"
                    >
                      {social.label}
                    </Link>
                  </Fragment>
                ))}
              </div>
            </Navbar.StaggerItem>
            <div className="h-3" />
          </Navbar.StaggerList>
        </Navbar.Content>
        <Navbar.Trigger>
          <div className="flex items-center justify-center gap-4">
            <Image
              src={profilePicture}
              alt={tA11y("profileAlt")}
              width={28}
              height={28}
              sizes="28px"
              priority
              className="rounded-full"
            />
            <div className="flex items-center gap-1.5 font-semibold">
              <div>Wilson</div>
              <div aria-hidden className="text-content-body-on-popover text-xs">
                /
              </div>
              <div className="text-content-body-on-popover capitalize">
                {pathLabel}
              </div>
            </div>
          </div>
        </Navbar.Trigger>
      </Navbar.Frame>
    </Navbar.Root>
  );
}
