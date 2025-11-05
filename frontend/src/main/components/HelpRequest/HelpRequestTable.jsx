import React from "react";
import OurTable, { ButtonColumn } from "main/components/OurTable";

import { useBackendMutation } from "main/utils/useBackend";
import {
  cellToAxiosParamsDelete,
  onDeleteSuccess,
} from "main/utils/helpRequestUtils";
import { useNavigate } from "react-router";
import { hasRole } from "main/utils/useCurrentUser";

export default function HelpRequestTable({ helpRequests, currentUser }) {
  const navigate = useNavigate();

  const editCallback = (cell) => {
    navigate(`/helprequest/edit/${cell.row.original.id}`);
  };

  // Stryker disable all : hard to test for query caching
  const deleteMutation = useBackendMutation(
    cellToAxiosParamsDelete,
    { onSuccess: onDeleteSuccess },
    ["/api/helprequest/all"],
  );
  // Stryker restore all

  // Stryker disable next-line all
  const deleteCallback = async (cell) => {
    deleteMutation.mutate(cell);
  };

  const columns = [
    { header: "id", accessorKey: "id" },
    { header: "Requester Email", accessorKey: "requesterEmail" },
    { header: "Team Id", accessorKey: "teamId" },
    { header: "Table / Breakout Room", accessorKey: "tableOrBreakoutRoom" },
    { header: "Request Time", accessorKey: "requestTime" },
    { header: "Explanation", accessorKey: "explanation" },
    { header: "Solved", accessorKey: "solved" },
  ];

  if (hasRole(currentUser, "ROLE_ADMIN")) {
    columns.push(
      ButtonColumn("Edit", "primary", editCallback, "HelpRequestTable"),
    );
    columns.push(
      ButtonColumn("Delete", "danger", deleteCallback, "HelpRequestTable"),
    );
  }

  return (
    <OurTable
      data={helpRequests}
      columns={columns}
      testid={"HelpRequestTable"}
    />
  );
}