const recommendationRequestFixtures = {
  oneRecommendationRequest: {
    id: 1,
    requesteremail: "em1@mail.com",
    professoremail: "em2@mail.com",
    explanation: "please recommend",
    daterequested: "2025-10-10T10:10",
    dateneeded: "2025-10-10T10:10",
    done: true
  },
  threeRecommendationRequests: [
    {
        id: 1,
        requesteremail: "em1@mail.com",
        professoremail: "em2@mail.com",
        explanation: "please recommend",
        daterequested: "2025-10-10T10:10",
        dateneeded: "2025-10-10T10:10",
        done: true
    },
    {
        id: 2,
        requesteremail: "ai1@mail.com",
        professoremail: "ai2@mail.com",
        explanation: "please dont recommend",
        daterequested: "2025-11-10T10:10",
        dateneeded: "2025-11-10T10:10",
        done: false
    },
    {
        id: 3,
        requesteremail: "le1@mail.com",
        professoremail: "le2@mail.com",
        explanation: "i request a recommendation",
        daterequested: "2025-12-10T10:10",
        dateneeded: "2025-12-10T10:10",
        done: true
    },
  ],
};

export { recommendationRequestFixtures };
