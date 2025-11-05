import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import RecommendationRequestCreatePage from "main/pages/RecommendationRequest/RecommendationRequestCreatePage";
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

describe("RecommendationRequestCreatePage tests", () => {
  const axiosMock = new AxiosMockAdapter(axios);

  beforeEach(() => {
    axiosMock.reset();
    axiosMock.resetHistory();
    axiosMock
      .onGet("/api/currentUser")
      .reply(200, apiCurrentUserFixtures.userOnly);
    axiosMock
      .onGet("/api/systemInfo")
      .reply(200, systemInfoFixtures.showingNeither);
  });

  test("renders without crashing", async () => {
    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <RecommendationRequestCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(
        screen.getByTestId("RecommendationRequestForm-requesteremail"),
      ).toBeInTheDocument();
    });
  });

  test("when you fill in the form and hit submit, it makes a request to the backend", async () => {
    const queryClient = new QueryClient();
    const recommendationRequest = {
      id: 5,
      requesteremail: "email1@mail.com",
      professoremail: "email2@mail.com",
      explanation: "please recommend me!",
      daterequested: "2025-09-10T10:11",
      dateneeded: "2025-09-10T10:11",
      done: true
    };

    axiosMock.onPost("/api/recommendationrequest/post").reply(202, recommendationRequest);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <RecommendationRequestCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(
        screen.getByTestId("RecommendationRequestForm-requesteremail"),
      ).toBeInTheDocument();
    });

    const requesteremailField = screen.getByTestId("RecommendationRequestForm-requesteremail");
    const professoremailField = screen.getByTestId("RecommendationRequestForm-professoremail");
    const explanationField = screen.getByTestId("RecommendationRequestForm-explanation");
    const daterequestedField = screen.getByTestId("RecommendationRequestForm-daterequested");
    const dateneededField = screen.getByTestId("RecommendationRequestForm-dateneeded");
    const doneField = screen.getByTestId("RecommendationRequestForm-done");
    const submitButton = screen.getByTestId("RecommendationRequestForm-submit");

    fireEvent.change(requesteremailField, { target: { value: "email1@mail.com" } });
    fireEvent.change(professoremailField, { target: { value: "email2@mail.com" } });
    fireEvent.change(explanationField, { target: { value: "please recommend me!" } });
    fireEvent.change(daterequestedField, {
      target: { value: "2025-09-10T10:11" },
    });
    fireEvent.change(dateneededField, {
      target: { value: "2025-09-10T10:11" },
    });
    fireEvent.change(doneField, { target: { value: "true" } });

    expect(submitButton).toBeInTheDocument();

    fireEvent.click(submitButton);

    await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

    expect(axiosMock.history.post[0].params).toEqual({
      done: true,
      dateneeded: "2025-09-10T10:11",
      daterequested: "2025-09-10T10:11",
      explanation: "please recommend me!",
      professoremail: "email2@mail.com",
      requesteremail: "email1@mail.com",
    });

    expect(mockToast).toBeCalledWith(
      "New recommendationRequest Created - id: 5 requester email: email1@mail.com",
    );
    expect(mockNavigate).toBeCalledWith({ to: "/recommendationrequest" });
  });
});
