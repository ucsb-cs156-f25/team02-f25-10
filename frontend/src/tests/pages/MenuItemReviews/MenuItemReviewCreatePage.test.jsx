import { render, screen } from "@testing-library/react";
import MenuItemReviewCreatePage from "main/pages/MenuItemReviews/MenuItemReviewCreatePage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

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
    Navigate: vi.fn((x) => {
      mockNavigate(x);
      return null;
    }),
  };
});

describe("MenuItemCreatePage tests", () => {
  const axiosMock = new AxiosMockAdapter(axios);

  beforeEach(() => {
    vi.clearAllMocks();
    axiosMock.reset();
    axiosMock.resetHistory();
    axiosMock
      .onGet("/api/currentUser")
      .reply(200, apiCurrentUserFixtures.userOnly);
    axiosMock
      .onGet("/api/systemInfo")
      .reply(200, systemInfoFixtures.showingNeither);
  });

  const queryClient = new QueryClient();
    test("renders without crashing", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <MenuItemReviewCreatePage />
          </MemoryRouter>
        </QueryClientProvider>,
      );
  
      await waitFor(() => {
        expect(screen.getByLabelText("Item ID")).toBeInTheDocument();
      });
    });
  
    test("on submit, makes request to backend, and redirects to /menuitemreviews", async () => {
      const queryClient = new QueryClient();
      const menuItemReview = {
        id: 4,
        itemId: "3",
        reviewerEmail: "johndoe@ucsb.edu",
        stars: "4",
        dateReviewed: "2025-10-31T20:33:40",
        comments: "Pretty good food"
      };
  
      axiosMock.onPost("/api/menuitemreviews/post").reply(202, menuItemReview);
  
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <MenuItemReviewCreatePage />
          </MemoryRouter>
        </QueryClientProvider>,
      );
  
      await waitFor(() => {
        expect(screen.getByLabelText("Item ID")).toBeInTheDocument();
      });
  
      const itemIdInput = screen.getByLabelText("Item ID");
      expect(itemIdInput).toBeInTheDocument();
  
      const reviewerEmailInput = screen.getByLabelText("Reviewer Email");
      expect(reviewerEmailInput).toBeInTheDocument();

      const starsInput = screen.getByLabelText("Stars");
      expect(starsInput).toBeInTheDocument();

      const descriptionInput = screen.getByLabelText("Reviewer Email");
      expect(descriptionInput).toBeInTheDocument();

      const dateReviewedInput = screen.getByLabelText("Date Reviewed");
      expect(dateReviewedInput).toBeInTheDocument();

      const commentsInput = screen.getByLabelText("Comments");
      expect(commentsInput).toBeInTheDocument();
  
      const createButton = screen.getByText("Create");
      expect(createButton).toBeInTheDocument();
  
      fireEvent.change(commentsInput, { target: { value: "Pretty good food" } });
      fireEvent.change(starsInput, {
        target: { value: "4" },
      });
      fireEvent.click(createButton);
  
      await waitFor(() => expect(axiosMock.history.post.length).toBe(1));
  
      expect(axiosMock.history.post[0].params).toEqual({
        stars: "4",
        comments: "Pretty good food",
      });
  
      // assert - check that the toast was called with the expected message
      expect(mockToast).toBeCalledWith(
        "New Menu Item Review Created - id: 4 item id: 3",
      );
      expect(mockNavigate).toBeCalledWith({ to: "/menuitemreviews" });
    });
});
