/**
 * Tests for MenuLayout component.
 * Note on tooling: This suite assumes React Testing Library with Jest or Vitest,
 * following existing project conventions (will be aligned once context is confirmed).
 */

import React from "react";

// Prefer resolving the component from a .tsx in same directory.
// If your component lives elsewhere, adjust the import accordingly.
import { MenuLayout } from "./MenuLayout";

import { render, screen } from "@testing-library/react";

describe("MenuLayout", () => {
  it("renders children content", () => {
    render(
      <MenuLayout>
        <div data-testid="child">Hello</div>
      </MenuLayout>
    );
    expect(screen.getByTestId("child")).toHaveTextContent("Hello");
  });

  it("applies the expected container classes", () => {
    const { container } = render(
      <MenuLayout>
        <span>content</span>
      </MenuLayout>
    );
    const root = container.firstElementChild as HTMLElement | null;
    expect(root).not.toBeNull();
    // Tailwind utility classes expected by the diff
    const classes = root?.className || "";
    expect(classes).toContain("flex-1");
    expect(classes).toContain("min-h-screen");
    expect(classes).toContain("bg-[url('/background.png')]");
    expect(classes).toContain("bg-no-repeat");
    expect(classes).toContain("bg-cover");
    expect(classes).toContain("bg-center");
    expect(classes).toContain("flex");
    expect(classes).toContain("items-center");
    expect(classes).toContain("justify-center");
  });

  it("does not alter or wrap children unexpectedly", () => {
    render(
      <MenuLayout>
        <button type="button" data-testid="btn">Click</button>
      </MenuLayout>
    );
    const btn = screen.getByTestId("btn");
    expect(btn.tagName.toLowerCase()).toBe("button");
    expect(btn).toHaveAttribute("type", "button");
  });

  it("supports rendering multiple children", () => {
    render(
      <MenuLayout>
        <span data-testid="a">A</span>
        <span data-testid="b">B</span>
      </MenuLayout>
    );
    expect(screen.getByTestId("a")).toBeInTheDocument();
    expect(screen.getByTestId("b")).toBeInTheDocument();
  });

  it("handles falsy/empty children gracefully", () => {
    const { container } = render(
      <MenuLayout>
        {null}
        {false}
        {undefined}
        {0 as unknown as React.ReactNode}
      </MenuLayout>
    );
    const root = container.firstElementChild as HTMLElement | null;
    expect(root).not.toBeNull();
    // Container should still exist even if children are falsy
    expect(root?.childElementCount).toBe(0);
  });
});