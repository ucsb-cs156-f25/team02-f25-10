import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router";
import UCSBOrganizationEditPage from "main/pages/UCSBOrganization/UCSBOrganizationEditPage";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import mockConsole from "tests/testutils/mockConsole";
import { expect } from "vitest";

const mockToast = vi.fn();
vi.mock("react-toastify", async (importOriginal) => {
  const originalModule = await importOriginal();
  return {
    ...originalModule,
    toast: vi.fn((x) => mockToast(x)),
  };
});

const mockNavigate = vi.fn();
vi.mock("react-router", async (importOriginal) => {
  const originalModule = await importOriginal();
  return {
    ...originalModule,
    useParams: vi.fn(() => ({
      orgcode: "SWE",
    })),
    Navigate: vi.fn((x) => {
      mockNavigate(x);
      return null;
    }),
  };
});

let axiosMock;
describe("UCSBOrganizationEditPage tests", () => {
  describe("when the backend doesn't return data", () => {
    beforeEach(() => {
      axiosMock = new AxiosMockAdapter(axios);
      axiosMock.reset();
      axiosMock.resetHistory();
      axiosMock
        .onGet("/api/currentUser")
        .reply(200, apiCurrentUserFixtures.userOnly);
      axiosMock
        .onGet("/api/systemInfo")
        .reply(200, systemInfoFixtures.showingNeither);
      axiosMock.onGet("/api/ucsborganization", { params: { orgcode: "SWE" } }).timeout();
    });

    afterEach(() => {
      mockToast.mockClear();
      mockNavigate.mockClear();
      axiosMock.restore();
      axiosMock.resetHistory();
    });

    const queryClient = new QueryClient();
    test("renders header but table is not present", async () => {
      const restoreConsole = mockConsole();

      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <UCSBOrganizationEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      await screen.findByText("Edit UCSB Organization");
      expect(screen.queryByTestId("UCSBOrganizationForm-orgcode")).not.toBeInTheDocument();
      restoreConsole();
    });
  });

  describe("tests where backend is working normally", () => {
    beforeEach(() => {
      axiosMock = new AxiosMockAdapter(axios);
      axiosMock.reset();
      axiosMock.resetHistory();
      axiosMock
        .onGet("/api/currentUser")
        .reply(200, apiCurrentUserFixtures.userOnly);
      axiosMock
        .onGet("/api/systemInfo")
        .reply(200, systemInfoFixtures.showingNeither);
      axiosMock.onGet("/api/ucsborganization", { params: { orgcode: "SWE" } }).reply(200, {
        orgcode: "SWE",
        orgTranslationShort: "SWE",
        orgTranslation: "Society of Women Engineers",
        inactive: false,
      });
      axiosMock.onPut("/api/ucsborganization").reply(200, {
        orgcode: "SWE",
        orgTranslationShort: "SWE",
        orgTranslation: "Society of Women Engineers UCSB",
        inactive: true,
      });
    });

    afterEach(() => {
      mockToast.mockClear();
      mockNavigate.mockClear();
      axiosMock.restore();
      axiosMock.resetHistory();
    });

    const queryClient = new QueryClient();

    test("Is populated with the data provided", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <UCSBOrganizationEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await screen.findByTestId("UCSBOrganizationForm-orgcode");

      const orgcodeField = screen.getByTestId("UCSBOrganizationForm-orgcode");
      const shortTranslationField = screen.getByTestId("UCSBOrganizationForm-orgTranslationShort");
      const fullTranslationField = screen.getByTestId("UCSBOrganizationForm-orgTranslation");
      const inactiveField = screen.getByTestId("UCSBOrganizationForm-inactive");
      const submitButton = screen.getByTestId("UCSBOrganizationForm-submit");
      
      expect(orgcodeField).toBeInTheDocument();
      expect(orgcodeField).toHaveValue("SWE");
      expect(shortTranslationField).toBeInTheDocument();
      expect(shortTranslationField).toHaveValue("SWE");
      expect(fullTranslationField).toBeInTheDocument();
      expect(fullTranslationField).toHaveValue("Society of Women Engineers");
      expect(inactiveField).toBeInTheDocument();
      expect(inactiveField).not.toBeChecked();

      expect(submitButton).toHaveTextContent("Update");

      fireEvent.change(fullTranslationField, {
        target: { value: "Society of Women Engineers UCSB" },
      });
      fireEvent.click(inactiveField);
      fireEvent.click(submitButton);

      await waitFor(() => expect(mockToast).toBeCalled());
      expect(mockToast).toBeCalledWith(
        "UCSB Organization Updated - orgcode: SWE",
      );

      expect(mockNavigate).toBeCalledWith({ to: "/ucsborganization" });

      expect(axiosMock.history.put.length).toBe(1); // times called
      expect(axiosMock.history.put[0].params).toEqual({ orgcode: "SWE" });
      expect(axiosMock.history.put[0].data).toBe(
        JSON.stringify({
          orgTranslationShort: "SWE",
          orgTranslation: "Society of Women Engineers UCSB",
          inactive: true,
        }),
      ); // posted object
    });

    test("Changes when you click Update", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <UCSBOrganizationEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await screen.findByTestId("UCSBOrganizationForm-orgcode");

      const orgcode = screen.getByTestId("UCSBOrganizationForm-orgcode");
      const shortTranslation = screen.getByTestId("UCSBOrganizationForm-orgTranslationShort");
      const fullTranslation = screen.getByTestId("UCSBOrganizationForm-orgTranslation");
      const inactive = screen.getByTestId("UCSBOrganizationForm-inactive");
      const submitButton = screen.getByTestId("UCSBOrganizationForm-submit");

      expect(orgcode).toBeInTheDocument();
      expect(orgcode).toHaveValue("SWE");
      expect(shortTranslation).toBeInTheDocument();
      expect(shortTranslation).toHaveValue("SWE");
      expect(fullTranslation).toBeInTheDocument();
      expect(fullTranslation).toHaveValue("Society of Women Engineers");
      expect(inactive).toBeInTheDocument();
      expect(inactive).not.toBeChecked();

      fireEvent.change(fullTranslation, {
        target: { value: "Society of Women Engineers Update4d" },
      });
      fireEvent.click(inactive);
      fireEvent.click(submitButton);

      await waitFor(() => expect(mockToast).toBeCalled());
      expect(mockToast).toBeCalledWith(
        "UCSB Organization Updated - orgcode: SWE",
      );
      expect(mockNavigate).toBeCalledWith({ to: "/ucsborganization" });
    });
  });
});
