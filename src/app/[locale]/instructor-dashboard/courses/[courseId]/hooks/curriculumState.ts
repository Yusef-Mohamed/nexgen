import type { ISection } from "@/types";

export const getSectionId = (section: Pick<ISection, "sectionId" | "_id">) =>
  section.sectionId || section._id;

export function mergeSectionUpdate(sections: ISection[], updated: ISection, isEdit: boolean): ISection[] {
  if (!isEdit) return [...sections, { ...updated, sectionId: getSectionId(updated), lessons: updated.lessons || [] }];
  return sections.map((section) => getSectionId(section) === getSectionId(updated)
    ? { ...section, ...updated, sectionId: getSectionId(section), order: section.order, lessons: section.lessons }
    : section);
}

export function moveRelative<T>(items: T[], from: number, target: number, position: "above" | "below"): T[] {
  if (from < 0 || target < 0 || from >= items.length || target >= items.length || from === target) return items;
  const next = [...items];
  const [moved] = next.splice(from, 1);
  const targetAfterRemoval = target - (from < target ? 1 : 0);
  next.splice(targetAfterRemoval + (position === "below" ? 1 : 0), 0, moved);
  return next;
}
