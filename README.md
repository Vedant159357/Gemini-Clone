# Gemini Chat Interface

A modern chat interface for the Gemini AI model, built with React and Node.js.

## Features

- 🤖 Real-time chat with Gemini AI
- 💬 Multiple conversation support
- 🔄 Line-by-line text animation
- 📝 Rename and manage conversations
- 💾 Auto-save conversations
- 🎨 Modern and responsive UI
- ⚡ Fast and efficient

## Tech Stack

- Frontend:

  - React
  - Styled Components
  - Vite

- Backend:
  - Node.js
  - Express
  - Google Gemini API

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Google Gemini API key

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd gemini-chat
```

2. Install dependencies:

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. Set up environment variables:

```bash
# In backend/.env
GEMINI_API_KEY=your_api_key_here
PORT=5000
```

4. Start the development servers:

```bash
# Start backend server
cd backend
npm run dev

# Start frontend server (in a new terminal)
cd frontend
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
.
├── backend/
│   ├── server.js          # Express server setup
│   └── services/
│       └── gemini.js      # Gemini API integration
├── frontend/
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── services/      # API services
│   │   └── main.jsx       # Entry point
│   └── index.html         # HTML template
└── README.md
```

## Usage

1. Start a new chat using the "New Chat" button
2. Type your message and press Enter or click Send
3. Manage conversations using the sidebar:
   - Rename conversations by clicking the edit icon
   - Delete conversations using the delete icon
   - Clear all conversations with the "Clear All" button
4. Your conversations are automatically saved and will persist across page refreshes

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
