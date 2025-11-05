const menuItemReviewFixtures = {
    oneMenuItemReview: {
        id: 1,
        itemId: 1,
        reviewerEmail: "johndoe@ucsb.edu",
        stars: 3,
        dateReviewed: "2025-10-31T20:33:40",
        comments: "Pretty good",
    },
    threeMenuItemReviews: [
        {
            id: 1,
            itemId: 1,
            reviewerEmail: "johndoe@ucsb.edu",
            stars: 3,
            dateReviewed: "2025-10-31T20:33:40",
            comments: "Pretty good"
        },
        {
            id: 2,
            itemId: 2,
            reviewerEmail: "kevin@ucsb.edu",
            stars: 5,
            dateReviewed: "2025-11-01T20:33:40",
            comments: "Very yummy"
        },
        {
            id: 3,
            itemId: 2,
            reviewerEmail: "michael@ucsb.edu",
            stars: 1,
            dateReviewed: "2025-11-02T20:33:40",
            comments: "Bad"
        },
    ],
};

export{menuItemReviewFixtures};
