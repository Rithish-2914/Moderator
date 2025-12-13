# Admin Dashboard Design Guidelines

## Design Approach
**Material Design-Inspired Dashboard** with modern refinements from Linear and Vercel admin interfaces. This approach excels at information-dense applications while maintaining clarity and usability.

**Core Principles:**
- Data clarity over decoration
- Efficient task completion
- Scannable information hierarchy
- Professional yet approachable

---

## Typography System

**Font Stack:** Inter (primary), system-ui (fallback)
- **Display/Headers:** 2xl to 4xl, font-semibold (600)
- **Section Titles:** xl to 2xl, font-semibold
- **Body/Content:** base to lg, font-normal (400)
- **Labels/Meta:** sm to xs, font-medium (500)
- **Data/Numbers:** Tabular nums, font-medium

**Hierarchy Implementation:**
- Dashboard title: text-3xl font-bold
- Section headers: text-xl font-semibold
- Card titles: text-lg font-medium
- Table headers: text-sm font-semibold uppercase tracking-wide
- Body text: text-base
- Meta info: text-sm opacity-70

---

## Layout System

**Spacing Scale:** Tailwind units of **2, 3, 4, 6, 8, 12, 16** (p-4, gap-6, space-y-8, etc.)

**Layout Structure:**
- Sidebar: Fixed width 64 (w-64) on desktop, collapsible to icon-only (w-16)
- Main content: Container max-w-7xl with px-6 lg:px-8
- Card spacing: gap-6 for grids, space-y-6 for stacks
- Section padding: py-8 to py-12
- Component internal spacing: p-4 to p-6

**Grid Patterns:**
- Stats cards: grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6
- User cards: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4
- Table layout: Full-width with responsive scroll

---

## Component Library

### Navigation
**Sidebar Navigation:**
- Logo/brand at top (h-16 flex items-center px-6)
- Icon + label navigation items (py-3 px-4 rounded-lg)
- Active state: slightly emphasized background
- Grouped sections with dividers
- User profile at bottom with dropdown

**Top Bar:**
- Search input (prominent, w-96 max)
- Quick actions (notifications, settings)
- Admin profile dropdown
- Breadcrumb trail for deep navigation

### Data Display

**Stats Cards:**
- Icon + metric + label structure
- Large numbers: text-3xl font-bold
- Change indicators with arrows
- Subtle background treatments
- Compact: p-6, rounded-xl, border

**User Cards:**
- Avatar (w-12 h-12 rounded-full)
- Name + email stack
- Status badge (rounded-full px-3 py-1 text-xs)
- Quick action buttons (icon-only, secondary style)
- Grid layout with consistent spacing

**Data Tables:**
- Sticky header row
- Zebra striping (subtle)
- Row height: h-16 for comfort
- Left-aligned text, right-aligned numbers
- Action column (fixed right)
- Sortable headers with indicators
- Pagination controls at bottom

**Post Feed:**
- Card-based layout
- Author info header (avatar + name + timestamp)
- Post content (max-h with "Show more" expansion)
- Comment count + action buttons footer
- Border-left accent for status/priority

### Forms & Inputs

**Search Bar:**
- Prominent placement (top bar or page header)
- Icon prefix (magnifying glass)
- Placeholder: "Search users, posts..."
- Instant filtering with debounce

**Filter Controls:**
- Dropdown selects for categories
- Toggle switches for boolean filters
- Date range pickers
- Clear all filters button
- Applied filters as removable chips

### Modals & Overlays

**Detail Views:**
- Slide-over panel (w-1/3 to w-2/5 from right)
- Full-height with scrollable content
- Header with title + close button
- Sectioned content with clear hierarchy
- Action buttons in footer

**Confirmation Dialogs:**
- Centered modal (max-w-md)
- Clear warning/action text
- Primary + secondary button pairing
- Escape to close

### Feedback Elements

**Loading States:**
- Skeleton screens matching content structure
- Spinner for actions (button states)
- Progress bar for batch operations
- Shimmer animation on placeholders

**Empty States:**
- Illustration or large icon
- Helpful message + suggested action
- CTA button to add content

**Notifications:**
- Toast position: top-right
- Auto-dismiss (4-6s) with progress bar
- Success/error/warning variants
- Stacked for multiple

---

## Onboarding Flow

**New Admin Welcome:**
- Full-screen overlay on first login
- 3-4 step carousel highlighting key features
- Interactive tooltips (pulsing dots) on first use
- Dismissible with "Don't show again" option
- Feature highlights: User directory, Post moderation, Search, Filters

---

## Performance Optimizations

- Virtualized scrolling for large user/post lists
- Lazy loading for avatars and images
- Debounced search (300ms)
- Pagination: 20-50 items per page
- Cache API responses with stale-while-revalidate

---

## Responsive Behavior

**Breakpoints:**
- Mobile (base): Sidebar becomes bottom nav or hamburger
- Tablet (md): Collapsible sidebar, 2-column grids
- Desktop (lg+): Full sidebar, multi-column layouts

**Mobile Adaptations:**
- Stack all grid layouts to single column
- Horizontal scroll for tables (or card transformation)
- Bottom sheet for filters/actions
- Simplified navigation

---

## Animations

**Minimal, Purposeful Motion:**
- Sidebar collapse/expand: 200ms ease
- Modal entrance: fade + slide (150ms)
- Hover states: 100ms transition
- Loading states: smooth fade-in (200ms)
- NO scroll-triggered animations
- NO decorative parallax effects

---

## Images

**User Avatars:**
- Circular: w-8 h-8 (small), w-12 h-12 (standard), w-24 h-24 (profile view)
- Fallback: Initials on solid background
- Source: Via JSONPlaceholder or generated via UI Avatars API

**Empty State Illustrations:**
- Simple line art or icons
- Centered placement in empty sections
- Max width: 200-300px

**No hero images** - This is a utility dashboard focused on data and functionality.