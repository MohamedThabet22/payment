"use client";

import * as React from 'react';
import { isFirebaseConfigured, listenToStudents, listenToPaymentsForStudent } from '@/lib/firebase';
import type { Student, Payment } from '@/types';
import {
  DollarSign,
  Users,
  TrendingUp,
  TrendingDown,
  LayoutDashboard,
  BarChart,
  BrainCircuit,
  UserCheck,
} from 'lucide-react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
} from '@/components/ui/sidebar';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FirebaseSetup from '@/components/firebase-setup';
import KpiCard from '@/components/kpi-card';
import StudentDetailSheet from '@/components/student-detail-sheet';
import { columns } from '@/components/students-table/columns';
import { DataTable } from '@/components/students-table/data-table';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from "@/components/ui/chart"
import { Bar, BarChart as RechartsBarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { addDays, format, startOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';
import { ar } from 'date-fns/locale';

const chartConfig = {
  paid: {
    label: "مدفوع",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export default function Dashboard() {
  const [students, setStudents] = React.useState<Student[]>([]);
  const [allPayments, setAllPayments] = React.useState<Payment[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedStudent, setSelectedStudent] = React.useState<Student | null>(null);
  const [studentPayments, setStudentPayments] = React.useState<Payment[]>([]);
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);

  React.useEffect(() => {
    if (!isFirebaseConfigured) {
      setLoading(false);
      return;
    }

    const unsubscribeStudents = listenToStudents((studentsData) => {
      setStudents(studentsData);
      if (loading) setLoading(false);
    });

    return () => {
      if (unsubscribeStudents) unsubscribeStudents();
    };
  }, [loading]);

  React.useEffect(() => {
    if (!isFirebaseConfigured || students.length === 0) return;

    const unsubscribers = students.map(student => 
      listenToPaymentsForStudent(student.id, (paymentsData) => {
        setAllPayments(prevPayments => {
          const studentPaymentIds = paymentsData.map(p => p.id);
          const otherPayments = prevPayments.filter(p => !studentPaymentIds.includes(p.id));
          const newPaymentsWithStudentId = paymentsData.map(p => ({ ...p, studentId: student.id }));
          return [...otherPayments, ...newPaymentsWithStudentId];
        });
      })
    );
    
    return () => unsubscribers.forEach(unsub => unsub && unsub());
  }, [students]);


  React.useEffect(() => {
    let unsubscribePayments: (() => void) | undefined;
    if (selectedStudent) {
      unsubscribePayments = listenToPaymentsForStudent(selectedStudent.id, (paymentsData) => {
        setStudentPayments(paymentsData);
      });
    }
    return () => {
      if (unsubscribePayments) unsubscribePayments();
    };
  }, [selectedStudent]);

  const handleRowClick = (student: Student) => {
    setSelectedStudent(student);
    setIsSheetOpen(true);
  };

  const totalPaid = React.useMemo(() => students.reduce((sum, s) => sum + s.totalPaid, 0), [students]);
  const totalDue = React.useMemo(() => students.reduce((sum, s) => sum + s.totalDue, 0), [students]);
  const studentsWithDue = React.useMemo(() => students.filter(s => s.totalDue > 0).length, [students]);
  const studentsPaidInFull = React.useMemo(() => students.filter(s => s.totalDue <= 0).length, [students]);

  const today = new Date();
  const dailyPayments = React.useMemo(() => allPayments.filter(p => isSameDay(new Date(p.paymentDate), today)), [allPayments]);
  const dailyTotal = React.useMemo(() => dailyPayments.reduce((sum, p) => sum + (parseFloat(p.paymentName) || 0), 0), [dailyPayments]);

  const monthlyChartData = React.useMemo(() => {
    const start = startOfMonth(today);
    const end = today;
    const daysInMonth = eachDayOfInterval({ start, end });
    
    return daysInMonth.map(day => {
      const paymentsOnDay = allPayments.filter(p => isSameDay(new Date(p.paymentDate), day));
      const total = paymentsOnDay.reduce((sum, p) => sum + (parseFloat(p.paymentName) || 0), 0);
      return {
        date: format(day, "MMM d", { locale: ar }),
        paid: total,
      };
    });
  }, [allPayments, today]);


  if (!isFirebaseConfigured) {
    return <FirebaseSetup />;
  }
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ar-EG", {
      style: "currency",
      currency: "EGP",
    }).format(amount);
  };

  const kpis = [
    { title: 'إجمالي الإيرادات', value: formatCurrency(totalPaid), icon: DollarSign, trend: '' },
    { title: 'الرصيد المستحق', value: formatCurrency(totalDue), icon: TrendingDown, trend: '' },
    { title: 'إجمالي الطلاب', value: students.length, icon: Users, trend: '' },
    { title: 'طلاب عليهم مستحقات', value: studentsWithDue, icon: TrendingUp, trend: '' },
    { title: 'اجمالي الطلاب مكتمل الدفع', value: studentsPaidInFull, icon: UserCheck, trend: '' },
  ];

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar className="w-64" variant="inset" side="right">
          <SidebarHeader>
            <div className="flex items-center gap-2 p-2">
              <BrainCircuit className="text-primary h-8 w-8" />
              <h2 className="text-xl font-semibold">رؤى الدفع</h2>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton isActive>
                  <LayoutDashboard />
                  لوحة التحكم
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <BarChart />
                  التقارير
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
        <SidebarInset className="flex-1">
          <main className="p-4 sm:p-6 lg:p-8">
            <h1 className="text-3xl font-bold tracking-tight mb-6">لوحة التحكم</h1>
            {loading ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                {[...Array(5)].map((_, i) => (
                  <Card key={i} className="p-6">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-8 w-1/2" />
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                {kpis.map(kpi => <KpiCard key={kpi.title} {...kpi} />)}
              </div>
            )}

            <Tabs defaultValue="overview" className="mt-8">
              <TabsList className="grid w-full grid-cols-1 sm:w-auto sm:grid-cols-3">
                <TabsTrigger value="overview">نظرة عامة على الطلاب</TabsTrigger>
                <TabsTrigger value="daily">التقرير اليومي</TabsTrigger>
                <TabsTrigger value="monthly">التقرير الشهري</TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="mt-4">
                <Card>
                  <DataTable
                    columns={columns(handleRowClick)}
                    data={students}
                    loading={loading}
                    onRowClick={handleRowClick}
                  />
                </Card>
              </TabsContent>
              <TabsContent value="daily" className="mt-4">
                 <Card className="p-6">
                  <h3 className="font-semibold text-lg mb-1">ملخص اليوم لـ {format(today, 'd MMMM yyyy', { locale: ar })}</h3>
                  <p className="text-muted-foreground text-sm mb-4">إجمالي التحصيل اليوم: <span className="font-bold text-primary">{formatCurrency(dailyTotal)}</span></p>
                  <div className="divide-y divide-border">
                    {dailyPayments.length > 0 ? dailyPayments.map(p => {
                      const student = students.find(s => s.id === (p as any).studentId);
                      return (
                        <div key={p.id} className="py-3 flex justify-between items-center">
                          <div>
                            <p className="font-medium">{student?.fullName || "طالب غير معروف"}</p>
                            <p className="text-sm text-muted-foreground">{p.paymentType}</p>
                          </div>
                          <p className="font-bold text-lg text-green-600">+{formatCurrency(parseFloat(p.paymentName))}</p>
                        </div>
                      )
                    }) : <p className="text-muted-foreground text-center py-8">لا توجد دفعات مسجلة اليوم.</p>}
                  </div>
                 </Card>
              </TabsContent>
              <TabsContent value="monthly" className="mt-4">
                <Card className="p-6">
                   <h3 className="font-semibold text-lg mb-2">نظرة عامة على المدفوعات الشهرية</h3>
                   <p className="text-muted-foreground text-sm mb-4">نشاط الدفع لشهر {format(today, 'MMMM yyyy', { locale: ar })}</p>
                  <ChartContainer config={chartConfig} className="h-[250px] w-full">
                    <RechartsBarChart accessibilityLayer data={monthlyChartData}>
                      <CartesianGrid vertical={false} />
                      <XAxis
                        dataKey="date"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                      />
                      <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => `ج.م${value}`} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="paid" fill="var(--color-paid)" radius={4} />
                    </RechartsBarChart>
                  </ChartContainer>
                </Card>
              </TabsContent>
            </Tabs>
          </main>
        </SidebarInset>
      </div>
      <StudentDetailSheet
        isOpen={isSheetOpen}
        setIsOpen={setIsSheetOpen}
        student={selectedStudent}
        payments={studentPayments}
      />
    </SidebarProvider>
  );
}
