import { initializeApp, getApps, getApp, FirebaseOptions } from "firebase/app";
import { getFirestore, collection, onSnapshot, doc, Unsubscribe } from "firebase/firestore";
import type { Student, Payment } from '@/types';

const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export const isFirebaseConfigured = !!firebaseConfig.apiKey && !!firebaseConfig.projectId;

const app = isFirebaseConfigured && !getApps().length ? initializeApp(firebaseConfig) : (isFirebaseConfigured ? getApp() : undefined);
const db = app ? getFirestore(app) : undefined;

export const listenToStudents = (callback: (students: Student[]) => void): Unsubscribe | undefined => {
    if (!db) return;
    const studentsCollection = collection(db, "students");
    return onSnapshot(studentsCollection, (snapshot) => {
        const students = snapshot.docs.map(doc => ({
            id: doc.id,
            fullName: doc.data().fullName || "",
            phone: doc.data().phone || "",
            totalPaid: doc.data().totalPaid || 0,
            totalDue: doc.data().totalDue || 0,
        } as Student));
        callback(students);
    }, (error) => {
        console.error("Error listening to students: ", error);
    });
};

export const listenToPaymentsForStudent = (studentId: string, callback: (payments: Payment[]) => void): Unsubscribe | undefined => {
    if (!db) return;
    const paymentsCollection = collection(db, `students/${studentId}/payments`);
    return onSnapshot(paymentsCollection, (snapshot) => {
        const payments = snapshot.docs.map(doc => ({
            id: doc.id,
            paymentName: doc.data().paymentName || "0",
            paymentDate: doc.data().paymentDate || "",
            paymentType: doc.data().paymentType || "",
        } as Payment));
        callback(payments);
    }, (error) => {
        console.error(`Error listening to payments for student ${studentId}: `, error);
    });
}
