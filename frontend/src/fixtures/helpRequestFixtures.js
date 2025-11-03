const helpRequestFixtures = {
  oneHelpRequest: {
    id: 1,
    requesterEmail: "kham@ucsb.edu",
    teamId: "f25-10",
    tableOrBreakoutRoom: "table 10",
    requestTime: "2024-06-01T10:00:00",
    explanation: "Need help with project",
    solved: false,
  },
  threeHelpRequests: [
    {
      id: 1,
      requesterEmail: "kham@ucsb.edu",
      teamId: "f25-10",
      tableOrBreakoutRoom: "table 10",
      requestTime: "2024-06-01T10:00:00",
      explanation: "Need help with project",
      solved: false,
    },
    {
      id: 2,
      requesterEmail: "kham2@ucsb.edu",
      teamId: "f25-11",
      tableOrBreakoutRoom: "table 11",
      requestTime: "2023-02-01T10:01:20",
      explanation: "Github issues",
      solved: true,
    },
    {
      id: 3,
      requesterEmail: "kham3@ucsb.edu",
      teamId: "f25-12",
      tableOrBreakoutRoom: "table 12",
      requestTime: "2014-12-12T10:10:10",
      explanation: "testing failures",
      solved: false,
    },
  ],
};

export { helpRequestFixtures };
