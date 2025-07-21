"use client"

import * as React from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import type { Student } from "@/types"
import type { ColumnDef } from "@tanstack/react-table"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"

interface DataTableProps {
  columns: ColumnDef<Student>[];
  data: Student[];
  loading: boolean;
  onRowClick: (student: Student) => void;
}

export function DataTable({
  data,
  loading,
  onRowClick,
}: DataTableProps) {
  const [filter, setFilter] = React.useState("")
  const [sort, setSort] = React.useState({ key: "fullName", order: "asc" })

  const handleSort = (key: string) => {
    if (sort.key === key) {
      setSort({ ...sort, order: sort.order === "asc" ? "desc" : "asc" })
    } else {
      setSort({ key, order: "asc" })
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ar-EG", {
      style: "currency",
      currency: "EGP",
    }).format(amount);
  };
  
  const filteredData = React.useMemo(() => {
    return data
      .filter(
        (item) =>
          item.fullName.toLowerCase().includes(filter.toLowerCase()) ||
          item.phone.includes(filter)
      )
      .sort((a, b) => {
        const aVal = (a as any)[sort.key];
        const bVal = (b as any)[sort.key];
        if (aVal < bVal) return sort.order === 'asc' ? -1 : 1;
        if (aVal > bVal) return sort.order === 'asc' ? 1 : -1;
        return 0;
      });
  }, [data, filter, sort])

  return (
    <div>
      <div className="flex items-center p-4">
        <Input
          placeholder="تصفية بالاسم أو الهاتف..."
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border-t">
        <Table>
          <TableHeader>
            <TableRow>
                <TableHead onClick={() => handleSort('fullName')} className="cursor-pointer">الطالب</TableHead>
                <TableHead onClick={() => handleSort('totalPaid')} className="cursor-pointer text-right">إجمالي المدفوع</TableHead>
                <TableHead onClick={() => handleSort('totalDue')} className="cursor-pointer text-right">المبلغ المستحق</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              [...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={5}>
                    <div className="flex items-center gap-4">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-[250px]" />
                        <Skeleton className="h-4 w-[200px]" />
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : filteredData.length > 0 ? (
              filteredData.map((row) => (
                <TableRow key={row.id}>
                    <TableCell>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center ml-3">
                                <span className="font-bold text-primary">{row.fullName.charAt(0)}</span>
                            </div>
                            <div>
                                <div className="font-medium">{row.fullName}</div>
                                <div className="text-sm text-muted-foreground">{row.phone}</div>
                            </div>
                        </div>
                    </TableCell>
                    <TableCell className="text-right">{formatCurrency((row as any).totalPaid)}</TableCell>
                    <TableCell className="text-right text-destructive">{formatCurrency((row as any).totalDue)}</TableCell>
                    <TableCell>
                        {(row as any).totalDue <= 0 ? (
                            <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">مسدد بالكامل</Badge>
                          ) : (
                            <Badge variant="destructive">عليه مستحقات</Badge>
                          )}
                    </TableCell>
                    <TableCell>
                        <Button variant="outline" size="sm" onClick={() => onRowClick(row)}>
                            عرض التفاصيل
                        </Button>
                    </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  لم يتم العثور على نتائج.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
