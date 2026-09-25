export type PageRole = 'home' | 'hub' | 'category' | 'product' | 'service' | 'tool' | 'article' | 'legal' | 'mobile-landing';
export type IndexDirective = 'index, follow' | 'noindex, follow' | 'noindex, nofollow';
export type FeedCategory = 'product' | 'service' | 'article' | 'news' | 'update';
export type MobilePrimaryAction = 'call' | 'navigate' | 'buy' | 'form' | 'scan' | 'chat' | 'share';
export type MobileSERPFeature = 'local-pack' | 'image-pack' | 'video-pack' | 'shopping' | 'faq-rich' | 'howto-rich' | 'sitelinks' | 'knowledge-panel' | 'ai-overview';

export interface SemanticTriple {
  readonly subject: string;
  readonly predicate: string;
  readonly object: string;
}

export interface SeoEntityRef {
  readonly id: string;
  readonly name: string;
  readonly type: 'Organization' | 'Person' | 'Product' | 'Service' | 'SoftwareApplication';
  readonly sameAs: readonly string[];
}

export interface ImageAsset {
  readonly url: string;
  readonly alt: string;
  readonly caption?: string;
  readonly width: number;
  readonly height: number;
  readonly mimeType: 'image/webp' | 'image/avif' | 'image/jpeg' | 'image/png' | 'image/svg+xml';
  readonly mobileSrcSet?: readonly { readonly srcset: string; readonly media: string }[];
}

export interface VideoAsset {
  readonly url: string;
  readonly thumbnailUrl: string;
  readonly title: string;
  readonly description: string;
  readonly duration: string;
  readonly uploadDate: string;
  readonly transcriptUrl?: string;
  readonly mobileOptimized?: boolean;
}

export interface MobileConfig {
  readonly viewport: string;
  readonly primaryAction: MobilePrimaryAction;
  readonly secondaryActions: readonly MobilePrimaryAction[];
  readonly bottomNavEnabled: boolean;
  readonly thumbZoneCtaPosition: 'bottom-right' | 'bottom-center' | 'bottom-full';
  readonly touchTargetsValidated: boolean;
  readonly horizontalScrollFree: boolean;
  readonly thumbSafeHeroAnswer: boolean;
  readonly voiceQueryPatterns: readonly string[];
  readonly localIntentKeywords: readonly string[];
  readonly serpFeatures: readonly MobileSERPFeature[];
  readonly pwaInstallable: boolean;
  readonly serviceWorkerRoute: `/${string}`;
  readonly manifestRoute: `/${string}`;
  readonly appLinkRoute?: `/${string}`;
}

export interface MobileCwvBudget {
  readonly lcpMs: number;
  readonly inpMs: number;
  readonly cls: number;
  readonly ttfbMs: number;
  readonly fcpMs: number;
  readonly tbtMs: number;
  readonly htmlKb: number;
  readonly jsKb: number;
  readonly cssKb: number;
  readonly totalMb: number;
}

export interface SeoPageRecord {
  readonly route: `/${string}` | '/';
  readonly locale: string;
  readonly role: PageRole;
  readonly indexDirective: IndexDirective;
  readonly canonicalRoute: `/${string}` | '/';
  readonly title: string;
  readonly metaDescription: string;
  readonly h1: string;
  readonly primaryIntent: string;
  readonly primaryEntity: SeoEntityRef;
  readonly semanticTriples: readonly SemanticTriple[];
  readonly heroAnswerEngine: string;
  readonly publishedAt: string;
  readonly modifiedAt: string;
  readonly llmSubGraphRoute?: `/llms/${string}.md`;
  readonly breadcrumbs: readonly { readonly name: string; readonly item: string }[];

  readonly feedCategory?: FeedCategory;
  readonly topicCluster?: `/${string}`;
  readonly pillarRoute?: `/${string}`;
  readonly hreflangGroup?: string;
  readonly openGraphImage?: ImageAsset;
  readonly images?: readonly ImageAsset[];
  readonly video?: VideoAsset;
  readonly author?: SeoEntityRef;
  readonly reviewedBy?: SeoEntityRef;
  readonly reviewDate?: string;
  readonly aggregateRating?: { readonly value: number; readonly count: number; readonly best: number; readonly worst: number };
  readonly speakableSelectors?: readonly string[];
  readonly redirectFrom?: readonly `/${string}`[];

  readonly mobile: MobileConfig;
  readonly mobileCwvBudget: MobileCwvBudget;
  readonly mobileSubGraphRoute?: `/llms/mobile/${string}.md`;
  readonly mobileVoiceQuery?: string;
  readonly mobilePrimaryAction?: MobilePrimaryAction;
  readonly mobileDeepLink?: string;
  readonly ampCompatible?: boolean;
  readonly mobileFirstContentParity: boolean;
}
