User Management System (React CRUD)
A modern, responsive User Management Application built with React, Tailwind CSS, and Framer Motion. This project performs CRUD (Create, Read, Update, Delete) operations using the DummyJSON API and features local persistence to simulate a fullstack experience.

🛠 Tech Stack
Frontend: React (Hooks), React Router v6

Styling: Tailwind CSS, Framer Motion (Animations)

Icons: Lucide-React

API Client: Axios

Notifications: React Hot Toast

Data Source: DummyJSON API

✨ Key Features
Full CRUD Workflow: Add, view, edit, and delete users via API.

Search & Filter: Real-time search by user name and filtering by system roles.

Data Persistence: Implemented a localStorage sync layer to bridge the gap between the stateless DummyJSON API and the UI, ensuring edits and additions persist during the demo.

Form Validation: Custom validation for required fields, email formats, and 10-digit phone number constraints.

Responsive Design: Fully optimized for mobile, tablet, and desktop views.

UX Enhancements: Loading states, success/error toasts, and delete confirmation popups.

📦 Installation & Setup
Clone the repository:

Bash
git clone https://github.com/your-username/user-manager.git
cd user-manager
Install dependencies:

Bash
npm install
Run the application:

Bash
npm run dev
Build for production:

Bash
npm run build
📂 Project Structure
Plaintext
src/
├── components/     # Reusable UI components (Loader, etc.)
├── pages/          # Main route components (UserList, UserForm, ViewUser)
├── services/       # Axios API configurations
├── utils/          # Validation logic and helper functions
└── App.jsx         # Routing and global state
📝 Technical Implementation Details
Phone Sanitization: Since the DummyJSON API provides international phone formats, the application automatically sanitizes incoming data to a 10-digit format to meet the specific task requirements.

Memoized Filtering: Used useMemo for search and filter logic to ensure optimal performance even as the user list grows.

API Interaction: Implemented proper async/await patterns with try/catch blocks for robust error handling.

👤 Author
Sarthak Bombale Fullstack Developer | Pune, Maharashtra
