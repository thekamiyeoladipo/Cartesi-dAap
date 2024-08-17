🚀 Decentralized Trivia Game on Cartesi
Welcome to my first Web3 project! This is a decentralized trivia game built on top of Cartesi, where users can submit trivia questions, view a leaderboard, and track contributions in a fully decentralized manner.

🌟 Features
Submit Trivia Questions: Users can submit questions that are converted to uppercase and stored on the blockchain.
Leaderboard: Track the top contributors by the number of questions they have submitted.
Inspection Routes: Check the total number of questions submitted and view the leaderboard directly from the app.
📚 How It Works
Submitting Questions:

Users submit questions as hexadecimal payloads.
The app processes these questions, converts them to uppercase, and tracks the sender.
Inspecting the Leaderboard:

Users can inspect the leaderboard to see who the top contributors are.
Alternatively, users can check the total number of questions submitted.
Decentralized and Transparent:

All operations are handled in a decentralized environment using Cartesi's Rollups, ensuring transparency and trust.
🚀 Getting Started
Prerequisites
Node.js
Cartesi Development Environment
Installation
Clone the Repository:

git clone https://github.com/yourusername/decentralized-trivia-game.git
cd decentralized-trivia-game
Install Dependencies:

npm install
Set Up Environment Variables:

Create a .env file in the root directory and add the following:
ROLLUP_HTTP_SERVER_URL=your_rollup_server_url
Run the Application:

node app.js
🛠️ Usage
Submitting a Question:

Send a request to the app's /advance endpoint with your question encoded in hexadecimal.
Example:
{
  "payload": "0x68656c6c6f20776f726c64"  // Hexadecimal for "hello world"
}
Inspecting the Leaderboard:

Send a request to the app's /inspect endpoint with the payload "leaderboard".
Example:
{
  "payload": "0x6c6561646572626f617264"  // Hexadecimal for "leaderboard"
}
🎯 Roadmap
Add Question Categories: Allow users to categorize their trivia questions.
Implement a Scoring System: Introduce points and rewards for contributors.
Smart Contract Integration: Further decentralize the system by managing rewards and user interactions through smart contracts.
📄 License
This project is licensed under the MIT License.

📢 Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

🌐 Connect with Me
Twitter: https://x.com/kamiyeoladiipo
GitHub: https://github.com/thekamiyeoladipo
Thank you for checking out my first Web3 project! I'm excited to share this journey with you all. 🚀

