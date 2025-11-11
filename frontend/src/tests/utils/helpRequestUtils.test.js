import {
  onDeleteSuccess,
  cellToAxiosParamsDelete,
} from "main/utils/helpRequestUtils";
import mockConsole from "tests/testutils/mockConsole";

const mockToast = vi.fn();
vi.mock("react-toastify", async (importOriginal) => {
  const originalModule = await importOriginal();
  return {
    ...originalModule,
    toast: vi.fn((x) => mockToast(x)),
  };
});

describe("helpRequestUtils", () => {
  describe("onDeleteSuccess", () => {
    test("puts the message on console.log and in a toast", () => {
      // arrange
      const restoreConsole = mockConsole();

      // act
      onDeleteSuccess("deleted 17");

      // assert
      expect(mockToast).toHaveBeenCalledWith("deleted 17");
      expect(console.log).toHaveBeenCalled();
      const message = console.log.mock.calls[0][0];
      expect(message).toMatch("deleted 17");

      restoreConsole();
    });
  });

  describe("cellToAxiosParamsDelete", () => {
    test("returns the correct axios params", () => {
      // arrange
      const cell = { row: { original: { id: 17 } } };

      // act
      const result = cellToAxiosParamsDelete(cell);

      // assert
      expect(result).toEqual({
        url: "/api/helprequest",
        method: "DELETE",
        params: { id: 17 },
      });
    });
  });
});