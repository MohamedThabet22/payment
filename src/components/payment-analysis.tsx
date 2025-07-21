"use client";

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { predictPaymentDelay, PredictPaymentDelayOutput } from '@/ai/flows/predict-payment-delays';
import type { Student, Payment } from '@/types';
import { BrainCircuit, Copy, Sparkles, Loader2 } from 'lucide-react';
import { Badge } from './ui/badge';

interface PaymentAnalysisProps {
  student: Student;
  payments: Payment[];
}

export default function PaymentAnalysis({ student, payments }: PaymentAnalysisProps) {
  const [analysis, setAnalysis] = React.useState<PredictPaymentDelayOutput | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const { toast } = useToast();

  const handleAnalyze = async () => {
    setIsLoading(true);
    setAnalysis(null);
    try {
      const input = {
        studentId: student.id,
        paymentHistory: payments.map(p => ({ ...p, paymentName: p.paymentName.toString() })),
        studentDetails: {
          cardName: student.fullName,
          phone: student.phone,
          balance: student.totalPaid,
          due: student.totalDue,
        },
      };
      const result = await predictPaymentDelay(input);
      setAnalysis(result);
    } catch (error) {
      console.error('Error analyzing payment:', error);
      toast({
        title: 'فشل التحليل',
        description: 'لا يمكن إجراء تحليل الدفع. يرجى المحاولة مرة أخرى.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCopy = () => {
    if (analysis?.followUpMessage) {
      navigator.clipboard.writeText(analysis.followUpMessage);
      toast({
        title: 'تم النسخ إلى الحافظة',
        description: 'تم نسخ رسالة المتابعة.',
      });
    }
  };

  return (
    <Card className="bg-secondary/50 border-dashed">
      <CardHeader>
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <BrainCircuit className="w-6 h-6 text-primary" />
                <div>
                    <CardTitle>التحليل التنبؤي</CardTitle>
                    <CardDescription>استخدم الذكاء الاصطناعي للتنبؤ بتأخيرات الدفع وصياغة الردود.</CardDescription>
                </div>
            </div>
            <Button onClick={handleAnalyze} disabled={isLoading}>
                {isLoading ? (
                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                ) : (
                    <Sparkles className="ml-2 h-4 w-4" />
                )}
                تحليل
            </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading && (
            <div className="text-center p-8">
                <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground">تحليل أنماط الدفع ...</p>
            </div>
        )}
        {analysis && (
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">نتيجة التنبؤ</h4>
              {analysis.isDelayLikely ? (
                <Badge variant="destructive">من المحتمل التأخير</Badge>
              ) : (
                <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">من غير المحتمل التأخير</Badge>
              )}
            </div>
            <div>
              <h4 className="font-semibold mb-2">متابعة مقترحة</h4>
              <p className="text-sm">في غضون <span className="font-bold text-primary">{analysis.suggestedFollowUpDays} أيام</span></p>
            </div>
            <div>
                <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold">مسودة رسالة المتابعة</h4>
                    <Button variant="ghost" size="icon" onClick={handleCopy}>
                        <Copy className="h-4 w-4" />
                    </Button>
                </div>
                <Textarea
                    readOnly
                    value={analysis.followUpMessage}
                    className="h-40 bg-background"
                    aria-label="رسالة المتابعة"
                />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
