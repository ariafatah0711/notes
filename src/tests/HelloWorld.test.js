import React from "react";
import { render, screen } from "@testing-library/react";
import HelloWorld from "../components/HelloWorld"; // Make sure the path is correct

describe("HelloWorld Component", () => {
  it("renders 'Hello, World!' text", () => {
    render(<HelloWorld />); // Render the component
    expect(screen.getByText(/Hello, World!/i)).toBeInTheDocument(); // Check if the text appears
  });
});
