"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

const envVars = [
  "NEXT_PUBLIC_FIREBASE_API_KEY",
  "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
  "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
  "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
  "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
  "NEXT_PUBLIC_FIREBASE_APP_ID",
];

export default function FirebaseSetup() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="max-w-2xl">
        <CardHeader>
          <div className="flex items-center gap-4">
            <AlertTriangle className="h-12 w-12 text-destructive" />
            <div>
              <CardTitle className="text-2xl">Firebase Configuration Missing</CardTitle>
              <CardDescription>
                To use this application, you need to set up your Firebase project credentials.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            Please create a <code className="bg-muted px-1 py-0.5 rounded-sm font-mono text-sm">.env.local</code> file in the root of your project and add the following environment variables with your Firebase project's values:
          </p>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
            <code className="text-sm font-mono">
              {envVars.map(v => `${v}=your_value_here`).join('\n')}
            </code>
          </pre>
          <p className="mt-4 text-sm text-muted-foreground">
            You can find these values in your Firebase project settings. After adding the variables, you will need to restart your development server for the changes to take effect.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
