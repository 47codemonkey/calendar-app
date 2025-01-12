# calendar-app

## Technologies Used

- **Next.js** - React framework for server-side rendering and static site generation.
- **TypeScript** - A superset of JavaScript that adds static types.
- **MongoDB Atlas** - Cloud database for storing your data.
- **Vercel** - Platform for deploying Next.js applications.
- **CSS-in-JS** - A styling technique where CSS is written inside JavaScript files, often using libraries like `styled-components` or `emotion`.

## Running the Project

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/calendar-app.git
   cd calendar-app
   ```
2. Install dependencies: npm install
3. Run the development server: npm run dev

The app will be available at http://localhost:3000

## Deployment

This project is connected to a GitHub repository and deployed on Vercel using the **Vercel** npm package. Every time you push changes to the main branch, Vercel automatically builds and deploys the updated version of the application.

### Steps for Deployment

1. Connect your GitHub repository to Vercel.
2. Install the **Vercel** npm package and use it to connect your project to Vercel.
3. Connect your Vercel project to **MongoDB Atlas** by adding the necessary MongoDB connection string to your Vercel environment variables.
4. Push changes to the main branch.
5. Vercel will automatically build and deploy the changes.
