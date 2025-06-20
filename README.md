# 🃏 cards.geekstack.dev

Welcome to **geekstack.dev** — your one-stop platform for browsing and discovering cards from various anime trading card games like **Union Arena**, **One Piece**, and **Hololive**! ✨

This project combines web scraping, REST APIs, and a sleek frontend to create a rich card database experience. This project also aims to be a migration from Angular to Next JS in order to better optimize its function as a social hub for trading card players.

---

## 🔗 Live Website (running on angular)

👉 Visit: [**https://cards.geekstack.dev**](https://cards.geekstack.dev)

---

## 🚀 Features

- 🔍 **Powerful Search** — Find cards by name, color, rarity, booster, and more.
- ⚡ **Instant Filtering** — Responsive filters and pagination for smooth browsing.
- 🖼️ **High-quality Card Images** — Scraped from official card game websites.
- 🧠 **Keyword Highlights** — See card effects and traits in detail.
- 💾 **MongoDB Backend** — Fast and efficient card storage and querying.
- 📦 **RESTful API** — Access cards by anime or booster via `/data/{anime}`.

---

## 🛠 Tech Stack

| Tech               | Description                                           |
|--------------------|-------------------------------------------------------|
| **Frontend**       | Angular + CSS (no frameworks)                         |
| **Backend**        | Spring Boot (Java)                                    |
| **Database**       | MongoDB Atlas (cards) & MySQL (users)                 |
| **Authentication** | Firebase Authentication (web token protected APIs)    |
| **Notifications**  | Firebase Cloud Messaging (user/device notifications)  |
| **Messaging**      | RabbitMQ (async event handling & queue processing)    |
| **Scraping**       | Python + BeautifulSoup + deep_translator (for EN/JP)  |
| **Deployment**     | Vercel (frontend) + Railway (backend & workers)       |

---

## 📁 API Endpoints

🔗 **Base URL**: [`https://api.geekstack.dev`](https://api.geekstack.dev)

> 🔒 **Most endpoints are protected** with **Firebase Web Token Authentication**.  
> You must include a valid Firebase ID token in the `Authorization` header as a **Bearer token** to access protected routes.

### 🔐 Authentication Header

```http
Authorization: Bearer <your-firebase-id-token>
