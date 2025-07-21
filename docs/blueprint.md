# **App Name**: Payment Insights Dashboard

## Core Features:

- Dashboard Summary: Displays a dashboard providing a summary of payments, including total amounts paid, outstanding balances, and number of paying students.
- Daily Payment Report: Presents a daily report showing payments received, students who paid, and the total amount collected each day.
- Monthly Payment Report: Offers a monthly overview of payment trends, total payments, and outstanding dues for each month.
- Student Payment Records: Lists all students, their payment history, balance, and due amounts, fetched from Firebase.
- Predictive Payment Analysis: Analyzes payment patterns using AI, predicts potential delays, and suggests optimal follow-up times using an LLM tool. Based on historic information about a given student's payment submissions, the LLM tool will suggest whether outreach is warranted, and will draft suggested email/SMS copy for the user to send to the student.
- Interactive Data Filtering: Provides a sortable and filterable display of payment information to enable identifying specific trends or outliers.
- Firebase Integration: Data fetched from the firebase database is displayed without change or modification. Payments will update real time.

## Style Guidelines:

- Primary color: Strong blue (#2962FF) to inspire confidence and security in managing financial data.
- Background color: Light blue (#E6F0FF), providing a calming and professional backdrop that reduces visual strain.
- Accent color: Vibrant orange (#FF9100), strategically used to highlight key metrics, calls to action, and important notifications.
- Body and headline font: 'Inter' sans-serif for clarity and legibility across all devices, ensuring data is easily readable.
- Consistent use of a set of modern, minimalist icons that correspond to each type of data presented on the dashboard (payments, dues, reports).
- A clean, modular design with clear visual hierarchy for easy navigation. Uses white space to keep elements balanced.
- Subtle transitions and animations (e.g., data loading, chart updates) to provide a dynamic but unobtrusive user experience.