"use client";

import * as React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import type { Student, Payment } from '@/types';
import PaymentAnalysis from './payment-analysis';
import { Phone, User, DollarSign, AlertCircle } from 'lucide-react';

interface StudentDetailSheetProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  student: Student | null;
  payments: Payment[];
}

export default function StudentDetailSheet({ isOpen, setIsOpen, student, payments }: StudentDetailSheetProps) {
  if (!student) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ar-EG", {
      style: "currency",
      currency: "EGP",
    }).format(amount);
  };
  
  const paymentStatus = student.totalDue <= 0 
    ? { text: 'مسدد بالكامل', variant: 'secondary', className: 'bg-green-100 text-green-800 border-green-200' } 
    : { text: 'عليه مستحقات', variant: 'destructive' as const };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="w-full sm:max-w-xl md:max-w-2xl p-0">
        <ScrollArea className="h-full">
          <div className="p-6">
            <SheetHeader className="mb-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center ml-4">
                    <User className="w-8 h-8 text-muted-foreground"/>
                </div>
                <div>
                    <SheetTitle className="text-2xl">{student.fullName}</SheetTitle>
                    <SheetDescription className="flex items-center gap-2">
                        <Phone className="w-4 h-4 ml-1" /> {student.phone}
                    </SheetDescription>
                </div>
              </div>
            </SheetHeader>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="bg-card border rounded-lg p-4">
                <h4 className="text-sm text-muted-foreground">الحالة</h4>
                <Badge variant={paymentStatus.variant} className={paymentStatus.className}>{paymentStatus.text}</Badge>
              </div>
              <div className="bg-card border rounded-lg p-4">
                <h4 className="text-sm text-muted-foreground flex items-center gap-1"><DollarSign className="w-4 h-4 ml-1"/> إجمالي المدفوع</h4>
                <p className="text-xl font-bold">{formatCurrency(student.totalPaid)}</p>
              </div>
              <div className="bg-card border rounded-lg p-4">
                <h4 className="text-sm text-muted-foreground flex items-center gap-1"><AlertCircle className="w-4 h-4 ml-1"/> المبلغ المستحق</h4>
                <p className="text-xl font-bold text-destructive">{formatCurrency(student.totalDue)}</p>
              </div>
            </div>

            <Separator className="my-6" />

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">سجل المدفوعات</h3>
              <div className="space-y-3">
                {payments.length > 0 ? (
                  payments.map((payment) => (
                    <div key={payment.id} className="flex justify-between items-center bg-card border p-3 rounded-lg">
                      <div>
                        <p className="font-medium">{payment.paymentType}</p>
                        <p className="text-sm text-muted-foreground">{new Date(payment.paymentDate).toLocaleDateString('ar-EG')}</p>
                      </div>
                      <p className="text-lg font-semibold text-green-600">+{formatCurrency(parseFloat(payment.paymentName))}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">لا يوجد سجل مدفوعات.</p>
                )}
              </div>
            </div>

            <Separator className="my-6" />
            
            <PaymentAnalysis student={student} payments={payments} />
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
