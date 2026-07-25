# CenterPort - Frontend Foundation Plan (Next.js + Tailwind + shadcn/ui)

## Project Overview

Create a modern, enterprise-grade healthcare and maritime management platform named **CenterPort** using:

* Next.js 15+ (App Router)
* TypeScript
* Tailwind CSS
* shadcn/ui
* Lucide React Icons

This is **Phase 1: Frontend Foundation Only**.

### Scope

Build the application shell, navigation, layout, and starter dashboard.

### Out of Scope

* Backend APIs
* Authentication
* Authorization
* Database integration
* State management libraries
* Form submissions
* Data persistence

All pages will contain placeholder content only.

---

# Application Modules

Create the following sidebar navigation items and routes:

| Menu       | Route       |
| ---------- | ----------- |
| Dashboard  | /dashboard  |
| Profile    | /profile    |
| Medical    | /medical    |
| Laboratory | /laboratory |
| Seabase    | /seabase    |
| MLC        | /mlc        |
| Panama     | /panama     |

---

# Layout Requirements

Create a reusable application layout consisting of:

## Sidebar

Collapsible navigation sidebar.

Menu items should be generated dynamically from a navigation configuration file.

Suggested icons:

```typescript
Dashboard      LayoutDashboard
Profile        User
Medical        HeartPulse
Laboratory     FlaskConical
Seabase        Ship
MLC            ClipboardCheck
Panama         Globe
```

Requirements:

* Desktop: Expanded sidebar
* Tablet: Collapsible sidebar
* Active route highlighting
* Logo section at top

---

## Header

Sticky application header.

Include:

* CenterPort Logo
* Application Name
* Search Placeholder
* Theme Toggle Placeholder
* User Avatar Placeholder

Header height:

```css
64px
```

---

## Main Content Area

Responsive content container.

Use:

```tsx
<PageContainer>
  {children}
</PageContainer>
```

---

# Design System Requirements

The project already uses a shadcn/ui compatible Tailwind theme.

## IMPORTANT

Do NOT use hardcoded Tailwind colors.

Avoid:

```tsx
bg-white
bg-gray-100
text-gray-500
border-gray-200
bg-blue-500
```

Use only semantic design tokens.

---

## Layout Colors

### App Background

```tsx
bg-background
text-foreground
```

### Cards

```tsx
bg-card
text-card-foreground
border-border
```

### Sidebar

```tsx
bg-sidebar
text-sidebar-foreground
border-sidebar-border
```

### Active Navigation Item

```tsx
bg-sidebar-accent
text-sidebar-accent-foreground
```

### Muted Text

```tsx
text-muted-foreground
```

---

# Folder Structure

```text
src/
│
├── app/
│   ├── dashboard/
│   │   └── page.tsx
│   ├── profile/
│   │   └── page.tsx
│   ├── medical/
│   │   └── page.tsx
│   ├── laboratory/
│   │   └── page.tsx
│   ├── seabase/
│   │   └── page.tsx
│   ├── mlc/
│   │   └── page.tsx
│   ├── panama/
│   │   └── page.tsx
│   ├── layout.tsx
│   └── page.tsx
│
├── components/
│   ├── layout/
│   │   ├── app-layout.tsx
│   │   ├── app-sidebar.tsx
│   │   ├── app-header.tsx
│   │   └── mobile-nav.tsx
│   │
│   ├── common/
│   │   ├── page-container.tsx
│   │   ├── page-title.tsx
│   │   └── empty-state-card.tsx
│   │
│   └── dashboard/
│       ├── stat-card.tsx
│       ├── quick-actions.tsx
│       └── recent-activity.tsx
│
├── config/
│   └── navigation.ts
│
├── hooks/
│
├── lib/
│
├── types/
│
└── styles/
```

---

# Navigation Configuration

Create:

```text
src/config/navigation.ts
```

Example:

```typescript
export const navigation = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Profile",
    href: "/profile",
    icon: User,
  },
];
```

Sidebar must render dynamically from this configuration.

No hardcoded menu items inside components.

---

# Reusable Components

Create reusable components:

```text
AppLayout
AppSidebar
AppHeader
MobileNav
PageContainer
PageTitle
EmptyStateCard
StatCard
```

---

# Dashboard Page

Keep it empty for now.


---

# Other Pages

For:

```text
Profile
Medical
Laboratory
Seabase
MLC
Panama
```

Create simple placeholder pages.

Example:

```tsx
<PageTitle title="Medical" />

<Card>
  <CardContent>
    Coming Soon
  </CardContent>
</Card>
```

---

# Preferred shadcn Components

Use whenever possible:

```text
Card
Button
Input
Avatar
Separator
Sheet
DropdownMenu
ScrollArea
Tooltip
Breadcrumb
```

---

# Development Standards

Follow:

* TypeScript strict mode
* Functional components only
* SOLID principles
* Clean architecture mindset
* Reusable components
* No duplicated code
* No inline styles
* Absolute imports using @/*
* Responsive-first development
* Accessibility best practices

---

# Future Scalability

The architecture must support future modules without changing the core layout:

```text
Visit
Patients
Landbase
Immunology
Reports
Billing
Users
Settings
```

The layout and navigation system should be designed to easily accommodate additional modules.

---

# Expected Deliverables

Generate:

1. Complete Next.js project structure
2. Tailwind integration
3. shadcn/ui integration
4. Responsive application layout
5. Dynamic sidebar navigation
6. Sticky header
7. Dashboard starter UI
8. Empty module pages
9. Reusable shared components
10. Enterprise-grade code organization suitable for a healthcare and maritime management platform called CenterPort
