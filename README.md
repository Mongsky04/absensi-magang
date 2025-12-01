# 📋 Sistem Absensi Magang - PT Jasamarga Jalanlayang Cikampek

Sistem absensi digital berbasis web untuk memantau kehadiran peserta magang dengan fitur check-in/check-out menggunakan foto selfie, laporan ketidakhadiran, dan panel admin untuk manajemen user.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-green.svg)
![React](https://img.shields.io/badge/react-18.2.0-61dafb.svg)
![MongoDB](https://img.shields.io/badge/mongodb-latest-green.svg)

## 📑 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Running the Application](#-running-the-application)
- [API Documentation](#-api-documentation)
- [User Roles](#-user-roles)
- [Time Restrictions](#-time-restrictions)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

### For Users (Peserta Magang)

- ✅ **Check-in/Check-out** dengan foto selfie
- ⏰ **Time-based Access Control** (Check-in: 06:00-17:00, Check-out: 17:00+)
- 📊 **Dashboard** dengan ringkasan kehadiran
- 📝 **Laporan Ketidakhadiran** (Izin/Sakit/Lupa Absen)
- 📤 **Upload Bukti** untuk laporan (foto/dokumen)
- 👤 **Profile Management** (foto profil)
- 📥 **Export Rekap** bulanan ke HTML dengan foto embedded
- 📱 **Responsive Design** untuk mobile dan desktop

### For Admin

- 👥 **User Management** (CRUD)
- ✏️ **Edit Informasi Magang** (perusahaan, mentor, kampus)
- 📋 **Review Laporan** ketidakhadiran
- ✅ **Approve/Reject** laporan dengan catatan
- 📊 **View All Attendance** data
- 👨‍🏫 **Mentor Assignment** untuk peserta magang
- 📈 **Dashboard Analytics** (pending reports count)

### Technical Features

- 🔐 **JWT Authentication** dengan token refresh
- 🖼️ **Cloudinary Integration** untuk storage foto
- 🌍 **CORS Configuration** untuk multiple origins
- ⏱️ **Timezone Management** (Asia/Jakarta)
- 📸 **Image Compression** sebelum upload
- 🎨 **Modern UI** dengan Tailwind CSS
- 🚀 **Optimized Performance** dengan React hooks

## 🛠 Tech Stack

### Frontend

- **Framework**: React 18.2.0
- **Build Tool**: Vite 5.0.0
- **Routing**: React Router v6
- **Styling**: Tailwind CSS 3.4.1
- **HTTP Client**: Axios
- **Webcam**: react-webcam
- **Date Handling**: moment-timezone

### Backend

- **Runtime**: Node.js 18+
- **Framework**: Express 4.18.2
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JWT (jsonwebtoken)
- **File Upload**: Multer + Cloudinary
- **Password Hashing**: bcryptjs
- **Environment**: dotenv

### DevOps & Tools

- **Version Control**: Git
- **Package Manager**: npm
- **Deployment**: Render (backend), Vercel/Netlify (frontend)
- **Cloud Storage**: Cloudinary

## 📁 Project Structure

```
absensi-magang-magenta-redesign/
├── client/                          # Frontend React Application
│   ├── public/
│   │   └── images/
│   │       ├── presensi/           # Local presensi images (dev)
│   │       └── users/              # Local user images (dev)
│   ├── src/
│   │   ├── api/                    # API Service Layer
│   │   │   ├── AbsensiApi.js       # Absensi endpoints
│   │   │   ├── AuthAPI.js          # Authentication endpoints
│   │   │   ├── axios.js            # Axios instance & interceptors
│   │   │   └── UserAPI.js          # User management endpoints
│   │   ├── components/             # Reusable Components
│   │   │   ├── KehadiranSummary.jsx    # Monthly summary table
│   │   │   ├── KehadiranTable.jsx      # Attendance data table
│   │   │   ├── LaporanSection.jsx      # Laporan list component
│   │   │   ├── Navbar.jsx              # Navigation bar
│   │   │   ├── PresensiBox.jsx         # Check-in/out interface
│   │   │   ├── ProfileCard.jsx         # User profile card
│   │   │   └── ProtectedRoute.jsx      # Route guard
│   │   ├── pages/                  # Page Components
│   │   │   ├── Admin.jsx               # Admin panel
│   │   │   ├── Dashboard.jsx           # User dashboard
│   │   │   ├── HubungiAdmin.jsx        # Contact admin (WhatsApp)
│   │   │   ├── LaporAbsen.jsx          # Report absence form
│   │   │   ├── Login.jsx               # Login page
│   │   │   └── Profile.jsx             # Profile edit page
│   │   ├── utils/                  # Utility Functions
│   │   │   ├── ExportCsv.js            # CSV export (deprecated)
│   │   │   ├── ExportHtml.js           # HTML export with Base64 images
│   │   │   └── ExportXlsx.js           # XLSX export (deprecated)
│   │   ├── App.jsx                 # Root component with routing
│   │   ├── index.css               # Global styles
│   │   └── main.jsx                # React entry point
│   ├── index.html                  # HTML template
│   ├── package.json                # Dependencies
│   ├── vite.config.js              # Vite configuration
│   └── eslint.config.js            # ESLint configuration
│
└── server/                          # Backend Express Application
    ├── src/
    │   ├── config/                 # Configuration Files
    │   │   ├── cloudinary.js       # Cloudinary setup
    │   │   └── db.js               # MongoDB connection
    │   ├── controllers/            # Route Controllers
    │   │   ├── absensi.controller.js   # Absensi & laporan logic
    │   │   ├── auth.controller.js      # Authentication logic
    │   │   └── user.controller.js      # User management logic
    │   ├── middleware/             # Express Middlewares
    │   │   ├── auth.middleware.js      # JWT verification
    │   │   ├── role.middleware.js      # Role-based access control
    │   │   └── upload.middleware.js    # Multer file upload
    │   ├── models/                 # Mongoose Models
    │   │   ├── Absensi.js              # Attendance schema
    │   │   ├── LaporanAbsen.js         # Absence report schema
    │   │   └── User.js                 # User schema
    │   ├── routes/                 # API Routes
    │   │   ├── absensi.routes.js       # Absensi & laporan routes
    │   │   ├── auth.routes.js          # Auth routes
    │   │   └── user.routes.js          # User routes
    │   ├── utils/                  # Utility Functions
    │   │   └── jwt.js                  # JWT helper functions
    │   ├── views/                  # HTML Views
    │   │   └── api-docs.html           # API documentation page
    │   ├── app.js                  # Express app configuration
    │   └── server.js               # Server entry point
    ├── scripts/                    # Utility Scripts
    │   ├── seed.js                 # Database seeding
    │   └── test.js                 # Test utilities
    ├── .env.example                # Environment variables template
    ├── .env                        # Environment variables (gitignored)
    ├── package.json                # Dependencies
    └── README.md                   # Server documentation
```

## 📋 Prerequisites

Sebelum memulai, pastikan Anda memiliki:

- **Node.js** >= 18.0.0 ([Download](https://nodejs.org/))
- **npm** >= 9.0.0 (included with Node.js)
- **MongoDB** account ([MongoDB Atlas](https://www.mongodb.com/cloud/atlas) recommended)
- **Cloudinary** account ([Sign up](https://cloudinary.com/))
- **Git** ([Download](https://git-scm.com/))

## 🚀 Installation

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/absensi-magang-magenta-redesign.git
cd absensi-magang-magenta-redesign
```

### 2. Install Dependencies

#### Backend

```bash
cd server
npm install
```

#### Frontend

```bash
cd ../client
npm install
```

## ⚙️ Configuration

### Backend Configuration

1. **Copy environment template:**

```bash
cd server
cp .env.example .env
```

2. **Edit `.env` file:**

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/absensi-magang?retryWrites=true&w=majority

# JWT
JWT_SECRET=your_super_secret_jwt_key_here_minimum_32_characters
JWT_EXPIRES_IN=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# CORS
CORS_ORIGIN=http://localhost:5173
```

3. **Get MongoDB URI:**

   - Login ke [MongoDB Atlas](https://cloud.mongodb.com/)
   - Create cluster (free tier available)
   - Click "Connect" → "Connect your application"
   - Copy connection string
   - Replace `<password>` dengan password database Anda

4. **Get Cloudinary Credentials:**
   - Login ke [Cloudinary](https://cloudinary.com/)
   - Dashboard → Account Details
   - Copy: Cloud Name, API Key, API Secret

### Frontend Configuration

1. **Edit `client/src/api/axios.js`:**

```javascript
const baseURL = import.meta.env.PROD
  ? "https://your-backend-url.onrender.com"
  : "http://localhost:5000";
```

2. **Update WhatsApp number** di `client/src/pages/Login.jsx`:

```javascript
// Line 203
href = "https://wa.me/6281234567890?text=..."; // Ganti dengan nomor admin
```

## 🏃 Running the Application

### Development Mode

#### Backend (Terminal 1)

```bash
cd server
npm run dev
```

Server akan berjalan di: `http://localhost:5000`

#### Frontend (Terminal 2)

```bash
cd client
npm run dev
```

Client akan berjalan di: `http://localhost:5173`

### Production Mode

#### Backend

```bash
cd server
npm start
```

#### Frontend

```bash
cd client
npm run build
npm run preview
```

## 📚 API Documentation

API documentation tersedia di root URL backend:

- **Development**: http://localhost:5000
- **Production**: https://your-backend-url.onrender.com

Dokumentasi mencakup:

- Semua endpoint dengan method, path, dan deskripsi
- Request/response format
- Authentication requirements
- Parameter details
- Technical information

### Quick API Reference

#### Authentication

```
POST /api/auth/login
```

#### User Management

```
GET    /api/users/profile
PUT    /api/users/profile
GET    /api/users/all          (Admin)
POST   /api/users/create       (Admin)
PUT    /api/users/:id          (Admin)
DELETE /api/users/:id          (Admin)
```

#### Absensi

```
POST /api/absensi/masuk         (Check-in)
POST /api/absensi/pulang        (Check-out)
GET  /api/absensi/all           (Admin)
GET  /api/absensi/user/:userId
```

#### Laporan

```
POST /api/absensi/lapor
GET  /api/absensi/laporan
GET  /api/absensi/laporan/all   (Admin)
PUT  /api/absensi/laporan/:id   (Admin)
```

## 👥 User Roles

### Admin

- Full access ke semua fitur
- Manage users (create, read, update, delete)
- Review dan approve/reject laporan
- Edit informasi magang user (perusahaan, mentor, kampus)
- View all attendance data
- Redirect otomatis ke `/admin` setelah login

### User (Peserta Magang)

- Check-in/check-out absensi
- View personal dashboard
- Submit laporan ketidakhadiran
- Edit profil (foto only, info magang read-only)
- Export rekap bulanan
- Redirect ke `/` setelah login

## ⏰ Time Restrictions

Sistem menggunakan timezone **Asia/Jakarta** (WIB):

### Check-in

- **Waktu**: 06:00 - 17:00 WIB
- **Validasi**: Server-side & client-side
- **Error**: Alert jika diluar jam operasional

### Check-out

- **Waktu**: Setelah 17:00 WIB
- **Validasi**: Server-side & client-side
- **Error**: Alert jika sebelum jam 17:00

### Laporan

- **Tanggal**: Tidak boleh tanggal masa depan
- **Jenis**: Izin, Sakit, Lupa Absen
- **Bukti**: Required untuk jenis "Sakit" (surat dokter)

## 🌐 Deployment

### Backend (Render)

1. **Push ke GitHub:**

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

2. **Deploy di Render:**

   - Login ke [Render](https://render.com/)
   - New → Web Service
   - Connect repository
   - Configure:
     - **Build Command**: `cd server && npm install`
     - **Start Command**: `cd server && npm start`
     - **Environment Variables**: Copy from `.env`

3. **Set Environment Variables:**
   - `NODE_ENV=production`
   - `MONGO_URI=your_mongodb_uri`
   - `JWT_SECRET=your_jwt_secret`
   - `CLOUDINARY_CLOUD_NAME=your_cloud_name`
   - `CLOUDINARY_API_KEY=your_api_key`
   - `CLOUDINARY_API_SECRET=your_api_secret`
   - `CORS_ORIGIN=https://your-frontend-url.vercel.app`

### Frontend (Vercel/Netlify)

#### Vercel

1. Install Vercel CLI:

```bash
npm install -g vercel
```

2. Deploy:

```bash
cd client
vercel
```

3. Follow prompts dan set production URL

#### Netlify

1. Install Netlify CLI:

```bash
npm install -g netlify-cli
```

2. Deploy:

```bash
cd client
npm run build
netlify deploy --prod --dir=dist
```

### Post-Deployment

1. **Update Frontend API URL:**

   - Edit `client/src/api/axios.js`
   - Set production URL backend

2. **Update CORS di Backend:**

   - Edit `server/src/app.js`
   - Tambahkan frontend URL ke `allowedOrigins`

3. **Test Deployment:**
   - Login dengan test account
   - Check-in/check-out
   - Submit laporan
   - Verify admin panel

## 🔧 Troubleshooting

### Backend Issues

**Problem**: MongoDB connection error

```
Solution:
- Verify MONGO_URI di .env
- Check IP whitelist di MongoDB Atlas (allow all: 0.0.0.0/0)
- Test connection dengan MongoDB Compass
```

**Problem**: Cloudinary upload failed

```
Solution:
- Verify credentials di .env
- Check API quota/limits
- Ensure folders exist: absensi-presensi, absensi-laporan
```

**Problem**: CORS error

```
Solution:
- Add frontend URL ke allowedOrigins di app.js
- Verify CORS_ORIGIN di .env
- Check browser console for exact origin
```

### Frontend Issues

**Problem**: Cannot connect to backend

```
Solution:
- Verify backend URL di axios.js
- Check if backend server is running
- Verify CORS configuration
```

**Problem**: Token expired

```
Solution:
- Logout dan login kembali
- Check JWT_EXPIRES_IN di backend .env
- Clear localStorage: localStorage.clear()
```

**Problem**: Image upload not working

```
Solution:
- Check file size (max 5MB)
- Verify Cloudinary credentials
- Check browser console for errors
```

### Database Issues

**Problem**: Seed script fails

```bash
# Reset database
cd server
node scripts/seed.js

# If still fails, drop collections manually:
# Use MongoDB Compass or:
# mongosh "your_mongodb_uri"
# > use absensi-magang
# > db.users.drop()
# > db.absensis.drop()
# > db.laporanabsens.drop()
```

## 📝 Database Schema

### User Schema

```javascript
{
  nama: String,
  email: String (unique),
  password: String (hashed),
  role: String (enum: ["user", "admin"]),
  foto: String (Cloudinary URL),
  perusahaan: String,
  jabatan: String,
  kampus: String,
  mentor: String,
  mentorId: ObjectId (ref: User),
  isMentor: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Absensi Schema

```javascript
{
  userId: ObjectId (ref: User),
  tanggal: Date,
  jamMasuk: String (HH:mm),
  jamPulang: String (HH:mm),
  status: String (enum: ["hadir", "izin", "sakit", "alpha"]),
  keterangan: String,
  foto: String (Cloudinary URL),
  createdAt: Date,
  updatedAt: Date
}
```

### LaporanAbsen Schema

```javascript
{
  userId: ObjectId (ref: User),
  tanggal: Date,
  jenis: String (enum: ["izin", "sakit", "lupa"]),
  keterangan: String,
  bukti: String (Cloudinary URL),
  status: String (enum: ["pending", "approved", "rejected"]),
  respondedBy: ObjectId (ref: User),
  respondedAt: Date,
  responseNote: String,
  createdAt: Date,
  updatedAt: Date
}
```

## 🧪 Testing

### Create Test Users

```bash
cd server
node scripts/seed.js
```

Default accounts:

- **Admin**: admin@jasamarga.com / admin123
- **User**: user1@jasamarga.com / user123

### Manual Testing Checklist

- [ ] Login sebagai admin
- [ ] Login sebagai user
- [ ] Check-in dalam jam operasional
- [ ] Check-in diluar jam operasional (harus error)
- [ ] Check-out setelah jam 5 sore
- [ ] Submit laporan dengan bukti
- [ ] Review laporan sebagai admin
- [ ] Edit profil user
- [ ] Edit informasi magang sebagai admin
- [ ] Export rekap bulanan
- [ ] Logout

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

### Coding Standards

- Follow ESLint configuration
- Use meaningful variable/function names
- Add comments for complex logic
- Test before committing

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Developer

**PT Jasamarga Jalanlayang Cikampek**

- Website: [jasamarga.com](https://jasamarga.com)
- Email: admin@jasamarga.co.id
- Phone: +62 21 1234 5678

## 📞 Support

Butuh bantuan? Hubungi:

- WhatsApp: [+62 812 3456 7890](https://wa.me/6281234567890)
- Email: admin@jasamarga.co.id

---

**Built with ❤️ by PT Jasamarga Jalanlayang Cikampek**

© 2025 PT Jasamarga Jalanlayang Cikampek. All rights reserved.
