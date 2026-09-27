import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FillTextSelect from "./FillTextSelect";

describe("FillTextSelect", () => {
  const options = ["cat", "dog", "bird"];

  it("renders all provided options", () => {
    render(
      <FillTextSelect
        selectIndex={0}
        handleChange={jest.fn()}
        options={options}
        currentOption=""
      />,
    );

    expect(screen.getByRole("option", { name: "cat" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "dog" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "bird" })).toBeInTheDocument();
  });

  it("renders the current option as selected", () => {
    render(
      <FillTextSelect
        selectIndex={1}
        handleChange={jest.fn()}
        options={options}
        currentOption="dog"
      />,
    );

    expect(screen.getByRole("combobox")).toHaveValue("dog");
  });

  it("calls handleChange with the select index and selected value", async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();

    render(
      <FillTextSelect
        selectIndex={2}
        handleChange={handleChange}
        options={options}
        currentOption=""
      />,
    );

    await user.selectOptions(screen.getByRole("combobox"), "bird");

    expect(handleChange).toHaveBeenCalledWith(2, "bird");
  });

  it("disables the select in readonly mode", () => {
    render(
      <FillTextSelect
        selectIndex={0}
        handleChange={jest.fn()}
        options={options}
        currentOption=""
        readonly
      />,
    );

    expect(screen.getByRole("combobox")).toBeDisabled();
  });

  it("keeps the select enabled in editable mode", () => {
    render(
      <FillTextSelect
        selectIndex={0}
        handleChange={jest.fn()}
        options={options}
        currentOption=""
      />,
    );

    expect(screen.getByRole("combobox")).toBeEnabled();
  });

  it("renders an empty option for the initial state", () => {
    render(
      <FillTextSelect
        selectIndex={0}
        handleChange={jest.fn()}
        options={options}
        currentOption=""
      />,
    );

    expect(screen.getByRole("option", { name: "" })).toBeInTheDocument();
  });
});
