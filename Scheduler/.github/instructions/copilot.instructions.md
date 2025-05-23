---
applyTo: "**"
---

# Instructions for Using `react-big-schedule` in PCF

This PCF component uses the [`react-big-schedule`](https://www.npmjs.com/package/react-big-schedule) React library for rendering a calendar-style scheduling interface. GitHub Copilot should follow these implementation rules when generating code for this control.

## Integration Approach

* Do not modify the core source code of `react-big-schedule`.
* Use the NPM package as-is, imported into the React-based PCF structure.
* Import using ES6 modules:

  ```ts
  import Scheduler, { SchedulerData, ViewTypes } from "react-big-schedule";
  ```

## Customization Guidelines

* The component should use the **`SchedulerData`** class for managing view state (e.g., selected range, resources, events).
* Use the **`onClickEvent`**, **`onSelectDate`**, and **`onViewChange`** handlers to bind to user interactions.
* For rendering:

  ```tsx
  <Scheduler
    schedulerData={schedulerData}
    prevClick={prevClickHandler}
    nextClick={nextClickHandler}
    onSelectDate={handleDateSelect}
    onViewChange={handleViewChange}
    eventItemClick={handleEventClick}
    ...otherProps
  />
  ```

## Styling

* The library’s default styles must be imported from the package:

  ```ts
  import "react-big-schedule/lib/css/style.css";
  ```
* Additional styling overrides should be placed in the `resources/css/` folder.

## Type Safety

* Define custom interfaces extending `SchedulerData`, `Event`, and `Resource` to ensure proper typing.
* Avoid using `any` for event/resource data.
* Place all custom types under `types/`.

## React Folder Usage

Ensure all logic is cleanly separated:

* `components/SchedulerWrapper.tsx` – main component wrapping the Scheduler
* `services/schedulerService.ts` – data loading and transformation for events/resources
* `hooks/useSchedulerState.ts` – encapsulates logic for setting up and updating `SchedulerData`
* `types/schedulerTypes.ts` – interfaces for `Resource`, `Event`, and any custom metadata

## Limitations

* Do not use jQuery or other DOM-based libraries to modify the Scheduler.
* Avoid forcing re-renders by manipulating DOM directly.
* This library is not virtualized – performance may degrade with very large event sets.

---

By following this file, Copilot will assist in writing well-structured, typed, and idiomatic code around `react-big-schedule` in a PCF context.
