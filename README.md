# 🌐 Smart Bookmark App

A simple yet powerful real-time bookmark manager built using **Next.js (App Router)**, **Supabase**, and **Tailwind CSS**.  
This app fulfills all requirements of the assignment, including Google login, real-time updates, and secure user-only data access.

---

## ✅ Features (As Required)

### 1. 🔐 Google Login (OAuth Only)
Users can sign up and log in using their Google account.  
No email/password form.

### 2. ➕ Add Bookmark
Logged-in users can save a bookmark with:
- URL  
- Title  

### 3. 🔒 Private Bookmarks  
Every user can see only their own bookmarks.  
Supabase **RLS (Row Level Security)** ensures complete isolation.

### 4. ⚡ Real-Time Updates  
Adding, deleting, or changing bookmarks updates the UI instantly *without page refresh*.  
Opening two tabs will sync live.

### 5. ❌ Delete Bookmarks  
Users can delete their own bookmarks, with a confirmation prompt.

### 6. 🚀 Deployment on Vercel  
App runs fully live on a production Vercel URL.

---

## 🛠 Tech Stack

### **Frontend**
- Next.js (App Router)
- Tailwind CSS

### **Backend**
- Supabase Authentication (Google OAuth)
- Supabase Database
- Supabase Realtime
- Supabase RLS Policies

### **Tools**
- GitHub
- Vercel (deployment)

---

## 📦 Installation & Setup (Local)

### 1️⃣ Clone Project
```sh
git clone https://github.com/gour8620/Smart-Bookmark-App.git
cd smart-bookmark-app
"# Smart-Bookmark-App" 
