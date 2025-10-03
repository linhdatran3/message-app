# Message App

A real-time messaging application built with Next.js, featuring multi-channel communication, rich text editing, and file attachments.

## Features

### Current Features

#### Authentication

- Username-based authentication
- User must enter username to join channels
- Username persists in localStorage

#### Channels

- Multiple channel support
- Public channels accessible to all users
- Channel-based message organization

#### Messaging

- Real-time message sending and receiving
- Message reactions (👍 Like, ❤️ Love, 😂 Laugh)
- View list of users who reacted
- Desktop: Hover to add reactions
- Mobile: Long press to add reactions

#### Rich Text Editor

- **Markdown support:**
  - Bold text
  - Italic text
  - Inline code
- **File attachments** (external)
- **Content limits:**
  - Max 1000 characters per message
  - Max 3 files per message
  - Max 10MB per file
- Two modes: Write & Preview
- Character counter with visual warnings

#### Data Storage

- File-based storage using `data/messages.json`
- Simple read/write operations
- No database required

### Upcoming Features

#### Channels

- [ ] Private channels with access codes
- [ ] Channel creation by users
- [ ] Channel search and discovery

#### Reactions

- [ ] Extended emoji reactions
- [ ] Custom emoji support

#### Editor

- [ ] Inline image upload
- [ ] Link preview
- [ ] Drag & drop file upload
- [ ] Paste image from clipboard
- [ ] Inline file embedding
- [ ] Code syntax highlighting

#### Messages

- [ ] Message editing
- [ ] Message deletion
- [ ] Message search
- [ ] Thread replies
- [ ] Message pinning
- [ ] Scheduled messages

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
