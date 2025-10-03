# 💬 Message App

A real-time messaging application built with Next.js, featuring multi-channel communication, rich text editing, and file attachments.

## ✨ Features

### Current Features

#### 🔐 Authentication

- Username-based authentication
- User must enter username to join channels
- Username persists in localStorage

#### 📢 Channels

- Multiple channel support
- Public channels accessible to all users
- Channel-based message organization

#### 💬 Messaging

- Real-time message sending and receiving
- Message reactions (👍 Like, ❤️ Love, 😂 Laugh)
- View list of users who reacted
- Desktop: Hover to add reactions
- Mobile: Long press to add reactions

#### ✍️ Rich Text Editor

- **Markdown support:**
  - Bold text
  - Italic text
  - Inline code
- **File attachments** (external)
- **Content limits:**
  - Max 5000 characters per message
  - Max 5 files per message
  - Max 10MB per file
- Two modes: Write & Preview
- Character counter with visual warnings

#### 💾 Data Storage

- File-based storage using `data/messages.json`
- Simple read/write operations
- No database required

### 🚀 Upcoming Features

#### Channels

- [ ] Private channels with access codes
- [ ] Channel creation by users
- [ ] Channel search and discovery

#### Reactions

- [ ] Extended emoji reactions
- [ ] Custom emoji support
- [ ] Reaction analytics

#### Editor

- [ ] Inline image upload
- [ ] Link preview
- [ ] Drag & drop file upload
- [ ] Paste image from clipboard
- [ ] Inline file embedding
- [ ] Code syntax highlighting
- [ ] Markdown shortcuts (e.g., `**text**` → **text**)

#### Messages

- [ ] Message editing
- [ ] Message deletion
- [ ] Message search
- [ ] Thread replies
- [ ] Message pinning
- [ ] Scheduled messages
