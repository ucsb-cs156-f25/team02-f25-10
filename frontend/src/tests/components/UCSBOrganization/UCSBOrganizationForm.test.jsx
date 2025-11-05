import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router";

import UCSBOrganizationForm from "main/components/UCSBOrganization/UCSBOrganizationForm";
import { ucsbOrganizationFixtures } from "fixtures/ucsbOrganizationFixtures";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const mockedNavigate = vi.fn();
vi.mock("react-router", async () => {
  const originalModule = await vi.importActual("react-router");
  return {
    ...originalModule,
    useNavigate: () => mockedNavigate,
  };
});

describe("UCSBOrganizationForm tests", () => {
  const queryClient = new QueryClient();
  const testId = "UCSBOrganizationForm";

  const renderForm = (props = {}) =>
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <UCSBOrganizationForm {...props} />
        </Router>
      </QueryClientProvider>
    );

  const expectedHeaders = [
    "Org Code",
    "Short Translation",
    "Full Translation",
    "Inactive?",
  ];

  test("renders correctly with no initialContents", async () => {
    renderForm();
    expect(await screen.findByText(/Create/)).toBeInTheDocument();

    expectedHeaders.forEach((headerText) => {
      expect(screen.getByText(headerText)).toBeInTheDocument();
    });

    expect(
      screen.getByTestId(`${testId}-orgcode`)
    ).toBeInTheDocument();
    expect(
      screen.getByTestId(`${testId}-orgTranslationShort`)
    ).toBeInTheDocument();
    expect(
      screen.getByTestId(`${testId}-orgTranslation`)
    ).toBeInTheDocument();
    expect(
      screen.getByTestId(`${testId}-inactive`)
    ).toBeInTheDocument();
    expect(
      screen.getByTestId(`${testId}-submit`)
    ).toBeInTheDocument();
    expect(
      screen.getByTestId(`${testId}-cancel`)
    ).toBeInTheDocument();

    const inactiveCheckbox = screen.getByTestId(`${testId}-inactive`);
    expect(inactiveCheckbox).not.toBeChecked();
  });

  test("renders correctly when passing in initialContents", async () => {
    renderForm({
      initialContents: ucsbOrganizationFixtures.oneOrganization[0],
    });

    expect(await screen.findByText(/Create|Update/)).toBeInTheDocument();

    expectedHeaders.forEach((headerText) => {
      expect(screen.getByText(headerText)).toBeInTheDocument();
    });

    const orgCodeField = screen.getByTestId(`${testId}-orgcode`);
    expect(orgCodeField).toBeInTheDocument();
    expect(orgCodeField).toBeDisabled();

    const inactiveCheckbox = screen.getByTestId(`${testId}-inactive`);
    if (ucsbOrganizationFixtures.oneOrganization[0].inactive) {
      expect(inactiveCheckbox).toBeChecked();
    } else {
      expect(inactiveCheckbox).not.toBeChecked();
    }
  });

  test("that navigate(-1) is called when Cancel is clicked", async () => {
    renderForm();
    const cancelButton = await screen.findByTestId(`${testId}-cancel`);
    fireEvent.click(cancelButton);
    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
  });

  test("that the correct validations are performed", async () => {
    renderForm();

    const submitButton = await screen.findByText(/Create/);
    fireEvent.click(submitButton);

    await screen.findByText(/Organization code is required/);
    expect(
      screen.getByText(/Short translation is required/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Full translation is required/)
    ).toBeInTheDocument();

    const shortInput = screen.getByTestId(`${testId}-orgTranslationShort`);
    fireEvent.change(shortInput, { target: { value: "a".repeat(21) } });
    fireEvent.click(submitButton);
    await waitFor(() =>
      expect(
        screen.getByText(/Max length 20 characters/)
      ).toBeInTheDocument()
    );

    const orgCodeInput = screen.getByTestId(`${testId}-orgcode`);
    fireEvent.change(orgCodeInput, { target: { value: "a".repeat(11) } });
    fireEvent.click(submitButton);
    await waitFor(() =>
      expect(
        screen.getByText(/Max length 10 characters/)
      ).toBeInTheDocument()
    );
  });
});
