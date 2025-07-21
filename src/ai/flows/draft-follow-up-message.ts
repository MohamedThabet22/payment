'use server';
/**
 * @fileOverview AI agent to draft personalized follow-up messages for students with potential payment delays.
 *
 * - draftFollowUpMessage - A function that generates the follow-up message.
 * - DraftFollowUpMessageInput - The input type for the draftFollowUpMessage function.
 * - DraftFollowUpMessageOutput - The return type for the draftFollowUpMessage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DraftFollowUpMessageInputSchema = z.object({
  studentId: z.string().describe('The ID of the student.'),
  studentName: z.string().describe('The name of the student.'),
  amountDue: z.number().describe('The amount due by the student.'),
  paymentHistory: z.array(z.object({
    paymentName: z.string(),
    paymentDate: z.string(),
    paymentType: z.string(),
  })).describe('The payment history of the student.'),
  expectedPaymentDate: z.string().describe('The expected payment date.'),
});
export type DraftFollowUpMessageInput = z.infer<typeof DraftFollowUpMessageInputSchema>;

const DraftFollowUpMessageOutputSchema = z.object({
  message: z.string().describe('The drafted follow-up message for the student.'),
  urgency: z.enum(['high', 'medium', 'low']).describe('The urgency level of the follow-up message.'),
});
export type DraftFollowUpMessageOutput = z.infer<typeof DraftFollowUpMessageOutputSchema>;

export async function draftFollowUpMessage(input: DraftFollowUpMessageInput): Promise<DraftFollowUpMessageOutput> {
  return draftFollowUpMessageFlow(input);
}

const draftFollowUpMessagePrompt = ai.definePrompt({
  name: 'draftFollowUpMessagePrompt',
  input: {schema: DraftFollowUpMessageInputSchema},
  output: {schema: DraftFollowUpMessageOutputSchema},
  prompt: `You are an AI assistant tasked with drafting personalized follow-up messages to students regarding their payments.

  Based on the student's payment history, current amount due, and expected payment date, draft a follow-up message that encourages timely payment.

  Student ID: {{{studentId}}}
  Student Name: {{{studentName}}}
  Amount Due: {{{amountDue}}}
  Payment History: {{#each paymentHistory}}{{{paymentName}}} - {{{paymentDate}}} - {{{paymentType}}}\n{{/each}}
  Expected Payment Date: {{{expectedPaymentDate}}}

  Analyze the payment history to determine the urgency of the message. If the student has a history of late payments or a large amount due, set the urgency to "high". If the student usually pays on time, but the payment is slightly delayed, set the urgency to "medium" or "low".

  The message should be polite, professional, and encouraging. Clearly state the amount due and the expected payment date.  Suggest possible payment plans if the amount is large.

  Output the message and the urgency level.
  `,
});

const draftFollowUpMessageFlow = ai.defineFlow(
  {
    name: 'draftFollowUpMessageFlow',
    inputSchema: DraftFollowUpMessageInputSchema,
    outputSchema: DraftFollowUpMessageOutputSchema,
  },
  async input => {
    const {output} = await draftFollowUpMessagePrompt(input);
    return output!;
  }
);
