import { getFromLocalStorage, setToLocalStorage } from "./localStorageUtils";

describe("getFromLocalStorage", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.restoreAllMocks();
  });

  it("returns parsed value when the item exists", () => {
    localStorage.setItem("language", JSON.stringify("english"));

    expect(getFromLocalStorage("language", "ukrainian")).toBe("english");
  });

  it("returns default value when the item does not exist", () => {
    expect(getFromLocalStorage("language", "ukrainian")).toBe("ukrainian");
  });

  it("returns default value when stored value is invalid JSON", () => {
    const consoleError = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    localStorage.setItem("language", "{invalid json");

    expect(getFromLocalStorage("language", "ukrainian")).toBe("ukrainian");

    expect(consoleError).toHaveBeenCalled();
  });
});

describe("setToLocalStorage", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.restoreAllMocks();
  });

  it("serializes and stores the value", () => {
    setToLocalStorage("settings", {
      language: "english",
      level: "B1",
    });

    expect(localStorage.getItem("settings")).toBe(
      JSON.stringify({
        language: "english",
        level: "B1",
      }),
    );
  });

  it("handles localStorage errors", () => {
    const consoleError = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    jest.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("Storage error");
    });

    expect(() => {
      setToLocalStorage("settings", { language: "english" });
    }).not.toThrow();

    expect(consoleError).toHaveBeenCalled();
  });
});
