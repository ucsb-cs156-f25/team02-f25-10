package edu.ucsb.cs156.example.web;

import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;

import com.microsoft.playwright.Page;
import com.microsoft.playwright.options.AriaRole;
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
public class MenuItemReviewWebIT extends WebTestCase {
  @Test
  public void admin_user_can_create_edit_delete_menuitemreview() throws Exception {
    setupUser(true);

    page.getByText("Menu Item Reviews").click();

    page.getByText("Create Menu Item Review").click();
    assertThat(page.getByText("Create Menu Item Review")).isVisible();
    page.getByTestId("MenuItemReviewForm-itemId").fill("2");
    page.getByTestId("MenuItemReviewForm-reviewerEmail").fill("johndoe@ucsb.edu");
    page.getByTestId("MenuItemReviewForm-stars").fill("3");
    page.getByLabel("Date Reviewed").fill("2025-10-31T20:33");
    page.getByTestId("MenuItemReviewForm-comments").fill("Very good");
    page.getByRole(AriaRole.BUTTON, new Page.GetByRoleOptions().setName("Create")).click();

    assertThat(page.getByTestId("MenuItemReviewTable-cell-row-0-col-reviewerEmail"))
        .hasText("johndoe@ucsb.edu");

    page.getByTestId("MenuItemReviewTable-cell-row-0-col-Edit-button").click();
    assertThat(page.getByText("Edit Menu Item Review")).isVisible();
    page.getByTestId("MenuItemReviewForm-comments").fill("THE BEST");
    page.getByRole(AriaRole.BUTTON, new Page.GetByRoleOptions().setName("Update")).click();

    assertThat(page.getByTestId("MenuItemReviewTable-cell-row-0-col-comments")).hasText("THE BEST");

    page.getByTestId("MenuItemReviewTable-cell-row-0-col-Delete-button").click();

    assertThat(page.getByTestId("MenuItemReviewTable-cell-row-0-col-itemId")).not().isVisible();
  }

  @Test
  public void regular_user_cannot_create_menuitemreview() throws Exception {
    setupUser(false);

    page.getByText("Menu Item Reviews").click();

    assertThat(page.getByText("Create Menu Item Reviews")).not().isVisible();
    assertThat(page.getByTestId("MenuItemReviewTable-cell-row-0-col-itemId")).not().isVisible();
  }
}
