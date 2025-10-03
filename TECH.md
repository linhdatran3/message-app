## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (v15.5)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Package Manager:** pnpm
- **Storage:** JSON file system

## Installation

### Prerequisites

- Node.js 18+
- pnpm (recommended)

### Setup

1. **Clone the repository:**

```bash
   git clone <repository-url>
   cd message-app
```

2. **Install dependencies:**

```bash
      pnpm install
```

3. **Run development server:**

```bash
      pnpm dev
```

4. **Open in browser:**

```
      [pnpm dev](http://localhost:3000)
```

## Project Structure

```
message-app/
├── app/
│   ├── api/
│   │   └── messages/
│   │       └── [channel]/
│   │           ├── route.ts          # GET/POST messages
│   │           └── reactions/
│   │               └── route.ts      # POST reactions
│   ├── page.tsx                      # Main chat page
│   └── layout.tsx
├── components/
│   ├── messages                   # Message: list, item, skeleton, empty, component
│   ├── richEditor                   # Rich text editor
│   ├── reaction                         # Reaction picker & pills
│   └── attachment                # File attachment handling
├── providers/
│   └── chatProvider.tsx              # Chat context & state
├── types/
│   ├── message.ts                    # Message type definitions
│   └── reaction.ts                   # Reaction type definitions
├── data/
│   └── messages.json                 # Message storage
├── utils/
│   ├── constants.ts                  # App constants
│   └── utils.ts                      # Helper functions
└── FEATURE.md
└── TECH.md
```
