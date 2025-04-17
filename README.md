# Verbalo AI - Interactive Language Learning Platform

Verbalo AI is a modern web application that helps users learn new languages through interactive conversations, quizzes, and structured lessons powered by artificial intelligence.

## Features

### 🎯 Core Features
- **Interactive Voice Chat**: Practice speaking with AI conversation partners
- **Structured Lessons**: Progress through themed lessons (Home, Store, Restaurant, etc.)
- **Multiple Difficulty Levels**: Three levels of difficulty for each lesson
- **Quiz System**: Test your knowledge with the Quiz Master bot
- **Voice Synthesis**: Natural text-to-speech responses using ElevenLabs
- **Progress Tracking**: Monitor your learning journey with detailed statistics

### 👤 User Features
- **User Authentication**: Secure login with email/password or Google
- **Multiple Language Support**: Practice in various languages including:
  - English (CA)
  - Spanish
  - French
  - Polish
  - Italian
  - Japanese

### 💎 Premium Features
- **Tiered Subscription System**:
  - Free: Basic access with limited features
  - Learner: Enhanced features and increased usage limits
  - Boosted Learner: Premium features with unlimited access

## Technology Stack

- **Frontend**: Next.js 13+ with React
- **Authentication**: NextAuth.js
- **Database**: Upstash Redis
- **Vector Database**: Upstash Vector
- **AI Integration**: 
  - Language Models: LangBase
  - Voice Synthesis: ElevenLabs
  - Embeddings: OpenAI
- **Payment Processing**: Polar.sh
- **Styling**: Tailwind CSS

## Environment Setup

1. Clone the repository:
```bash
git clone [repository-url]
cd nextjs-hackathon-2025
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```env
NEXT_PUBLIC_APP_URL=
OPENAI_API_KEY=
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
UPSTASH_VECTOR_URL=
UPSTASH_VECTOR_TOKEN=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
ELEVENLABS_API_KEY=
LANGBASE_API_KEY=
LANGBASE_CONVERSATION_PIPE_API_KEY=
LANGBASE_TESTER_AI_API_KEY=
LANGBASE_LESSONS_AI_API_KEY=
POLAR_ACCESS_TOKEN_DEV=
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Contributing

We welcome contributions! Please read our contributing guidelines before submitting pull requests.


## Support

For support or questions, please [create an issue](repository-issues-url) or contact our support team.

---

Built with ❤️ for language learners everywhere

## To be Implemented
- **Progress Dashboard**: Track completed lessons, streaks, and total points
- **Usage Statistics**: Monitor API token usage and conversation history
- **Payment**: Set up Polar Payment
