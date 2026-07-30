export const communityLayoutVariants = [
  "hub",
  "rooms",
  "board",
  "focus",
] as const;

export const communityContentVariants = [
  "cards",
  "rows",
  "threads",
  "story",
] as const;

export type CommunityLayoutVariant = (typeof communityLayoutVariants)[number];
export type CommunityContentVariant = (typeof communityContentVariants)[number];

export const defaultCommunityLayout: CommunityLayoutVariant = "hub";
export const defaultCommunityContent: CommunityContentVariant = "cards";

export const communityLayoutOptions: {
  value: CommunityLayoutVariant;
  labelKey: string;
}[] = [
  { value: "hub", labelKey: "layoutHub" },
  { value: "rooms", labelKey: "layoutRooms" },
  { value: "board", labelKey: "layoutBoard" },
  { value: "focus", labelKey: "layoutFocus" },
];

export const communityContentOptions: {
  value: CommunityContentVariant;
  labelKey: string;
}[] = [
  { value: "cards", labelKey: "contentCards" },
  { value: "rows", labelKey: "contentRows" },
  { value: "threads", labelKey: "contentThreads" },
  { value: "story", labelKey: "contentStory" },
];

const resolveVariant = <Variant extends string>(
  value: string | null,
  variants: readonly Variant[],
  fallback: Variant,
): Variant => {
  return variants.includes(value as Variant) ? (value as Variant) : fallback;
};

export const resolveCommunityLayout = (
  value: string | null,
): CommunityLayoutVariant =>
  resolveVariant(value, communityLayoutVariants, defaultCommunityLayout);

export const resolveCommunityContent = (
  value: string | null,
): CommunityContentVariant =>
  resolveVariant(value, communityContentVariants, defaultCommunityContent);
