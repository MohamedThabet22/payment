import { config } from 'dotenv';
config();

import '@/ai/flows/predict-payment-delays.ts';
import '@/ai/flows/draft-follow-up-message.ts';