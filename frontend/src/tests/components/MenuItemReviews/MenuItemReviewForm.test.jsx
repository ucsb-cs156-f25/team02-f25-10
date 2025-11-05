import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router";

import MenuItemReviewForm from "main/components/MenuItemReviews/MenuItemReviewForm";
import { menuItemReviewFixtures } from "fixtures/menuItemReviewFixtures";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const mockedNavigate = vi.fn();
vi.mock("react-router", async () => {
  const originalModule = await vi.importActual("react-router");
  return {
    ...originalModule,
    useNavigate: () => mockedNavigate,
  };
});

describe("MenuItemReviewForm tests", () => {
  const queryClient = new QueryClient();

  const expectedHeaders = [
    "Item ID",
    "Reviewer Email",
    "Stars (1-5)",
    "Date Reviewed",
    "Comments",
  ];
  const testId = "MenuItemReviewForm";

  test("renders correctly with no initialContents", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <MenuItemReviewForm />
        </Router>
      </QueryClientProvider>,
    );

    expect(await screen.findByText(/Create/)).toBeInTheDocument();

    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });
  });

  test("renders correctly when passing in initialContents", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <MenuItemReviewForm
            initialContents={menuItemReviewFixtures.oneMenuItemReview}
          />
        </Router>
      </QueryClientProvider>,
    );

    expect(await screen.findByText(/Create/)).toBeInTheDocument();

    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expect(await screen.findByTestId(`${testId}-id`)).toBeInTheDocument();
    expect(screen.getByText(`Id`)).toBeInTheDocument();
  });

  test("that navigate(-1) is called when Cancel is clicked", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <MenuItemReviewForm />
        </Router>
      </QueryClientProvider>,
    );
    expect(await screen.findByTestId(`${testId}-cancel`)).toBeInTheDocument();
    const cancelButton = screen.getByTestId(`${testId}-cancel`);

    fireEvent.click(cancelButton);

    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
  });

  test("that the correct validations are performed", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <MenuItemReviewForm />
        </Router>
      </QueryClientProvider>,
    );

    expect(await screen.findByText(/Create/)).toBeInTheDocument();
    const submitButton = screen.getByText(/Create/);
    fireEvent.click(submitButton);

    await screen.findByText(/Item ID is required/);
    expect(screen.getByText(/Reviewer Email is required/)).toBeInTheDocument();
    expect(screen.getByText(/Stars are required/)).toBeInTheDocument();
    expect(screen.getByText(/Date Reviewed is required/)).toBeInTheDocument();
    expect(screen.getByText(/A comment is required/)).toBeInTheDocument();

    const commentInput = screen.getByTestId(`${testId}-comments`);
    fireEvent.change(commentInput, { target: { value: "a".repeat(256) } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/Max length is 255 characters/),
      ).toBeInTheDocument();
    });

    const itemIdInput1 = screen.getByTestId(`${testId}-itemId`);
    fireEvent.change(itemIdInput1, { target: { value: "bad" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/Item ID must be a number/),
      ).toBeInTheDocument();
    });

    const starsInput3 = screen.getByTestId(`${testId}-stars`);
    fireEvent.change(starsInput3, { target: { value: "6" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Stars must be a number between 1-5/)).toBeInTheDocument();
    });

    const emailInput = screen.getByTestId(`${testId}-reviewerEmail`);
    fireEvent.change(emailInput, { target: { value: "blah" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Invalid email format/)).toBeInTheDocument();
    });
  });
});
