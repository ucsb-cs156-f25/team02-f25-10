package edu.ucsb.cs156.example.web;

import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;

import edu.ucsb.cs156.example.WebTestCase;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.annotation.DirtiesContext.ClassMode;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
@ActiveProfiles("integration")
@DirtiesContext(classMode = ClassMode.BEFORE_EACH_TEST_METHOD)
public class RecommendationRequestWebIT extends WebTestCase {
  @Test
  public void admin_user_can_create_edit_delete_recommendation_request() throws Exception {
    setupUser(true);

    page.getByText("Recommendation Request").click();

    page.getByText("Create RecommendationRequest").click();
    assertThat(page.getByText("Create New Recommendation Request")).isVisible();
    page.getByTestId("RecommendationRequestForm-requesteremail").fill("test1@mail.com");
    page.getByTestId("RecommendationRequestForm-professoremail").fill("test2@mail.com");
    page.getByTestId("RecommendationRequestForm-explanation").fill("Test request");
    page.getByTestId("RecommendationRequestForm-daterequested").fill("2025-10-10T10:10");
    page.getByTestId("RecommendationRequestForm-dateneeded").fill("2025-11-10T10:10");
    page.getByTestId("RecommendationRequestForm-done").click();

    page.getByTestId("RecommendationRequestForm-submit").click();

    assertThat(page.getByTestId("RecommendationRequestTable-cell-row-0-col-explanation"))
        .hasText("Test request");

    page.getByTestId("RecommendationRequestTable-cell-row-0-col-Edit-button").click();
    assertThat(page.getByText("Edit RecommendationRequest")).isVisible();
    page.getByTestId("RecommendationRequestForm-explanation").fill("Second request test");
    page.getByTestId("RecommendationRequestForm-submit").click();

    assertThat(page.getByTestId("RecommendationRequestTable-cell-row-0-col-explanation"))
        .hasText("Second request test");

    page.getByTestId("RecommendationRequestTable-cell-row-0-col-Delete-button").click();

    assertThat(page.getByTestId("RecommendationRequestTable-cell-row-0-col-name"))
        .not()
        .isVisible();
  }

  @Test
  public void regular_user_cannot_create_recommendation_request() throws Exception {
    setupUser(false);

    page.getByText("Recommendation Request").click();

    assertThat(page.getByText("Create RecommendationRequest")).not().isVisible();
    assertThat(page.getByTestId("RecommendationRequestTable-cell-row-0-col-name"))
        .not()
        .isVisible();
  }
}
