import React from "react";
import MenuItemReviewTable from "main/components/MenuItemReviews/MenuItemReviewTable";
import { menuItemReviewFixtures } from "fixtures/menuItemReviewFixtures";
import { currentUserFixtures } from "fixtures/currentUserFixtures";
import { http, HttpResponse } from "msw";

export default {
  title: "components/MenuItemReviews/MenuItemReviewTable",
  component: MenuItemReviewTable,
};

const Template = (args) => {
  return <MenuItemReviewTable {...args} />;
};

export const Empty = Template.bind({});

Empty.args = {
  menuItemReviews: [],
  currentUser: currentUserFixtures.userOnly,
};

export const ThreeReviewsOrdinaryUser = Template.bind({});

ThreeReviewsOrdinaryUser.args = {
  menuItemReviews: menuItemReviewFixtures.threeMenuItemReviews,
  currentUser: currentUserFixtures.userOnly,
};

export const ThreeReviewsAdminUser = Template.bind({});
ThreeReviewsAdminUser.args = {
  menuItemReviews: menuItemReviewFixtures.threeMenuItemReviews,
  currentUser: currentUserFixtures.adminUser,
};

ThreeReviewsAdminUser.parameters = {
  msw: [
    http.delete("/api/menuitemreviews", () => {
      return HttpResponse.json(
        { message: "Menu Item Review deleted successfully" },
        { status: 200 },
      );
    }),
  ],
};
