"use client";

import { useState, Suspense, lazy } from "react";
import {
  ArrowRight,
  BookOpen,
  Check,
  Copy,
  Gift,
  Shield,
  Sparkles,
  Swords,
  Tag,
  Trophy,
} from "lucide-react";
import Link from "next/link";
import { useMessages } from "next-intl";
import { VideoFeature } from "@/components/home/VideoFeature";
import { LatestGuidesAccordion } from "@/components/home/LatestGuidesAccordion";
import { NativeBannerAd, AdBanner } from "@/components/ads";
import { getPreferredMobileBannerSelection } from "@/components/ads/mobileAdConfigs";
import { scrollToSection } from "@/lib/scrollToSection";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import type { ContentItemWithType } from "@/lib/getLatestArticles";

// Lazy load heavy components
const HeroStats = lazy(() => import("@/components/home/HeroStats"));
const FAQSection = lazy(() => import("@/components/home/FAQSection"));
const CTASection = lazy(() => import("@/components/home/CTASection"));

// Loading placeholder
const LoadingPlaceholder = ({ height = "h-64" }: { height?: string }) => (
  <div className={`${height} animate-pulse rounded-xl border border-border bg-white/5`} />
);

// 统一模块头部：eyebrow + 装饰图标 + 标题 + 副标题 + 简介
function ModuleHeader({
  icon,
  eyebrow,
  title,
  subtitle,
  intro,
}: {
  icon: React.ReactNode;
  eyebrow: string;
  title: string;
  subtitle: string;
  intro?: string;
}) {
  return (
    <div className="scroll-reveal mb-8 text-center md:mb-12">
      <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[hsl(var(--nav-theme)/0.3)] bg-[hsl(var(--nav-theme)/0.1)] px-3 py-1.5 md:px-4 md:py-2">
        <span className="text-[hsl(var(--nav-theme-light))]">{icon}</span>
        <span className="text-xs font-medium md:text-sm">{eyebrow}</span>
      </div>
      <h2 className="mb-3 text-3xl font-bold md:mb-4 md:text-5xl">{title}</h2>
      <p className="mx-auto max-w-3xl text-base text-muted-foreground md:text-lg">
        {subtitle}
      </p>
      {intro ? (
        <p className="mx-auto mt-3 max-w-3xl text-sm text-muted-foreground/80 md:text-base">
          {intro}
        </p>
      ) : null}
    </div>
  );
}

// Tier 徽章配色（主题色优先，辅以语义色，无硬编码 hex）
const TIER_CLASS: Record<string, string> = {
  SS: "bg-[hsl(var(--nav-theme)/0.25)] border-[hsl(var(--nav-theme)/0.6)] text-[hsl(var(--nav-theme-light))]",
  S: "bg-orange-500/15 border-orange-500/40 text-orange-300",
  A: "bg-blue-500/15 border-blue-500/40 text-blue-300",
  B: "bg-zinc-500/15 border-zinc-500/40 text-zinc-300",
  C: "bg-zinc-700/40 border-zinc-600/50 text-zinc-400",
  Awakening: "bg-purple-500/15 border-purple-500/40 text-purple-300",
};

interface HomePageClientProps {
  latestArticles: ContentItemWithType[];
  locale: string;
}

export default function HomePageClient({
  latestArticles,
  locale,
}: HomePageClientProps) {
  const t = useMessages() as any;
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.animefinalquestwiki.wiki";
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const mobileBannerAd = getPreferredMobileBannerSelection();

  const copyCode = (code: string) => {
    try {
      navigator.clipboard?.writeText(code);
    } catch {
      /* clipboard 不可用时静默忽略 */
    }
    setCopiedCode(code);
    window.setTimeout(() => setCopiedCode(null), 1500);
  };

  // Structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "Anime Final Quest Wiki",
        description:
          "Complete Anime Final Quest Wiki covering codes, weapons, gear, builds, dungeons, bosses, runes, quests, and beginner tips for the Roblox anime dungeon crawler.",
        image: {
          "@type": "ImageObject",
          url: `${siteUrl}/images/hero.webp`,
          width: 1920,
          height: 1080,
          caption: "Anime Final Quest - Roblox Anime Dungeon Crawler",
        },
        potentialAction: {
          "@type": "SearchAction",
          target: `${siteUrl}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: "Anime Final Quest Wiki",
        alternateName: "Anime Final Quest",
        url: siteUrl,
        logo: {
          "@type": "ImageObject",
          url: `${siteUrl}/android-chrome-512x512.png`,
          width: 512,
          height: 512,
        },
        image: {
          "@type": "ImageObject",
          url: `${siteUrl}/images/hero.webp`,
          width: 1920,
          height: 1080,
          caption: "Anime Final Quest Wiki - Roblox Anime Dungeon Crawler",
        },
        sameAs: [
          "https://www.roblox.com/games/100744519298647/Anime-Final-Quest",
          "https://www.roblox.com/communities/34258454/Anime-Final-Quest",
          "https://discord.com/invite/finalquest",
          "https://www.youtube.com/@CELLGAMESROBLOX",
        ],
      },
      {
        "@type": "VideoGame",
        name: "Anime Final Quest",
        gamePlatform: ["Roblox"],
        applicationCategory: "Game",
        genre: ["Anime", "Dungeon Crawler", "RPG", "Adventure"],
        numberOfPlayers: {
          minValue: 1,
        },
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
          url: "https://www.roblox.com/games/100744519298647/Anime-Final-Quest",
        },
      },
      {
        "@type": "VideoObject",
        name: "A Complete Progression Guide to Anime Final Quest",
        description:
          "Detailed Anime Final Quest progression guide covering weapons, gear, runes, dungeons, bosses, and quests for all player levels.",
        thumbnailUrl: `${siteUrl}/images/hero.webp`,
        embedUrl: "https://www.youtube.com/embed/vYJ1vObRTjM",
        url: "https://www.youtube.com/watch?v=vYJ1vObRTjM",
      },
    ],
  };

  const codes = t.modules.animeFinalQuestCodes;
  const tierList = t.modules.animeFinalQuestTierList;
  const beginner = t.modules.animeFinalQuestBeginnerGuide;
  const weapons = t.modules.animeFinalQuestWeaponsAndGear;

  const TOOL_SECTIONS = ["codes", "tier-list", "beginner-guide", "weapons-and-gear"];

  return (
    <div className="home-shell min-h-screen bg-background text-foreground">
      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* 广告位 1: 顶部固定横幅 */}
      <div className="sticky top-20 z-20 border-b border-border py-2">
        <AdBanner type="banner-320x50" adKey={process.env.NEXT_PUBLIC_AD_MOBILE_320X50} />
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 pt-24 pb-14 md:pt-32 md:pb-20">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-8 text-center scroll-reveal">
            {/* Badge */}
            <div
              className="mb-4 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 md:px-4 md:py-2
                          border-[hsl(var(--nav-theme)/0.3)] bg-[hsl(var(--nav-theme)/0.1)] md:mb-6"
            >
              <Sparkles className="h-4 w-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-xs font-medium md:text-sm">{t.hero.badge}</span>
            </div>

            {/* Title */}
            <h1 className="mb-4 text-4xl font-bold leading-[1.05] sm:text-5xl md:mb-6 md:text-7xl">
              {t.hero.title}
            </h1>

            {/* Description */}
            <p className="mx-auto mb-8 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg md:mb-10 md:max-w-3xl md:text-2xl">
              {t.hero.description}
            </p>

            {/* CTA Buttons */}
            <div className="mb-10 flex flex-col justify-center gap-3 sm:flex-row md:mb-12 md:gap-4">
              <button
                onClick={() => scrollToSection("codes")}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[hsl(var(--nav-theme))]
                           px-6 py-3.5 font-semibold text-base text-white transition-colors
                           hover:bg-[hsl(var(--nav-theme)/0.9)] md:px-8 md:py-4 md:text-lg"
              >
                <Gift className="h-5 w-5" />
                {t.hero.getFreeCodesCTA}
              </button>
              <a
                href="https://www.roblox.com/games/100744519298647/Anime-Final-Quest"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-border
                           px-6 py-3.5 font-semibold text-base transition-colors hover:bg-white/10
                           md:px-8 md:py-4 md:text-lg"
              >
                {t.hero.playOnRobloxCTA}
                <ArrowRight className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Stats */}
          <Suspense fallback={<LoadingPlaceholder height="h-32" />}>
            <HeroStats stats={Object.values(t.hero.stats)} />
          </Suspense>
        </div>
      </section>

      {/* Video Section */}
      <section className="px-4 py-10 md:py-12">
        <div className="scroll-reveal container mx-auto max-w-5xl">
          <div className="relative overflow-hidden rounded-2xl">
            <VideoFeature
              videoId="vYJ1vObRTjM"
              title="A Complete Progression Guide to Anime Final Quest"
            />
          </div>
        </div>
      </section>

      {/* Tools Grid - 4 Navigation Cards（视频区之后、Latest Updates 之前）*/}
      <section className="bg-white/[0.02] px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="mb-8 text-center scroll-reveal md:mb-12">
            <h2 className="mb-3 text-3xl font-bold md:mb-4 md:text-5xl">
              {t.tools.title}{" "}
              <span className="text-[hsl(var(--nav-theme-light))]">
                {t.tools.titleHighlight}
              </span>
            </h2>
            <p className="text-base text-muted-foreground md:text-lg">
              {t.tools.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            {t.tools.cards.map((card: any, index: number) => (
              <button
                key={index}
                onClick={() => scrollToSection(TOOL_SECTIONS[index])}
                className="scroll-reveal group cursor-pointer rounded-xl border border-border bg-card p-4 text-left
                           transition-all duration-300 hover:border-[hsl(var(--nav-theme)/0.5)]
                           hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)] md:p-6"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div
                  className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg
                             bg-[hsl(var(--nav-theme)/0.1)] transition-colors
                             group-hover:bg-[hsl(var(--nav-theme)/0.2)] md:mb-4 md:h-12 md:w-12"
                >
                  <DynamicIcon
                    name={card.icon}
                    className="h-5 w-5 text-[hsl(var(--nav-theme-light))] md:h-6 md:w-6"
                  />
                </div>
                <h3 className="mb-1.5 text-sm font-semibold md:text-base">{card.title}</h3>
                <p className="text-sm text-muted-foreground">{card.description}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Updates Section */}
      <LatestGuidesAccordion articles={latestArticles} locale={locale} max={12} />

      {/* 广告位 2: 首屏内容之后再加载广告 */}
      <NativeBannerAd adKey={process.env.NEXT_PUBLIC_AD_NATIVE_BANNER || ""} />

      {/* 广告位 3: 移动端优先使用方形，桌面端保留横幅 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-728x90"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90}
        className="hidden md:flex"
      />

      {/* Module 1: Codes */}
      <section id="codes" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            icon={<Gift className="h-4 w-4 md:h-5 md:w-5" />}
            eyebrow={codes.eyebrow}
            title={codes.title}
            subtitle={codes.subtitle}
            intro={codes.intro}
          />

          {/* Group Requirement 提示 */}
          <div className="scroll-reveal mb-8 rounded-xl border border-[hsl(var(--nav-theme)/0.3)] bg-[hsl(var(--nav-theme)/0.05)] p-4 md:mb-10 md:p-6">
            <div className="flex items-start gap-3">
              <Tag className="mt-0.5 h-5 w-5 flex-shrink-0 text-[hsl(var(--nav-theme-light))]" />
              <p className="text-sm text-muted-foreground md:text-base">{codes.groupNote}</p>
            </div>
          </div>

          {/* Active Codes */}
          <div className="scroll-reveal grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
            {codes.activeCodes.map((c: any, i: number) => (
              <div
                key={i}
                className="flex flex-col rounded-xl border border-border bg-white/5 p-5 transition-colors hover:border-[hsl(var(--nav-theme)/0.5)] md:p-6"
              >
                <div className="mb-4 flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/15 px-2.5 py-1 text-xs font-medium text-emerald-300">
                    <Check className="h-3 w-3" />
                    {c.status}
                  </span>
                  <span className="rounded-full border border-[hsl(var(--nav-theme)/0.3)] bg-[hsl(var(--nav-theme)/0.1)] px-2.5 py-1 text-xs">
                    {c.tag}
                  </span>
                </div>

                {/* Code + Copy */}
                <div className="mb-3 flex items-center justify-between gap-3 rounded-lg border border-border bg-background/60 px-4 py-3">
                  <code className="font-mono text-base font-bold tracking-wide text-foreground md:text-lg">
                    {c.code}
                  </code>
                  <button
                    type="button"
                    onClick={() => copyCode(c.code)}
                    className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-xs font-medium transition-colors hover:bg-white/10"
                    aria-label={`Copy code ${c.code}`}
                  >
                    {copiedCode === c.code ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-[hsl(var(--nav-theme-light))]" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        Copy
                      </>
                    )}
                  </button>
                </div>

                <p className="mb-1 text-sm font-semibold text-[hsl(var(--nav-theme-light))]">
                  {c.reward}
                </p>
                <p className="text-xs text-muted-foreground">{c.requirement}</p>
              </div>
            ))}
          </div>

          {/* Redeem Steps */}
          <div className="scroll-reveal mt-8 md:mt-10">
            <h3 className="mb-4 flex items-center gap-2 text-center justify-center text-lg font-bold">
              <BookOpen className="h-5 w-5 text-[hsl(var(--nav-theme-light))]" />
              How to Redeem Anime Final Quest Codes
            </h3>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
              {codes.redeemSteps.map((step: string, i: number) => (
                <div
                  key={i}
                  className="flex items-start gap-3 rounded-xl border border-border bg-white/5 p-4"
                >
                  <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border-2 border-[hsl(var(--nav-theme)/0.5)] bg-[hsl(var(--nav-theme)/0.2)] text-sm font-bold text-[hsl(var(--nav-theme-light))]">
                    {i + 1}
                  </span>
                  <p className="pt-0.5 text-sm text-muted-foreground">{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Expired Codes */}
          <div className="scroll-reveal mt-8 rounded-xl border border-border bg-white/[0.02] p-5 md:mt-10 md:p-6">
            <div className="mb-3 flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-600/50 bg-zinc-700/30 px-2.5 py-1 text-xs font-medium text-zinc-400">
                Expired
              </span>
              <h3 className="font-bold">Expired Code Check</h3>
            </div>
            <div className="mb-3 flex flex-wrap gap-2">
              {codes.expiredCodes.map((code: string, i: number) => (
                <span
                  key={i}
                  className="rounded-md border border-border bg-background/40 px-2.5 py-1 font-mono text-xs text-muted-foreground line-through"
                >
                  {code}
                </span>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">{codes.expiredNote}</p>
          </div>
        </div>
      </section>

      {/* 广告位 4: 第一模块之后的阅读停顿位 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-468x60"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_468X60}
        className="hidden md:flex"
      />

      {/* Module 2: Tier List */}
      <section id="tier-list" className="scroll-mt-24 bg-white/[0.02] px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            icon={<Trophy className="h-4 w-4 md:h-5 md:w-5" />}
            eyebrow={tierList.eyebrow}
            title={tierList.title}
            subtitle={tierList.subtitle}
            intro={tierList.intro}
          />

          <div className="space-y-8 md:space-y-10">
            {tierList.categories.map((cat: any, ci: number) => (
              <div key={ci} className="scroll-reveal">
                <h3 className="mb-4 flex items-center gap-2 text-xl font-bold md:text-2xl">
                  <span className="text-[hsl(var(--nav-theme-light))]">
                    {String(ci + 1).padStart(2, "0")}
                  </span>
                  {cat.name}
                </h3>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
                  {cat.tiers.map((tier: any, ti: number) => (
                    <div
                      key={ti}
                      className="rounded-xl border border-border bg-white/5 p-4 md:p-5"
                    >
                      <span
                        className={`mb-3 inline-flex items-center justify-center rounded-md border px-3 py-1 text-sm font-bold ${TIER_CLASS[tier.tier] || TIER_CLASS.A}`}
                      >
                        {tier.tier}
                      </span>
                      <ul className="space-y-2">
                        {tier.entries.map((e: any, ei: number) => (
                          <li key={ei} className="flex flex-col">
                            <span className="font-semibold text-foreground">{e.name}</span>
                            <span className="text-xs text-muted-foreground">
                              {e.role || e.effect}
                              {e.obtainedFrom ? ` · ${e.obtainedFrom}` : ""}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 3: Beginner Guide */}
      <section id="beginner-guide" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            icon={<BookOpen className="h-4 w-4 md:h-5 md:w-5" />}
            eyebrow={beginner.eyebrow}
            title={beginner.title}
            subtitle={beginner.subtitle}
            intro={beginner.intro}
          />

          <div className="scroll-reveal space-y-3 md:space-y-4">
            {beginner.steps.map((step: any, index: number) => (
              <div
                key={index}
                className="flex gap-3 rounded-xl border border-border bg-white/5 p-4 transition-colors hover:border-[hsl(var(--nav-theme)/0.5)] md:gap-4 md:p-6"
              >
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-[hsl(var(--nav-theme)/0.5)] bg-[hsl(var(--nav-theme)/0.2)] md:h-12 md:w-12">
                  <span className="text-base font-bold text-[hsl(var(--nav-theme-light))] md:text-xl">
                    {index + 1}
                  </span>
                </div>
                <div>
                  <h3 className="mb-1.5 text-lg font-bold md:mb-2 md:text-xl">{step.title}</h3>
                  <p className="mb-1.5 text-sm text-muted-foreground md:text-base">
                    {step.action}
                  </p>
                  <p className="text-xs text-muted-foreground/70 md:text-sm">
                    <span className="font-medium text-[hsl(var(--nav-theme-light))]">
                      Why it matters:
                    </span>{" "}
                    {step.whyItMatters}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 广告位 6: 移动端横幅 */}
      {mobileBannerAd && (
        <AdBanner
          type={mobileBannerAd.type}
          adKey={mobileBannerAd.adKey}
          className="md:hidden"
        />
      )}

      {/* Module 4: Weapons and Gear */}
      <section id="weapons-and-gear" className="scroll-mt-24 bg-white/[0.02] px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            icon={<Swords className="h-4 w-4 md:h-5 md:w-5" />}
            eyebrow={weapons.eyebrow}
            title={weapons.title}
            subtitle={weapons.subtitle}
            intro={weapons.intro}
          />

          <div className="scroll-reveal grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
            {weapons.items.map((item: any, index: number) => (
              <div
                key={index}
                className="flex flex-col rounded-xl border border-border bg-white/5 p-5 transition-colors hover:border-[hsl(var(--nav-theme)/0.5)] md:p-6"
              >
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <h3 className="flex items-center gap-2 text-lg font-bold">
                    {item.category === "Weapon" ? (
                      <Swords className="h-4 w-4 text-[hsl(var(--nav-theme-light))]" />
                    ) : (
                      <Shield className="h-4 w-4 text-[hsl(var(--nav-theme-light))]" />
                    )}
                    {item.name}
                  </h3>
                  <span className="rounded-full border border-[hsl(var(--nav-theme)/0.3)] bg-[hsl(var(--nav-theme)/0.1)] px-2.5 py-0.5 text-xs font-medium">
                    {item.rarity}
                  </span>
                </div>

                <div className="mb-3 flex flex-wrap gap-2 text-xs">
                  <span className="rounded-md border border-border bg-background/50 px-2 py-1">
                    {item.category}
                  </span>
                  <span className="rounded-md border border-border bg-background/50 px-2 py-1">
                    Tier: {item.tier}
                  </span>
                </div>

                <dl className="space-y-2 text-sm">
                  <div>
                    <dt className="font-semibold text-[hsl(var(--nav-theme-light))]">Role</dt>
                    <dd className="text-muted-foreground">{item.role}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-[hsl(var(--nav-theme-light))]">
                      Damage Style
                    </dt>
                    <dd className="text-muted-foreground">{item.damageStyle}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-[hsl(var(--nav-theme-light))]">Utility</dt>
                    <dd className="text-muted-foreground">{item.utility}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-[hsl(var(--nav-theme-light))]">
                      Progression Value
                    </dt>
                    <dd className="text-muted-foreground">{item.progressionValue}</dd>
                  </div>
                </dl>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <FAQSection
          title={t.faq.title}
          titleHighlight={t.faq.titleHighlight}
          subtitle={t.faq.subtitle}
          questions={t.faq.questions}
        />
      </Suspense>

      {/* CTA Section */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <CTASection
          title={t.cta.title}
          description={t.cta.description}
          joinCommunity={t.cta.joinCommunity}
          joinGame={t.cta.joinGame}
        />
      </Suspense>

      {/* Ad Banner 3 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-728x90"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90}
        className="hidden md:flex"
      />

      {/* Footer */}
      <footer className="border-t border-border bg-white/[0.02]">
        <div className="container mx-auto px-4 py-12">
          <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-4">
            {/* Brand */}
            <div>
              <h3 className="mb-4 text-xl font-bold text-[hsl(var(--nav-theme-light))]">
                {t.footer.title}
              </h3>
              <p className="text-sm text-muted-foreground">{t.footer.description}</p>
            </div>

            {/* Community - External Links Only */}
            <div>
              <h4 className="mb-4 font-semibold">{t.footer.community}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="https://discord.com/invite/finalquest"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground transition hover:text-[hsl(var(--nav-theme-light))]"
                  >
                    {t.footer.discord}
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.youtube.com/@CELLGAMESROBLOX"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground transition hover:text-[hsl(var(--nav-theme-light))]"
                  >
                    {t.footer.youtube}
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.roblox.com/communities/34258454/Anime-Final-Quest"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground transition hover:text-[hsl(var(--nav-theme-light))]"
                  >
                    {t.footer.robloxGroup}
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.roblox.com/games/100744519298647/Anime-Final-Quest"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground transition hover:text-[hsl(var(--nav-theme-light))]"
                  >
                    {t.footer.robloxGame}
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal - Internal Routes Only */}
            <div>
              <h4 className="mb-4 font-semibold">{t.footer.legal}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/about"
                    className="text-muted-foreground transition hover:text-[hsl(var(--nav-theme-light))]"
                  >
                    {t.footer.about}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy-policy"
                    className="text-muted-foreground transition hover:text-[hsl(var(--nav-theme-light))]"
                  >
                    {t.footer.privacy}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms-of-service"
                    className="text-muted-foreground transition hover:text-[hsl(var(--nav-theme-light))]"
                  >
                    {t.footer.terms}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/copyright"
                    className="text-muted-foreground transition hover:text-[hsl(var(--nav-theme-light))]"
                  >
                    {t.footer.copyrightNotice}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Copyright */}
            <div>
              <p className="mb-2 text-sm text-muted-foreground">{t.footer.copyright}</p>
              <p className="text-xs text-muted-foreground">{t.footer.disclaimer}</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
