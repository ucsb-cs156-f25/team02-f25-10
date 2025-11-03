import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import HelpRequestForm from "main/components/HelpRequest/HelpRequestForm";
import { helpRequestFixtures } from "fixtures/helpRequestFixtures";
import { BrowserRouter as Router } from "react-router";
import { expect, vi } from "vitest";

// mock useNavigate like UCSBDateForm.test does
const mockedNavigate = vi.fn();
vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    useNavigate: () => mockedNavigate,
  };
});

describe("HelpRequestForm tests", () => {
  test("renders correctly for create (no id)", async () => {
    render(
      <Router>
        <HelpRequestForm />
      </Router>
    );

    await screen.findByTestId("HelpRequestForm-requesterEmail");

    expect(
      screen.queryByTestId("HelpRequestForm-id")
    ).not.toBeInTheDocument();

    expect(
      screen.getByTestId("HelpRequestForm-requesterEmail")
    ).toBeInTheDocument();
    expect(screen.getByTestId("HelpRequestForm-teamId")).toBeInTheDocument();
    expect(
      screen.getByTestId("HelpRequestForm-tableOrBreakoutRoom")
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("HelpRequestForm-requestTime")
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("HelpRequestForm-explanation")
    ).toBeInTheDocument();
    expect(screen.getByTestId("HelpRequestForm-solved")).toBeInTheDocument();

    expect(screen.getByTestId("HelpRequestForm-submit")).toHaveTextContent(
      "Create"
    );
  });

  test("renders correctly for update (id shown & disabled)", async () => {
    const initialContents = helpRequestFixtures.oneHelpRequest;

    render(
      <Router>
        <HelpRequestForm
          initialContents={initialContents}
          buttonLabel="Update"
          submitAction={vi.fn()}
        />
      </Router>
    );

    const idField = await screen.findByTestId("HelpRequestForm-id");
    expect(idField).toBeInTheDocument();
    expect(idField).toHaveValue("1");
    expect(idField).toBeDisabled();

    expect(screen.getByTestId("HelpRequestForm-submit")).toHaveTextContent(
      "Update"
    );
  });

  test("shows messages on missing input", async () => {
    render(
      <Router>
        <HelpRequestForm submitAction={vi.fn()} />
      </Router>
    );

    const submitButton = await screen.findByTestId(
      "HelpRequestForm-submit"
    );

    fireEvent.click(submitButton);

    await screen.findByText(/Requester email is required\./i);
    expect(
      screen.getByText(/Requester email is required\./i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Team id is required\./i)).toBeInTheDocument();
    expect(
      screen.getByText(/Table or breakout room is required\./i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Request time is required and must be in ISO format\./i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Explanation is required\./i)
    ).toBeInTheDocument();
  });

  //
  // EMAIL TESTS (to kill Stryker regex mutants)
  //

  test("shows email validation message on bad email", async () => {
    render(
      <Router>
        <HelpRequestForm submitAction={vi.fn()} />
      </Router>
    );

    const emailField = await screen.findByTestId(
      "HelpRequestForm-requesterEmail"
    );
    const submitButton = screen.getByTestId("HelpRequestForm-submit");

    // passes native email (has @) but fails our regex (no dot)
    fireEvent.change(emailField, { target: { value: "kham@ucsb" } });
    fireEvent.blur(emailField);
    fireEvent.click(submitButton);

    await screen.findByText(/Please enter a valid email address\./i);
    expect(
      screen.getByText(/Please enter a valid email address\./i)
    ).toBeInTheDocument();
  });

  test("rejects email with leading junk (ensures regex ^ anchor)", async () => {
    render(
      <Router>
        <HelpRequestForm submitAction={vi.fn()} />
      </Router>
    );

    const emailField = await screen.findByTestId(
      "HelpRequestForm-requesterEmail"
    );
    const submitButton = screen.getByTestId("HelpRequestForm-submit");

    fireEvent.change(emailField, {
      target: { value: "junk kham@ucsb.edu" },
    });
    fireEvent.blur(emailField);
    fireEvent.click(submitButton);

    await screen.findByText(/Please enter a valid email address\./i);
    expect(
      screen.getByText(/Please enter a valid email address\./i)
    ).toBeInTheDocument();
  });

  test("rejects email with trailing junk (ensures regex $ anchor)", async () => {
    render(
      <Router>
        <HelpRequestForm submitAction={vi.fn()} />
      </Router>
    );

    const emailField = await screen.findByTestId(
      "HelpRequestForm-requesterEmail"
    );
    const submitButton = screen.getByTestId("HelpRequestForm-submit");

    fireEvent.change(emailField, {
      target: { value: "kham@ucsb.edu extra" },
    });
    fireEvent.blur(emailField);
    fireEvent.click(submitButton);

    await screen.findByText(/Please enter a valid email address\./i);
    expect(
      screen.getByText(/Please enter a valid email address\./i)
    ).toBeInTheDocument();
  });

  test("submits correct data on good input", async () => {
    const mockSubmit = vi.fn();

    render(
      <Router>
        <HelpRequestForm submitAction={mockSubmit} />
      </Router>
    );

    const requesterEmailField = await screen.findByTestId(
      "HelpRequestForm-requesterEmail"
    );
    const teamIdField = screen.getByTestId("HelpRequestForm-teamId");
    const tableField = screen.getByTestId(
      "HelpRequestForm-tableOrBreakoutRoom"
    );
    const requestTimeField = screen.getByTestId(
      "HelpRequestForm-requestTime"
    );
    const explanationField = screen.getByTestId(
      "HelpRequestForm-explanation"
    );
    const solvedCheckbox = screen.getByTestId("HelpRequestForm-solved");
    const submitButton = screen.getByTestId("HelpRequestForm-submit");

    fireEvent.change(requesterEmailField, {
      target: { value: "kham@ucsb.edu" },
    });
    fireEvent.change(teamIdField, { target: { value: "f25-10" } });
    fireEvent.change(tableField, { target: { value: "table 10" } });
    fireEvent.change(requestTimeField, {
      target: { value: "2024-06-01T10:00" },
    });
    fireEvent.change(explanationField, {
      target: { value: "Need help with project" },
    });
    fireEvent.click(solvedCheckbox);

    fireEvent.click(submitButton);

    await waitFor(() => expect(mockSubmit).toHaveBeenCalled());

    const submitted = mockSubmit.mock.calls[0][0];

    expect(submitted.requesterEmail).toBe("kham@ucsb.edu");
    expect(submitted.teamId).toBe("f25-10");
    expect(submitted.tableOrBreakoutRoom).toBe("table 10");
    // if your component adds ":00" on submit, assert that instead:
    expect(submitted.requestTime).toBe("2024-06-01T10:00");
    expect(submitted.explanation).toBe("Need help with project");
    expect(submitted.solved).toBe(true);
  });

  test("shows max length message on long explanation", async () => {
    render(
      <Router>
        <HelpRequestForm submitAction={vi.fn()} />
      </Router>
    );

    const explanationField = await screen.findByTestId(
      "HelpRequestForm-explanation"
    );
    const submitButton = screen.getByTestId("HelpRequestForm-submit");

    const longText = "x".repeat(300);
    fireEvent.change(explanationField, { target: { value: longText } });
    fireEvent.click(submitButton);

    await screen.findByText(/Explanation must be 255 characters or less\./i);
    expect(
      screen.getByText(/Explanation must be 255 characters or less\./i)
    ).toBeInTheDocument();
  });

  test("checkbox is checked when initialContents.solved is true", async () => {
    const initialContents = {
      ...helpRequestFixtures.oneHelpRequest,
      requestTime: "2024-06-01T10:00",
      solved: true,
    };

    render(
      <Router>
        <HelpRequestForm
          initialContents={initialContents}
          submitAction={vi.fn()}
          buttonLabel="Update"
        />
      </Router>
    );

    const solvedCheckbox = await screen.findByTestId("HelpRequestForm-solved");
    expect(solvedCheckbox).toBeChecked();
  });

  test("cancel button navigates back", async () => {
    render(
      <Router>
        <HelpRequestForm submitAction={vi.fn()} />
      </Router>
    );

    const cancelButton = await screen.findByTestId("HelpRequestForm-cancel");
    fireEvent.click(cancelButton);

    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
  });
});