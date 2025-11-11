import { Button, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";

function UCSBOrganizationForm({
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
  const testIdPrefix = "UCSBOrganizationForm";

  return (
    <Form onSubmit={handleSubmit(submitAction)}>
      {/* orgcode field */}
      {initialContents ? (
        // Read-only when editing
        <Form.Group className="mb-3">
          <Form.Label htmlFor="orgcode">Org Code</Form.Label>
          <Form.Control
            data-testid={testIdPrefix + "-orgcode"}
            id="orgcode"
            type="text"
            {...register("orgcode")}
            value={initialContents.orgcode}
            disabled
          />
        </Form.Group>
      ) : (
        // Editable when creating
        <Form.Group className="mb-3">
          <Form.Label htmlFor="orgcode">Org Code</Form.Label>
          <Form.Control
            data-testid={testIdPrefix + "-orgcode"}
            id="orgcode"
            type="text"
            isInvalid={Boolean(errors.orgcode)}
            {...register("orgcode", {
              required: "Organization code is required.",
              maxLength: {
                value: 10,
                message: "Max length 10 characters",
              },
            })}
          />
          <Form.Control.Feedback type="invalid">
            {errors.orgcode?.message}
          </Form.Control.Feedback>
        </Form.Group>
      )}

      {/* orgTranslationShort field */}
      <Form.Group className="mb-3">
        <Form.Label htmlFor="orgTranslationShort">Short Translation</Form.Label>
        <Form.Control
          data-testid={testIdPrefix + "-orgTranslationShort"}
          id="orgTranslationShort"
          type="text"
          isInvalid={Boolean(errors.orgTranslationShort)}
          {...register("orgTranslationShort", {
            required: "Short translation is required.",
            maxLength: {
              value: 20,
              message: "Max length 20 characters",
            },
          })}
        />
        <Form.Control.Feedback type="invalid">
          {errors.orgTranslationShort?.message}
        </Form.Control.Feedback>
      </Form.Group>

      {/* orgTranslation field */}
      <Form.Group className="mb-3">
        <Form.Label htmlFor="orgTranslation">Full Translation</Form.Label>
        <Form.Control
          data-testid={testIdPrefix + "-orgTranslation"}
          id="orgTranslation"
          type="text"
          isInvalid={Boolean(errors.orgTranslation)}
          {...register("orgTranslation", {
            required: "Full translation is required.",
          })}
        />
        <Form.Control.Feedback type="invalid">
          {errors.orgTranslation?.message}
        </Form.Control.Feedback>
      </Form.Group>

      {/* inactive field */}
      <Form.Group className="mb-3">
        <Form.Check
          data-testid={testIdPrefix + "-inactive"}
          id="inactive"
          label="Inactive?"
          type="checkbox"
          {...register("inactive")}
          defaultChecked={initialContents ? initialContents.inactive : false}
        />
      </Form.Group>

      {/* buttons */}
      <Button type="submit" data-testid={testIdPrefix + "-submit"}>
        {buttonLabel}
      </Button>
      <Button
        variant="Secondary"
        onClick={() => navigate(-1)}
        data-testid={testIdPrefix + "-cancel"}
      >
        Cancel
      </Button>
    </Form>
  );
}

export default UCSBOrganizationForm;
