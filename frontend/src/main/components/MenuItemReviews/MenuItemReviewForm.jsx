import { Button, Form, Row, Col } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";

function MenuItemReviewForm({
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

  const testIdPrefix = "MenuItemReviewForm";

  // For explanation, see: https://stackoverflow.com/questions/3143070/javascript-regex-iso-datetime
  // Note that even this complex regex may still need some tweaks

  // Stryker disable Regex
  const isodate_regex =
    /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+)|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d)|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d)/i;

  const email_regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  // Stryker restore Regex

  return (
    <Form onSubmit={handleSubmit(submitAction)}>
      <Row>
        {initialContents && (
          <Col>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="id">Id</Form.Label>
              <Form.Control
                data-testid={testIdPrefix + "-id"}
                id="id"
                type="text"
                {...register("id")}
                value={initialContents.id}
                disabled
              />
            </Form.Group>
          </Col>
        )}

        <Col>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="itemId">Item ID</Form.Label>
            <Form.Control
              id="itemId"
              type="number"
              isInvalid={Boolean(errors.itemId)}
              {...register("itemId", {
                required: "Item ID is required",
                setValueAs: (v) => (v === "" ? undefined : Number(v)),
              })}
            />
            <Form.Control.Feedback type="invalid">
              {errors.itemId?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>

        <Col>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="reviewerEmail">Reviewer Email</Form.Label>
            <Form.Control
              data-testid={testIdPrefix + "-reviewerEmail"}
              id="reviewerEmail"
              type="text"
              isInvalid={Boolean(errors.reviewerEmail)}
              {...register("reviewerEmail", {
                required: "Reviewer Email is required",
                pattern: {
                  value: email_regex,
                  message: "Invalid email format",
                },
              })}
            />
            <Form.Control.Feedback type="invalid">
              {errors.reviewerEmail?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="stars">Stars (1-5)</Form.Label>
            <Form.Control
              data-testid={testIdPrefix + "-stars"}
              id="stars"
              type="number"
              min="1"
              max="5"
              isInvalid={Boolean(errors.stars)}
              {...register("stars", {
                required: "Stars are required",
                min: { value: 1, message: "Must be at least 1" },
                max: { value: 5, message: "Cannot exceed 5" },
                setValueAs: (v) => (v === "" ? undefined : Number(v))
              })}
            />
            <Form.Control.Feedback type="invalid">
              {errors.stars?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>

        <Col>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="dateReviewed">Date Reviewed</Form.Label>
            <Form.Control
              id="dateReviewed"
              type="datetime-local"
              isInvalid={Boolean(errors.dateReviewed)}
              {...register("dateReviewed", {
                required: true,
                pattern: isodate_regex,
              })}
            />
            <Form.Control.Feedback type="invalid">
              {errors.dateReviewed && "Date Reviewed is required"}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="comments">Comments</Form.Label>
            <Form.Control
              data-testid={testIdPrefix + "-comments"}
              id="comments"
              type="text"
              isInvalid={Boolean(errors.comments)}
              {...register("comments", {
                required: "A comment is required",
                maxLength: {
                  value: 255,
                  message: "Max length is 255 characters",
                },
              })}
            />
            <Form.Control.Feedback type="invalid">
              {errors.comments?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col>
          <Button type="submit">
            {buttonLabel}
          </Button>
          <Button
            variant="Secondary"
            onClick={() => navigate(-1)}
            data-testid={testIdPrefix + "-cancel"}
          >
            Cancel
          </Button>
        </Col>
      </Row>
    </Form>
  );
}

export default MenuItemReviewForm;
