import { useState, useCallback, useMemo } from "react";
import { ISection, ILesson } from "@/types";

export type DragType = "section" | "lesson";
export type DropPosition = "above" | "below" | "inside";

export interface DropTarget {
  id: string;
  type: DragType;
  position: DropPosition;
}

export interface UseReorderProps {
  sections: ISection[];
  onSectionsReorder: (newSections: ISection[]) => void;
  onOrderChanged?: () => void;
}

export const useReorder = ({
  sections,
  onSectionsReorder,
  onOrderChanged,
}: UseReorderProps) => {
  // Drag and drop state
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [draggingType, setDraggingType] = useState<DragType | null>(null);
  const [dropTarget, setDropTarget] = useState<DropTarget | null>(null);

  // Create a map of descendant relationships for preventing invalid drops
  const descendantsMap = useMemo(() => {
    const map = new Map<string, Set<string>>();

    const processSection = (section: ISection, ancestors: Set<string>) => {
      const sectionId = section.sectionId || section._id || "";
      if (sectionId) {
        map.set(sectionId, new Set(ancestors));
        const newAncestors = new Set(ancestors);
        newAncestors.add(sectionId);

        // Process lessons in this section
        if (section.lessons) {
          section.lessons.forEach((lesson) => {
            if (lesson._id) {
              map.set(lesson._id, new Set(newAncestors));
            }
          });
        }
      }
    };

    sections.forEach((section) => processSection(section, new Set()));
    return map;
  }, [sections]);

  // Drag and drop handlers
  const handleDragStart = useCallback(
    (e: React.DragEvent, id: string, type: DragType) => {
      console.log("Drag start:", { id, type });
      setDraggingId(id);
      setDraggingType(type);
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/plain", id);

      // Create a ghost image
      const draggedEl = e.currentTarget as HTMLElement;
      const ghost = draggedEl.cloneNode(true) as HTMLElement;
      ghost.style.opacity = "0.5";
      ghost.style.position = "absolute";
      ghost.style.top = "-1000px";
      ghost.style.pointerEvents = "none";
      ghost.style.zIndex = "9999";
      ghost.style.backgroundColor = "rgba(59, 130, 246, 0.1)";
      ghost.style.border = "2px solid rgba(59, 130, 246, 0.5)";
      ghost.style.borderRadius = "8px";
      document.body.appendChild(ghost);
      e.dataTransfer.setDragImage(ghost, 10, 10);

      // Clean up the ghost image after drag ends
      setTimeout(() => {
        if (document.body.contains(ghost)) {
          document.body.removeChild(ghost);
        }
      }, 0);

      // Add dragging class to the dragged element
      draggedEl.classList.add(
        "opacity-50",
        "scale-95",
        "ring-2",
        "ring-blue-400"
      );
    },
    []
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      e.dataTransfer.dropEffect = "move";

      // Use closest to find the nearest element with the required data attributes
      const target = (e.target as HTMLElement).closest(
        "[data-section-id], [data-lesson-id]"
      ) as HTMLElement;
      if (!target) {
        console.log("No target found for drag over");
        return;
      }

      const rect = target.getBoundingClientRect();
      const y = e.clientY - rect.top;
      const heightPercentage = (y / rect.height) * 100;

      // Get the target id and type from the data attributes
      const targetId =
        target.getAttribute("data-section-id") ||
        target.getAttribute("data-lesson-id");
      const targetType = target.getAttribute("data-section-id")
        ? "section"
        : "lesson";

      if (!targetId || !draggingId || targetId === draggingId) {
        console.log("Drag over cancelled:", {
          targetId,
          draggingId,
          targetType,
          draggingType,
        });
        return;
      }

      // Prevent dropping into descendant sections
      if (descendantsMap.get(targetId)?.has(draggingId)) {
        setDropTarget(null);
        return;
      }

      // Check if target is a section header
      const isSectionHeader =
        target.getAttribute("data-section-header") === "true";

      if (targetType === "section") {
        if (isSectionHeader) {
          // For section headers: check if we're dragging a lesson and the section is closed
          if (draggingType === "lesson") {
            // Check if this section is closed (no expanded content area)
            const targetSection = sections.find(
              (s) => (s.sectionId || s._id) === targetId
            );
            const isSectionClosed =
              !targetSection?.lessons || targetSection.lessons.length === 0;

            if (isSectionClosed) {
              // If section is closed and dragging a lesson, allow dropping inside
              setDropTarget({
                id: targetId,
                type: "section",
                position: "inside",
              });
            } else {
              // If section has lessons, use normal above/below logic
              if (heightPercentage <= 50) {
                setDropTarget({
                  id: targetId,
                  type: "section",
                  position: "above",
                });
              } else {
                setDropTarget({
                  id: targetId,
                  type: "section",
                  position: "below",
                });
              }
            }
          } else {
            // For sections: only allow above/below, not inside
            if (heightPercentage <= 50) {
              setDropTarget({
                id: targetId,
                type: "section",
                position: "above",
              });
            } else {
              setDropTarget({
                id: targetId,
                type: "section",
                position: "below",
              });
            }
          }
        } else {
          // For section content area: only allow dropping lessons inside, not sections
          if (draggingType === "lesson") {
            setDropTarget({
              id: targetId,
              type: "section",
              position: "inside",
            });
          } else {
            // Don't allow sections to be dropped inside other sections
            setDropTarget(null);
          }
        }
      } else {
        // For lessons: 50% top/bottom split
        // Allow dropping above/below other lessons (same or different sections)
        const position = heightPercentage < 50 ? "above" : "below";
        setDropTarget({ id: targetId, type: "lesson", position });
      }
    },
    [draggingId, draggingType, descendantsMap, sections]
  );

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    // Only clear drop target if we're actually leaving the drop zone
    // This prevents flickering when moving between child elements
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;

    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      setDropTarget(null);
    }
  }, []);

  const handleDragEnd = useCallback(() => {
    console.log("Drag end");
    // Remove dragging classes from all elements
    document.querySelectorAll(".opacity-50.scale-95").forEach((el) => {
      el.classList.remove("opacity-50", "scale-95", "ring-2", "ring-blue-400");
    });

    setDraggingId(null);
    setDraggingType(null);
    setDropTarget(null);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent, targetId: string, targetType: DragType) => {
      e.preventDefault();
      e.stopPropagation();

      console.log("Drop operation:", {
        draggingId,
        draggingType,
        targetId,
        targetType,
        dropTarget,
      });

      if (
        !targetId ||
        !draggingId ||
        !draggingType ||
        targetId === draggingId
      ) {
        console.log("Drop cancelled: invalid conditions");
        return;
      }

      const draggedItem =
        draggingType === "section"
          ? sections.find((s) => (s.sectionId || s._id) === draggingId)
          : sections
              .flatMap((s) => s.lessons || [])
              .find((l) => l._id === draggingId);

      if (!draggedItem) {
        setDraggingId(null);
        setDraggingType(null);
        setDropTarget(null);
        return;
      }

      // Prevent dropping into descendant sections
      if (descendantsMap.get(targetId)?.has(draggingId)) {
        setDraggingId(null);
        setDraggingType(null);
        setDropTarget(null);
        return;
      }

      try {
        if (draggingType === "section" && targetType === "section") {
          // Reorder sections - only allow above/below, not inside
          const draggedSection = draggedItem as ISection;
          const targetSection = sections.find(
            (s) => (s.sectionId || s._id) === targetId
          );

          if (
            draggedSection &&
            targetSection &&
            dropTarget &&
            dropTarget.position !== "inside"
          ) {
            const newSections = [...sections];
            const draggedIndex = newSections.findIndex(
              (s) => (s.sectionId || s._id) === draggingId
            );
            const targetIndex = newSections.findIndex(
              (s) => (s.sectionId || s._id) === targetId
            );

            if (draggedIndex !== -1 && targetIndex !== -1) {
              // Remove dragged section
              newSections.splice(draggedIndex, 1);

              // Insert at new position
              if (dropTarget.position === "above") {
                newSections.splice(targetIndex, 0, draggedSection);
              } else if (dropTarget.position === "below") {
                newSections.splice(targetIndex + 1, 0, draggedSection);
              }

              // Update sections state
              onSectionsReorder(newSections);
              // Notify that order has changed
              onOrderChanged?.();
            }
          }
        } else if (draggingType === "lesson" && targetType === "section") {
          // Move lesson to different section - only allow inside
          const draggedLesson = draggedItem as ILesson;
          const targetSection = sections.find(
            (s) => (s.sectionId || s._id) === targetId
          );

          if (
            draggedLesson &&
            targetSection &&
            dropTarget?.position === "inside"
          ) {
            // Remove lesson from current section
            const updatedSections = sections.map((section) => ({
              ...section,
              lessons: (section.lessons || []).filter(
                (l) => l._id !== draggingId
              ),
            }));

            // Add lesson to target section
            const targetSectionIndex = updatedSections.findIndex(
              (s) => (s.sectionId || s._id) === targetId
            );
            if (targetSectionIndex !== -1) {
              updatedSections[targetSectionIndex] = {
                ...updatedSections[targetSectionIndex],
                lessons: [
                  ...(updatedSections[targetSectionIndex].lessons || []),
                  draggedLesson,
                ],
              };
            }

            // Update sections state
            onSectionsReorder(updatedSections);
            // Notify that order has changed
            onOrderChanged?.();
          }
        } else if (
          draggingType === "section" &&
          targetType === "section" &&
          dropTarget?.position === "inside"
        ) {
          // Prevent sections from being dropped inside other sections
          console.log("Cannot drop section inside another section");
          return;
        } else if (draggingType === "lesson" && targetType === "lesson") {
          // Reorder lessons within the same section OR move lesson between sections
          const draggedLesson = draggedItem as ILesson;
          const targetLesson = sections
            .flatMap((s) => s.lessons || [])
            .find((l) => l._id === targetId);

          if (draggedLesson && targetLesson && dropTarget) {
            // Find the sections containing the dragged and target lessons
            const sourceSectionIndex = sections.findIndex((s) =>
              s.lessons?.some((l) => l._id === draggingId)
            );
            const targetSectionIndex = sections.findIndex((s) =>
              s.lessons?.some((l) => l._id === targetId)
            );

            if (sourceSectionIndex !== -1 && targetSectionIndex !== -1) {
              const sourceSection = sections[sourceSectionIndex];
              const targetSection = sections[targetSectionIndex];

              if (sourceSectionIndex === targetSectionIndex) {
                // Same section: reorder lessons within the section
                const newLessons = [...(sourceSection.lessons || [])];
                const draggedIndex = newLessons.findIndex(
                  (l) => l._id === draggingId
                );
                const targetIndex = newLessons.findIndex(
                  (l) => l._id === targetId
                );

                if (draggedIndex !== -1 && targetIndex !== -1) {
                  // Remove dragged lesson
                  newLessons.splice(draggedIndex, 1);

                  // Insert at new position
                  if (dropTarget.position === "above") {
                    newLessons.splice(targetIndex, 0, draggedLesson);
                  } else {
                    newLessons.splice(targetIndex + 1, 0, draggedLesson);
                  }

                  // Update section with new lesson order
                  const updatedSections = [...sections];
                  updatedSections[sourceSectionIndex] = {
                    ...sourceSection,
                    lessons: newLessons,
                  };

                  // Update sections state
                  onSectionsReorder(updatedSections);
                  // Notify that order has changed
                  onOrderChanged?.();
                }
              } else {
                // Different sections: move lesson from source to target section
                console.log("Moving lesson between sections:", {
                  sourceSection: sourceSection.sectionId || sourceSection._id,
                  targetSection: targetSection.sectionId || targetSection._id,
                  position: dropTarget.position,
                });

                // Remove lesson from source section
                const updatedSourceSection = {
                  ...sourceSection,
                  lessons: (sourceSection.lessons || []).filter(
                    (l) => l._id !== draggingId
                  ),
                };

                // Add lesson to target section at the specified position
                const targetLessons = [...(targetSection.lessons || [])];
                const targetIndex = targetLessons.findIndex(
                  (l) => l._id === targetId
                );

                if (targetIndex !== -1) {
                  if (dropTarget.position === "above") {
                    targetLessons.splice(targetIndex, 0, draggedLesson);
                  } else {
                    targetLessons.splice(targetIndex + 1, 0, draggedLesson);
                  }
                } else {
                  // If target lesson not found, append to end
                  targetLessons.push(draggedLesson);
                }

                const updatedTargetSection = {
                  ...targetSection,
                  lessons: targetLessons,
                };

                // Update both sections
                const updatedSections = [...sections];
                updatedSections[sourceSectionIndex] = updatedSourceSection;
                updatedSections[targetSectionIndex] = updatedTargetSection;

                // Update sections state
                onSectionsReorder(updatedSections);
                // Notify that order has changed
                onOrderChanged?.();
              }
            }
          }
        }
      } catch (error) {
        console.error("Error during drop operation:", error);
      }

      setDraggingId(null);
      setDraggingType(null);
      setDropTarget(null);
    },
    [
      draggingId,
      draggingType,
      dropTarget,
      sections,
      descendantsMap,
      onSectionsReorder,
    ]
  );

  return {
    // State
    draggingId,
    draggingType,
    dropTarget,

    // Handlers
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDragEnd,
    handleDrop,
  };
};
