import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { GlobalSearch } from "../../src/components/GlobalSearch";

/**
 * Tests executed with Jest and React Testing Library.
 */
const renderGlobalSearch = (
  overrideProps: Partial<React.ComponentProps<typeof GlobalSearch>> = {},
) => {
  const onGlobalSearchChange = jest.fn();
  const props = {
    globalSearch: "",
    onGlobalSearchChange,
    ...overrideProps,
  };

  const view = render(<GlobalSearch {...props} />);
  const input = screen.getByRole("textbox", { name: /globale suche/i });

  return { ...view, input, props, onGlobalSearchChange };
};

describe("GlobalSearch", () => {
  it("renders the search input with expected attributes", () => {
    const { input } = renderGlobalSearch();

    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("placeholder", "Durchsuche alle Spalten...");
    expect(input).toHaveAttribute("spellcheck", "false");
    expect(input).toHaveAttribute("autocomplete", "off");
    expect(input).toHaveValue("");
  });

  it("renders the provided search value and shows the clear button", () => {
    renderGlobalSearch({ globalSearch: "Algebra" });

    expect(screen.getByDisplayValue("Algebra")).toBeInTheDocument();
    const clearButton = screen.getByRole("button", {
      name: /globale suche löschen/i,
    });
    expect(clearButton).toBeInTheDocument();
    expect(clearButton).toHaveTextContent(/clear/i);
  });

  it("does not render the clear button when the search value is empty", () => {
    renderGlobalSearch();

    expect(
      screen.queryByRole("button", { name: /globale suche löschen/i }),
    ).not.toBeInTheDocument();
  });

  it("invokes onGlobalSearchChange with the latest value when typing", async () => {
    const user = userEvent.setup();
    const { input, onGlobalSearchChange } = renderGlobalSearch();

    await user.type(input, "analysis");

    expect(onGlobalSearchChange).toHaveBeenCalled();
    expect(onGlobalSearchChange).toHaveBeenLastCalledWith("analysis");
  });

  it("calls onGlobalSearchChange with an empty string when the clear button is clicked", async () => {
    const user = userEvent.setup();
    const { onGlobalSearchChange } = renderGlobalSearch({
      globalSearch: "History",
    });

    const clearButton = screen.getByRole("button", {
      name: /globale suche löschen/i,
    });
    await user.click(clearButton);

    expect(onGlobalSearchChange).toHaveBeenCalledTimes(1);
    expect(onGlobalSearchChange).toHaveBeenLastCalledWith("");
  });

  it("clears the input via keyboard interaction", async () => {
    const user = userEvent.setup();
    const { input, onGlobalSearchChange } = renderGlobalSearch({
      globalSearch: "Physics",
    });

    await user.clear(input);

    expect(onGlobalSearchChange).toHaveBeenCalledWith("");
  });

  it("passes unicode and special characters to the change handler", async () => {
    const user = userEvent.setup();
    const { input, onGlobalSearchChange } = renderGlobalSearch();

    await user.type(input, "äöü 🚀");

    expect(onGlobalSearchChange).toHaveBeenLastCalledWith("äöü 🚀");
  });
});