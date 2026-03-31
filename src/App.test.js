// @vitest-environment jsdom

import React from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, test, vi } from "vitest";
import App from "./App.jsx";

afterEach(() => {
  cleanup();
});

describe("Zora Discovery app", () => {
  test("renders the brand and default pattern view", () => {
    render(React.createElement(App));
    expect(screen.getByText("Zora Discovery")).toBeTruthy();
    expect(screen.getByText("Zora Pattern")).toBeTruthy();
    expect(screen.getByText("Natural Coherence Breath")).toBeTruthy();
  });

  test("switches tabs and keeps the focus exponent control available", () => {
    render(React.createElement(App));
    fireEvent.click(screen.getByRole("button", { name: "Scale" }));
    expect(screen.getByText("Scale Keyboard")).toBeTruthy();
    expect(screen.getByText("Sub-Planck")).toBeTruthy();
    expect(screen.getByText("Cosmic")).toBeTruthy();
    expect(screen.getByText("Focus Exponent")).toBeTruthy();
  });

  test("runs engage to whiteout and arrival sequence", async () => {
    vi.useFakeTimers();
    render(React.createElement(App));

    fireEvent.click(screen.getByRole("button", { name: "Engage" }));
    expect(screen.getByRole("button", { name: "Sweep In Progress" })).toBeTruthy();

    await vi.advanceTimersByTimeAsync(4000);
    expect(screen.getByRole("button", { name: /warp press anywhere or hit esc when ready to arrive/i })).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: /press anywhere or hit esc when ready to arrive/i }));
    expect(screen.getAllByText("Arrived").length).toBeGreaterThan(0);

    await vi.advanceTimersByTimeAsync(1200);
    expect(screen.queryByText("Arrived")).toBeNull();
    vi.useRealTimers();
  });
});
