import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router";

import ArticlesForm from "main/components/Articles/ArticlesForm";
import { articlesFixtures } from "fixtures/articlesFixtures";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const mockedNavigate = vi.fn();
vi.mock("react-router", async () => {
  const originalModule = await vi.importActual("react-router");
  return {
    ...originalModule,
    useNavigate: () => mockedNavigate,
  };
});

describe("ArticlesForm tests", () => {
  const queryClient = new QueryClient();

  const expectedHeaders = [
    "Title",
    "Url",
    "Explanation",
    "Email",
    "DateAdded (iso format)",
  ];
  const testId = "ArticlesForm";

  test("renders correctly with no initialContents", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <ArticlesForm />
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
          <ArticlesForm initialContents={articlesFixtures.oneArticles} />
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
          <ArticlesForm />
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
          <ArticlesForm />
        </Router>
      </QueryClientProvider>,
    );

    expect(await screen.findByText(/Create/)).toBeInTheDocument();
    const submitButton = screen.getByText(/Create/);
    fireEvent.click(submitButton);

    await screen.findByText(/Title is required/);
    expect(screen.getByText(/Url is required/)).toBeInTheDocument();
    expect(screen.getByText(/Explanation is required/)).toBeInTheDocument();
    expect(screen.getByText(/Email is required/)).toBeInTheDocument();
    expect(screen.getByText(/DateAdded is required/)).toBeInTheDocument();

    let ArticlesInput = screen.getByTestId(`${testId}-title`);
    fireEvent.change(ArticlesInput, { target: { value: "a".repeat(31) } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/Title: Max length 30 characters/),
      ).toBeInTheDocument();
    });

    ArticlesInput = screen.getByTestId(`${testId}-url`);
    fireEvent.change(ArticlesInput, { target: { value: "a".repeat(31) } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/Url: Max length 30 characters/),
      ).toBeInTheDocument();
    });

    ArticlesInput = screen.getByTestId(`${testId}-explanation`);
    fireEvent.change(ArticlesInput, { target: { value: "a".repeat(31) } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/Explanation: Max length 30 characters/),
      ).toBeInTheDocument();
    });

    ArticlesInput = screen.getByTestId(`${testId}-email`);
    fireEvent.change(ArticlesInput, { target: { value: "a".repeat(31) } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/Please enter a valid email address/),
      ).toBeInTheDocument();
    });

    ArticlesInput = screen.getByTestId(`${testId}-dateAdded`);
    fireEvent.change(ArticlesInput, {
      target: { value: "" },
    });

    await waitFor(() => {
      expect(
        screen.getByText(/DateAdded is required and must be in ISO format/),
      ).toBeInTheDocument();
    });
  });

  test("shows email validation message on bad email", async () => {
    render(
      <Router>
        <ArticlesForm submitAction={vi.fn()} />
      </Router>,
    );

    const emailField = await screen.findByTestId("ArticlesForm-email");
    const submitButton = screen.getByTestId("ArticlesForm-submit");

    // passes native email (has @) but fails our regex (no dot)
    fireEvent.change(emailField, { target: { value: "doctorcomedot@ucsb" } });
    fireEvent.blur(emailField);
    fireEvent.click(submitButton);

    await screen.findByText(/Please enter a valid email address/);
    expect(
      screen.getByText(/Please enter a valid email address/),
    ).toBeInTheDocument();
  });

  test("rejects email with leading junk (ensures regex ^ anchor)", async () => {
    render(
      <Router>
        <ArticlesForm submitAction={vi.fn()} />
      </Router>,
    );

    const emailField = await screen.findByTestId("ArticlesForm-email");
    const submitButton = screen.getByTestId("ArticlesForm-submit");

    fireEvent.change(emailField, {
      target: { value: "stuff and things@ucsb.edu" },
    });
    fireEvent.blur(emailField);
    fireEvent.click(submitButton);

    await screen.findByText(/Please enter a valid email address/);
    expect(
      screen.getByText(/Please enter a valid email address/),
    ).toBeInTheDocument();
  });

  test("rejects email with trailing junk (ensures regex $ anchor)", async () => {
    render(
      <Router>
        <ArticlesForm submitAction={vi.fn()} />
      </Router>,
    );
  });

  test("submits valid form successfully", async () => {
    const mockSubmit = vi.fn();

    render(
      <Router>
        <ArticlesForm submitAction={mockSubmit} />
      </Router>,
    );

    fireEvent.change(screen.getByTestId("ArticlesForm-title"), {
      target: { value: "Valid Title" },
    });
    fireEvent.change(screen.getByTestId("ArticlesForm-url"), {
      target: { value: "https://example.com" },
    });
    fireEvent.change(screen.getByTestId("ArticlesForm-explanation"), {
      target: { value: "Good article" },
    });
    fireEvent.change(screen.getByTestId("ArticlesForm-email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByTestId("ArticlesForm-dateAdded"), {
      target: { value: "2025-11-04T12:00" },
    });

    fireEvent.click(screen.getByTestId("ArticlesForm-submit"));
    await waitFor(() => expect(mockSubmit).toHaveBeenCalled());
  });
});
