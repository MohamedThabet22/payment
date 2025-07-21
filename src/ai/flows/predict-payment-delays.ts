// use server'

/**
 * @fileOverview AI agent that analyzes student payment patterns, predicts potential delays,
 * and suggests optimal follow-up times.
 *
 * - predictPaymentDelay - A function that handles the payment delay prediction process.
 * - PredictPaymentDelayInput - The input type for the predictPaymentDelay function.
 * - PredictPaymentDelayOutput - The return type for the predictPaymentDelay function.
 */

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PredictPaymentDelayInputSchema = z.object({
  studentId: z.string().describe('The ID of the student.'),
  paymentHistory: z.array(
    z.object({
      paymentName: z.string(),
      paymentDate: z.string(),
      paymentType: z.string(),
    })
  ).describe('The payment history of the student.'),
  studentDetails: z.object({
    cardName: z.string(),
    phone: z.string(),
    balance: z.number(),
    due: z.number(),
  }).describe('Details of the student including name, phone, balance and due amount.'),
});
export type PredictPaymentDelayInput = z.infer<typeof PredictPaymentDelayInputSchema>;

const PredictPaymentDelayOutputSchema = z.object({
  isDelayLikely: z.boolean().describe('Whether a payment delay is likely.'),
  suggestedFollowUpDays: z.number().describe('The suggested number of days until follow-up.'),
  followUpMessage: z.string().describe('A suggested message to send to the student.'),
});
export type PredictPaymentDelayOutput = z.infer<typeof PredictPaymentDelayOutputSchema>;

export async function predictPaymentDelay(input: PredictPaymentDelayInput): Promise<PredictPaymentDelayOutput> {
  return predictPaymentDelayFlow(input);
}

const prompt = ai.definePrompt({
  name: 'predictPaymentDelayPrompt',
  input: {schema: PredictPaymentDelayInputSchema},
  output: {schema: PredictPaymentDelayOutputSchema},
  prompt: `You are an AI assistant that analyzes student payment patterns and predicts potential delays.

  Based on the student's payment history and details, determine if a payment delay is likely.  If so, suggest a follow-up time and craft a message to send to the student.

  Student Details:
  Name: {{{studentDetails.cardName}}}
  Phone: {{{studentDetails.phone}}}
  Balance: {{{studentDetails.balance}}}
  Due: {{{studentDetails.due}}}

  Payment History:
  {{#each paymentHistory}}
  Payment Name: {{{paymentName}}}, Payment Date: {{{paymentDate}}}, Payment Type: {{{paymentType}}}
  {{/each}}

  Consider these factors when predicting payment delays:
  * Consistency of payments
  * Amount currently due
  * Student's payment history

  Output:
  - isDelayLikely: true if a delay is likely, false otherwise.
  - suggestedFollowUpDays: The number of days until a follow-up should be sent.
  - followUpMessage: A message to send to the student.
  `,
});

const predictPaymentDelayFlow = ai.defineFlow(
  {
    name: 'predictPaymentDelayFlow',
    inputSchema: PredictPaymentDelayInputSchema,
    outputSchema: PredictPaymentDelayOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
