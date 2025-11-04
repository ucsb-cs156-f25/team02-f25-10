import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import RecommendationRequestForm from "main/components/RecommendationRequest/RecommendationRequestForm";
import { recommendationRequestFixtures } from "fixtures/recommendationRequestFixtures";
import { BrowserRouter as Router } from "react-router";
import { expect } from "vitest";

const mockedNavigate = vi.fn();
vi.mock("react-router", async () => {
  const originalModule = await vi.importActual("react-router");
  return {
    ...originalModule,
    useNavigate: () => mockedNavigate,
  };
});

describe("RecommendationRequestForm tests", () => {
  test("renders correctly", async () => {
    render(
      <Router>
        <RecommendationRequestForm />
      </Router>,
    );
    await screen.findByText(/Requester Email/);
    await screen.findByText(/Create/);
    expect(screen.getByText(/Requester Email/)).toBeInTheDocument();
  });

  test("renders correctly when passing in a RecommendationRequest", async () => {
    render(
      <Router>
        <RecommendationRequestForm initialContents={recommendationRequestFixtures.oneRecommendationRequest} />
      </Router>,
    );
    await screen.findByTestId(/RecommendationRequestForm-id/);
    expect(screen.getByText(/Id/)).toBeInTheDocument();
    expect(screen.getByTestId(/RecommendationRequestForm-id/)).toHaveValue("1");
  });

  test("Correct Error messsages on bad input", async () => {
    render(
      <Router>
        <RecommendationRequestForm />
      </Router>,
    );
    await screen.findByTestId("RecommendationRequestForm-requesteremail");

    const requesteremail = screen.getByTestId("RecommendationRequestForm-requesteremail");
    const professoremail = screen.getByTestId("RecommendationRequestForm-professoremail");
    const explanation = screen.getByTestId("RecommendationRequestForm-explanation");
    const daterequested = screen.getByTestId("RecommendationRequestForm-daterequested");
    const dateneeded = screen.getByTestId("RecommendationRequestForm-dateneeded");
    const submitButton = screen.getByTestId("RecommendationRequestForm-submit");

    const badExplanation = "no".repeat(256);

    fireEvent.change(requesteremail, { target: { value: "bad-input" } });
    fireEvent.change(professoremail, { target: { value: "bad-input" } });
    fireEvent.change(explanation, { target: { value: badExplanation } });
    fireEvent.change(daterequested, { target: { value: "bad-input" } });
    fireEvent.change(dateneeded, { target: { value: "bad-input" } });
    fireEvent.click(submitButton);

    await screen.findByText(/Requester email must be in format <email>@<domain>\.<extension>/);
    expect(
      screen.getByText(/Requester email must be in format <email>@<domain>\.<extension>/),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Professor email must be in format <email>@<domain>.<extension>/),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Explanation must be 255 characters or less\./),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Date requested required and must be in ISO format\./),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Date needed required and must be in ISO format\./),
    ).toBeInTheDocument();
  });

  test("Correct Error messsages on missing input", async () => {
    render(
      <Router>
        <RecommendationRequestForm />
      </Router>,
    );
    await screen.findByTestId("RecommendationRequestForm-submit");
    const submitButton = screen.getByTestId("RecommendationRequestForm-submit");

    fireEvent.click(submitButton);

    await screen.findByText(/Requester email is required\./);
    expect(screen.getByText(/Professor email is required\./)).toBeInTheDocument();
    expect(screen.getByText(/Explanation is required\./)).toBeInTheDocument();
    expect(screen.getByText(/Date requested required and must be in ISO format\./)).toBeInTheDocument();
    expect(screen.getByText(/Date needed required and must be in ISO format\./)).toBeInTheDocument();
  });

  test("No Error messsages on good input", async () => {
    const mockSubmitAction = vi.fn();

    render(
      <Router>
        <RecommendationRequestForm submitAction={mockSubmitAction} />
      </Router>,
    );
    await screen.findByTestId("RecommendationRequestForm-requesteremail");

    const requesteremailField = screen.getByTestId("RecommendationRequestForm-requesteremail");
    const professoremailField = screen.getByTestId("RecommendationRequestForm-professoremail");
    const explanationField = screen.getByTestId("RecommendationRequestForm-explanation");
    const daterequestedField = screen.getByTestId("RecommendationRequestForm-daterequested");
    const dateneededField = screen.getByTestId("RecommendationRequestForm-dateneeded");
    const doneField = screen.getByTestId("RecommendationRequestForm-done");
    const submitButton = screen.getByTestId("RecommendationRequestForm-submit");

    fireEvent.change(requesteremailField, { target: { value: "em1@mail.com" } });
    fireEvent.change(professoremailField, { target: { value: "em2@mail.com" } });
    fireEvent.change(explanationField, { target: { value: "please recommend" } });
    fireEvent.change(daterequestedField, {
      target: { value: "2025-10-10T10:10" },
    });
    fireEvent.change(dateneededField, {
      target: { value: "2025-10-10T10:10" },
    });
    fireEvent.change(doneField, { target: { checked: true } });

    fireEvent.click(submitButton);

    await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());

    expect(
      screen.queryByText(/Requester email must be in format <email>@<domain>\.<extension>/),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/Professor email must be in format <email>@<domain>\.<extension>/),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/Date requested required and must be in ISO format\./),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/Date needed required and must be in ISO format\./),   
    ).not.toBeInTheDocument();
  });

  test("that navigate(-1) is called when Cancel is clicked", async () => {
    render(
      <Router>
        <RecommendationRequestForm />
      </Router>,
    );
    await screen.findByTestId("RecommendationRequestForm-cancel");
    const cancelButton = screen.getByTestId("RecommendationRequestForm-cancel");

    fireEvent.click(cancelButton);

    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
  });
});
