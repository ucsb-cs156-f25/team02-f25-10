import React from "react";
<<<<<<<< HEAD:frontend/src/stories/components/UCSBOrganization/UCSBOrganizationForm.stories.jsx
import UCSBOrganizationForm from "main/components/UCSBOrganization/UCSBOrganizationForm";
import { ucsbOrganizationFixtures } from "fixtures/ucsbOrganizationFixtures";

export default {
  title: "components/UCSBOrganization/UCSBOrganizationForm",
  component: UCSBOrganizationForm,
};

const Template = (args) => {
  return <UCSBOrganizationForm {...args} />;
========
import MenuItemReviewForm from "main/components/MenuItemReviews/MenuItemReviewForm";
import { menuItemReviewFixtures } from "fixtures/menuItemReviewFixtures";

export default {
  title: "components/MenuItemReviews/MenuItemReviewForm",
  component: MenuItemReviewForm,
};

const Template = (args) => {
  return <MenuItemReviewForm {...args} />;
>>>>>>>> origin/main:frontend/src/stories/components/MenuItemReviews/MenuItemReview.stories.jsx
};

export const Create = Template.bind({});

Create.args = {
  buttonLabel: "Create",
  submitAction: (data) => {
    console.log("Submit was clicked with data: ", data);
    window.alert("Submit was clicked with data: " + JSON.stringify(data));
  },
};

export const Update = Template.bind({});

Update.args = {
<<<<<<<< HEAD:frontend/src/stories/components/UCSBOrganization/UCSBOrganizationForm.stories.jsx
  initialContents: ucsbOrganizationFixtures.oneOrganization[0],
========
  initialContents: menuItemReviewFixtures.oneMenuItemReview,
>>>>>>>> origin/main:frontend/src/stories/components/MenuItemReviews/MenuItemReview.stories.jsx
  buttonLabel: "Update",
  submitAction: (data) => {
    console.log("Submit was clicked with data: ", data);
    window.alert("Submit was clicked with data: " + JSON.stringify(data));
  },
};
