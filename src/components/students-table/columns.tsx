"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { Student } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown, MoreHorizontal, User } from "lucide-react";

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ar-EG", {
      style: "currency",
      currency: "EGP",
    }).format(amount);
  };

export const columns = (onViewDetails: (student: Student) => void): ColumnDef<Student>[] => [
  {
    accessorKey: "fullName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          الطالب
          <ArrowUpDown className="mr-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
        const student = row.original;
        return (
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center ml-3">
                    <User className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                    <div className="font-medium">{student.fullName}</div>
                    <div className="text-sm text-muted-foreground">{student.phone}</div>
                </div>
            </div>
        )
    }
  },
  {
    accessorKey: "totalPaid",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="text-left w-full justify-start"
      >
        إجمالي المدفوع
        <ArrowUpDown className="mr-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("totalPaid"));
      return <div className="text-left font-medium">{formatCurrency(amount)}</div>;
    },
  },
  {
    accessorKey: "totalDue",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="text-left w-full justify-start"
      >
        المبلغ المستحق
        <ArrowUpDown className="mr-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("totalDue"));
      return <div className="text-left font-medium text-destructive">{formatCurrency(amount)}</div>;
    },
  },
  {
    id: "status",
    header: "الحالة",
    cell: ({ row }) => {
      const student = row.original;
      const isPaidUp = student.totalDue <= 0;
      return isPaidUp ? (
        <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">مسدد بالكامل</Badge>
      ) : (
        <Badge variant="destructive">عليه مستحقات</Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const student = row.original;
      return (
        <Button variant="outline" size="sm" onClick={() => onViewDetails(student)}>
            عرض التفاصيل
        </Button>
      );
    },
  },
];
