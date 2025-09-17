# Drag and Drop Functionality for Course Sections and Lessons

This document describes the drag and drop functionality implemented for reordering course sections and lessons in the instructor dashboard.

## Features

### Section Reordering

- **Drag sections** by their header area to reorder them
- **Drop zones**: Above or below other sections (not inside)
- **Visual feedback**: Blue indicators show where the section will be placed
- **Restriction**: Sections cannot be nested inside other sections

### Lesson Reordering

- **Drag lessons** by their card to reorder within the same section
- **Drop zones**: Above or below other lessons
- **Cross-section movement**: Drag lessons between different sections

### Visual Indicators

- **Drag handles**: Grip icons (⋮⋮) are the only draggable areas
- **Drop targets**: Blue lines show valid drop positions
- **Hover effects**: Elements highlight when dragging over them
- **Ghost image**: Semi-transparent preview while dragging
- **Precise control**: Only the grip icon triggers drag operations

## How to Use

### Reordering Sections

1. Hover over a section header to see the drag handle
2. Click and drag the section header
3. Drop above, below, or inside another section
4. The section will be reordered accordingly

### Reordering Lessons

1. Hover over a lesson card to see the drag handle
2. Click and drag the lesson card
3. Drop above or below another lesson in the same section
4. Or drop inside a different section to move the lesson

### Moving Lessons Between Sections

1. Drag a lesson from its current section
2. Drop it inside another section's content area, OR
3. Drop it above/below another lesson in a different section
4. The lesson will be moved to the new section at the specified position
5. **Restriction**: Lessons cannot be dropped above/below sections, only inside sections

## Technical Implementation

### Architecture

The drag and drop functionality is implemented using a **custom hook pattern** for better separation of concerns and reusability:

- **`useReorder` Hook**: Contains all drag and drop logic, state management, and business rules
- **Component Layer**: Components only handle UI rendering and pass events to the hook
- **Separation of Concerns**: Business logic is separated from UI components

### Components

- `CourseDetailClient.tsx` - Main component that uses the reorder hook
- `useReorder.ts` - Custom hook containing all drag and drop logic
- `SectionItem.tsx` - Section drag and drop handling
- `LessonItem.tsx` - Lesson drag and drop handling
- `DropTargetIndicator.tsx` - Visual drop zone indicators

### State Management

- `draggingId` - Currently dragged item ID
- `draggingType` - Type of item being dragged (section/lesson)
- `dropTarget` - Current drop target information
- `descendantsMap` - Prevents invalid drops (e.g., dropping a section into itself)

### Event Handlers

- `handleDragStart` - Initialize drag operation
- `handleDragOver` - Update drop target during drag
- `handleDragLeave` - Clear drop target when leaving
- `handleDragEnd` - Clean up drag state
- `handleDrop` - Process the drop operation

## API Integration

The drag and drop functionality now includes automatic save functionality:

### Save Button

- **Appears automatically** after any drag and drop operation changes the order
- **Positioned below sections** for easy access
- **Shows loading state** during save operation
- **Disappears** after successful save

### API Endpoint

- **PUT** `/api/sections/update-sections-and-lessons`
- **Request Body**: Complete sections and lessons structure with order
- **Authorization**: Bearer token required

### Data Structure

```json
{
  "sections": [
    {
      "sectionId": "6771aec5a885e53899949bff",
      "order": 1,
      "lessons": [
        {
          "lessonId": "67724253d4f1f2608ce12628",
          "order": 1
        }
      ]
    }
  ]
}
```

### Previous Endpoints (Deprecated)

1. **Sections reordering**: `PUT /courses/{courseId}/sections/order`
2. **Lessons reordering**: `PUT /courses/{courseId}/sections/{sectionId}/lessons/order`
3. **Lesson movement**: `PUT /lessons/{lessonId}` to update the section ID

## Future Enhancements

- **Nested sections**: Support for sections within sections
- **Bulk operations**: Select multiple items to drag together
- **Undo/redo**: Track changes and allow reversal
- **Keyboard navigation**: Support for accessibility
- **Touch gestures**: Mobile-friendly drag and drop

## Browser Support

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- Mobile browsers: Limited support (touch events may vary)

## Troubleshooting

### Common Issues

1. **Drag not working**: Ensure the element has `draggable="true"`
2. **Drop zones not showing**: Check that `data-*` attributes are set correctly
3. **State not updating**: Verify the `updateSectionsOrder` function is called

### Recent Bug Fixes

- **Cross-section lesson reordering**: Fixed issue where dragging a lesson over another lesson in a different section wasn't working
- **Lesson positioning**: Lessons can now be dropped above/below other lessons in different sections
- **Drop zone restrictions**: Fixed section and lesson drop zone logic to prevent invalid operations
- **Drag precision**: Drag operations now only work from grip icons, not entire cards
- **Code refactoring**: Moved all drag and drop logic to a reusable `useReorder` custom hook
- **Save functionality**: Added save button that appears after order changes and persists to API
- **Collapsed section handling**: Lessons dropped on closed sections automatically trigger "inside" drop behavior

### Debug Mode

Enable console logging by checking the browser console for:

- Drag start/end events
- Drop target updates
- Section/lesson reordering operations
