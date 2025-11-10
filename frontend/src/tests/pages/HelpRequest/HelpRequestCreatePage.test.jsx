import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import HelpRequestCreatePage from "main/pages/HelpRequest/HelpRequestCreatePage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import { expect, test } from "vitest";

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

describe("HelpRequestCreatePage tests", () => {
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
          <HelpRequestCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(
        screen.getByTestId("HelpRequestForm-requesterEmail"),
      ).toBeInTheDocument();
    });
  });

  test("submits form and it make a request to backend", async () => {
    const queryClient = new QueryClient();
    const HelpRequest = {
      id: 3,
      requesterEmail: "kham@ucsb.edu",
      teamId: "f25-10",
      tableOrBreakoutRoom: "table 10",
      requestTime: "2024-06-01T10:00",
      explanation: "Need help with project",
      solved: false,
    }

    axiosMock.onPost("/api/helprequest/post").reply(201, HelpRequest);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <HelpRequestCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(
        screen.getByTestId("HelpRequestForm-requesterEmail"),
      ).toBeInTheDocument();
    });
    
    const requesterEmailInput = screen.getByTestId("HelpRequestForm-requesterEmail");
    const teamIdInput = screen.getByTestId("HelpRequestForm-teamId");
    const tableOrBreakoutRoomInput = screen.getByTestId("HelpRequestForm-tableOrBreakoutRoom");
    const requestTimeInput = screen.getByTestId("HelpRequestForm-requestTime");
    const explanationInput = screen.getByTestId("HelpRequestForm-explanation");
    const solvedInput = screen.getByTestId("HelpRequestForm-solved");
    const submitButton = screen.getByTestId("HelpRequestForm-submit");


    fireEvent.change(requesterEmailInput, { target: { value: "kham@ucsb.edu" } });
    fireEvent.change(teamIdInput, { target: { value: "f25-10" } });
    fireEvent.change(tableOrBreakoutRoomInput, { target: { value: "table 10" } });
    fireEvent.change(requestTimeInput, { target: { value: "2024-06-01T10:00" } });
    fireEvent.change(explanationInput, { target: { value: "Need help with project" } });
    fireEvent.change(solvedInput, { target: { checked: false } });

    expect(submitButton).toBeInTheDocument();

    fireEvent.click(submitButton);

    await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

    expect(axiosMock.history.post[0].params).toEqual({
      requesterEmail:  "kham@ucsb.edu",
      teamId:  "f25-10",
      tableOrBreakoutRoom:  "table 10",
      requestTime:  "2024-06-01T10:00",
      explanation:  "Need help with project",
      solved:  false,
    });

    expect(mockToast).toHaveBeenCalledWith("New HelpRequest Created - id: 3 requesterEmail: kham@ucsb.edu");

    expect(mockNavigate).toHaveBeenCalledWith({ to: "/helprequest" });
  });
});
