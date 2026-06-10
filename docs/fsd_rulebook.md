# Feature Slicing Design

This file is the repo rulebook for where code belongs. It is not a full FSD
guide. Keep it small, and add rules only when we are sure they are true for
this repo.

## Layers

Layer order:

`route (layout + page) -> widgets -> features -> entities -> shared`

- Routes live in `src/app`. A route `layout.tsx` or `page.tsx` should assemble
  the page and stay thin.
- Upper layers may import lower layers. Example: a feature may import an entity.
- Lower layers must not import upper layers. Example: an entity must not import
  a feature or widget.
- Sibling imports are allowed as long as they do not create circular
  dependencies.

## Placement

Keep code in the highest layer that needs it. Move code lower only when the same
code is reused somewhere else, or when the code clearly belongs to a lower
concept.

When extracting code, decide whether it should become a sibling in the same
layer or a child in a lower layer. Use `shared` only as the last option: if code
cannot honestly fit in a route, widget, feature, or entity, then it may belong
in `shared`.

## Constants

Keep constants in the highest layer that needs them. If a constant is only used
by one widget, keep it inside that widget, such as
`src/widgets/downloads-page/constants/index.ts`.

If multiple widgets need the same constant and the constant represents entity
data, move it down to the owning entity and place it near the interface or type
it satisfies. Example: if `DOWNLOAD_PLATFORMS` is reused by multiple widgets,
move it near `DownloadPlatform` in `src/entities/download/model/platforms.ts`.

## Widgets

A widget is UI composition or UI display.

This repo follows the philosophy, "everything is a widget". There is no
smaller UI layer below `widgets`, so if a component can still be split into smaller piece, decompose it.

Example: `src/widgets/board`

`board` is a widget because its job is to render the board interface after its
separable UI pieces are already decomposed into their own widgets. It is not a
feature because it does not own the game-flow behavior that changes match state.
It is not an entity because it is not the board data model or game rule
contract.

## Features

A feature is behavior that changes website or game state, performs an action, or
coordinates a user flow.

Example: `src/features/local-match`

`local-match` is a feature because it coordinates local game flow and changes
game state. It is not a widget because rendering is not its main job. It is not
an entity because it is not just the domain type or pure game rule; it owns app
behavior.

## Entities

An entity is a domain concept or data contract. If code is an interface, type,
enum, schema, or pure domain rule, it might be an entity.

Example: `src/entities/game`

`game` is an entity because it contains game concepts such as board types,
schemas, enums, and pure game rules. It is not a widget because it does not
render UI. It is not a feature because it does not coordinate a user flow or own
website state changes.

## Shared

`shared` is the last option, not the default. Use it only for code that is truly
cross-cutting and cannot belong to any specific route, widget, feature, or
entity.

Example: `src/shared/lib/time.ts`
