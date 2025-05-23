---
applyTo: "**"
---

# PCF Component Development Guidelines

## Developer Intent

I develop Power Apps Component Framework (PCF) components that are modular, maintainable, performant, and compliant with Microsoft's supported patterns. These instructions guide GitHub Copilot to align code generation with my development goals and structure.

## General Coding Conventions

### Naming Conventions

* Use PascalCase for class names, components, and manifest constructors
* Use camelCase for variables and methods
* Use ALL\_CAPS for constants
* File names should match their primary export (e.g., `ProgressBarControl.ts`)
* Prefix localized string keys consistently (e.g., `ProgressBar_Control_DisplayName`)

### Folder Structure

* `resources/` – contains all static assets including `.resx`, images, and CSS files
* Each PCF control should live in its own folder, with its own manifest, index/entry file, and support files

## Lifecycle and Compliance

* Use `init` for setup logic and DOM container initialization
* Use `updateView` only for rendering or updating visual state
* Use `destroy` to clean up event listeners, timers, or unmount components
* Do not access the DOM outside the component container or use unsupported platform APIs

## Manifest and Resources

* Declare all static files used (CSS, images, RESX) in the `<resources>` section of `ControlManifest.Input.xml`
* Use `context.resources.getResource()` to retrieve image or text content

## React-Based PCF Projects

React projects must follow the structure and coding standards below:

### Project Structure

* `components/` – All React components live here, including the main and child components
* `hooks/` – Custom React hooks for shared logic
* `services/` – Non-visual business logic or API interaction modules
* `types/` – All TypeScript types, interfaces, and enums
* `resources/` – As defined above, for styling and localization

### React Guidelines

* Use functional components exclusively
* Use React hooks (`useState`, `useEffect`, etc.) for all side effects and state
* Use `React.memo`, `useMemo`, and `useCallback` to prevent unnecessary re-renders
* Always unmount React apps in the PCF `destroy()` method
* Use Fluent UI components where possible to align with Power Apps styling and accessibility
* Avoid inline object/function creation inside JSX

## Performance and Accessibility

* Avoid synchronous code in rendering; use asynchronous logic where needed
* Provide keyboard navigation and ARIA attributes for all interactive elements
* Ensure compatibility across supported Power Apps clients (web, mobile, model-driven, canvas)

By following this structure and set of rules, Copilot will produce PCF components that align with Power Platform expectations, team standards, and Microsoft's guidance.
