import React from "react";
import { Skeleton } from "@/components/ui/skeleton"; // Adjust the import according to your skeleton component location
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

const DataTableSkeleton = ({
  columns,
  rows = 10,
}: {
  columns: number;
  rows: number;
}) => {
  return (
    <div className="w-full p-4">
      <div className="overflow-x-auto">
        <Table className="min-w-full divide-y divide-gray-200">
          <TableHeader>
            <TableRow>
              {Array.from({ length: columns }).map((_, index) => (
                <TableHead key={index} className="px-6 py-3 bg-gray-50">
                  <Skeleton className="h-4 w-3/4" />
                </TableHead>
              ))}
              <th className="px-6 py-3 bg-gray-50">
                <Skeleton className="h-4 w-3/4" />
              </th>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <TableRow key={rowIndex} className="bg-white">
                {Array.from({ length: columns }).map((_, colIndex) => (
                  <TableCell key={colIndex} className="px-6 py-4">
                    <Skeleton className="h-4 w-full" />
                  </TableCell>
                ))}
                <td className="px-6 py-4">
                  <Skeleton className="h-4 w-full" />
                </td>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default DataTableSkeleton;
