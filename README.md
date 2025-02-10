# 📓 Notes App

The Notes App is designed to help users effortlessly capture, organize, and manage their notes. Whether it's quick thoughts, important information, or voice-recorded memos, this app offers an intuitive interface and powerful features to enhance productivity. Users can sign up securely, create notes through text or voice, upload images, and even mark notes as favorites for quick access.

## 🚀 Features

#### User Authentication:

- Secure Sign Up and Login system.

- Unique usernames enforced. Duplicate usernames will trigger an error message.

- JWT-based authentication for secure access.

#### Note Creation:

- Create notes via text or voice recording using webkitSpeechRecognition.

- Each note includes a timestamp of its creation.

#### Note Management:

- **Edit Notes:** Modify the title, content, and upload images.

- **Image Upload:** Supports image uploads (up to 5 images), stored securely on Cloudinary.

- **Copy Content:** Copy note content with a single click.

- **Delete Notes:** Permanently remove notes when needed.

#### Search Functionality:

- Dynamic Search to quickly find notes based on keywords.

#### Favorites Page:

- Add notes to a Favorites section.

- Manage favorites by copying content or deleting notes.


## 🛠️ Tech Stack

- **Frontend:** React.js, Tailwind CSS

- **Backend:** Node.js, Express.js

- **Database:** MongoDB

- **Authentication:** JWT with token blacklisting

- **Voice Recognition:** Web Speech API (webkitSpeechRecognition)

- **Image Storage:** Cloudinary


## 📥 Installation


### 1. Clone the Repository

```bash
git clone https://github.com/Sangavi002/notes-app.git
cd notes-app
```

### 2. Backend Setup:

```bash
cd server
npm install
npm run dev
```

### 3. Frontend Setup:

```bash
cd client
npm install
npm run dev
```

