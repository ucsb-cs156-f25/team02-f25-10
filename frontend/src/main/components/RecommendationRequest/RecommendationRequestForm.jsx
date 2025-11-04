import { Button, Form, Row, Col } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";

function RecommendationRequestForm({
  initialContents,
  submitAction,
  buttonLabel = "Create",
}) {
  // Stryker disable all
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({ defaultValues: initialContents || {} });
  // Stryker restore all

  const navigate = useNavigate();

  // For explanation, see: https://stackoverflow.com/questions/3143070/javascript-regex-iso-datetime
  // Note that even this complex regex may still need some tweaks

  // Stryker disable Regex
  const isodate_regex =
    /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+)|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d)|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d)/i;
  // Stryker restore Regex

  // Stryker disable Regex
  const email_regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;
  // Stryker restore Regex

  return (
    <Form onSubmit={handleSubmit(submitAction)}>
      <Row>
        {initialContents && (
          <Col>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="id">Id</Form.Label>
              <Form.Control
                data-testid="RecommendationRequestForm-id"
                id="id"
                type="text"
                {...register("id")}
                value={initialContents.id}
                disabled
              />
            </Form.Group>
          </Col>
        )}
      </Row>

      <Row>
        <Col>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="requesteremail">Requester Email</Form.Label>
            <Form.Control
              data-testid="RecommendationRequestForm-requesteremail"
              id="requesteremail"
              type="text"
              isInvalid={Boolean(errors.requesteremail)}
              {...register("requesteremail", {
                required: true,
                pattern: email_regex,
              })}
            />
            <Form.Control.Feedback type="invalid">
              {errors.requesteremail && "Requester email is required. "}
              {errors.requesteremail?.type === "pattern" &&
                "Requester email must be in format <email>@<domain>.<extension>"}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>

        <Col>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="professoremail">Professor Email</Form.Label>
            <Form.Control
              data-testid="RecommendationRequestForm-professoremail"
              id="professoremail"
              type="text"
              isInvalid={Boolean(errors.professoremail)}
              {...register("professoremail", {
                required: true,
                pattern: email_regex,
              })}
            />
            <Form.Control.Feedback type="invalid">
              {errors.professoremail && "Professor email is required. "}
              {errors.professoremail?.type === "pattern" &&
                "Professor email must be in format <email>@<domain>.<extension>"}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>

        <Col>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="explanation">Explanation</Form.Label>
            <Form.Control
              data-testid="RecommendationRequestForm-explanation"
              id="explanation"
              type="text"
              isInvalid={Boolean(errors.explanation)}
              {...register("explanation", {
                required: "Explanation is required.",
                maxLength: { value : 255, message : "Explanation must be 255 characters or less."}
              })}
            />
            <Form.Control.Feedback type="invalid">
              {errors.explanation?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>

        <Col>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="daterequested">Date Requested (iso format)</Form.Label>
            <Form.Control
              data-testid="RecommendationRequestForm-daterequested"
              id="daterequested"
              type="datetime-local"
              isInvalid={Boolean(errors.daterequested)}
              {...register("daterequested", {
                required: true,
                pattern: isodate_regex,
              })}
            />
            <Form.Control.Feedback type="invalid">
              {errors.daterequested && "Date requested required and must be in ISO format."}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>

        <Col>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="dateneeded">Date Needed (iso format)</Form.Label>
            <Form.Control
              data-testid="RecommendationRequestForm-dateneeded"
              id="dateneeded"
              type="datetime-local"
              isInvalid={Boolean(errors.dateneeded)}
              {...register("dateneeded", {
                required: true,
                pattern: isodate_regex,
              })}
            />
            <Form.Control.Feedback type="invalid">
              {errors.dateneeded && "Date needed required and must be in ISO format."}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>

        <Col>
          <Form.Group className="mb-3">
            <Form.Check
              data-testid="RecommendationRequestForm-done"
              id="done"
              type="checkbox"
              label="Done"
              {...register("done")}
            />
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col>
          <Button type="submit" data-testid="RecommendationRequestForm-submit">
            {buttonLabel}
          </Button>
          <Button
            variant="Secondary"
            onClick={() => navigate(-1)}
            data-testid="RecommendationRequestForm-cancel"
          >
            Cancel
          </Button>
        </Col>
      </Row>
    </Form>
  );
}

export default RecommendationRequestForm;
