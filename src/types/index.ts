export interface Payment {
  id: string;
  paymentName: string; // Represents the amount of the payment
  paymentDate: string;
  paymentType: string; // Represents the term or description
  studentId?: string; // Optional: To link payment to student for daily report
}

export interface Student {
  id: string;
  fullName: string;
  phone: string;
  totalPaid: number;
  totalDue: number;
  payments?: Payment[]; // Optional: for holding fetched sub-collection data
}
