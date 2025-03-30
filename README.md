# Diabestie 🌈

**Note:** This project is split into two repos—one for the [frontend](https://github.com/amandineameye/Diabestie_React) and one for the [backend](https://github.com/amandineameye/Diabestie_Node). Both need to be set up and run separately but work together seamlessly. You are currently on the backend repo.

Diabestie is a web app designed to help diabetics accurately estimate their insulin needs before a meal.
Built by diabetics for diabetics.

## 🧠 Vision

Making the right insulin decision can be overwhelming. This choice directly impacts both short-term well-being and long-term health and requires careful consideration of multiple factors:

- The carbohydrate content of the meal
- The corresponding insulin dosage
- Current blood sugar levels
- Physical activity levels
- Whether it’s the first meal of the day, and more

Diabestie simplifies this process by helping users **track**, **analyze**, and **compare their meals** with past data, allowing them to make informed insulin decisions with confidence. Instead of guessing, users can rely on historical insights tailored to their body’s responses.

## 🎯 Features

Diabestie is designed to streamline insulin management through two key functions:

1. **Accurate Meal Tracking** – Keep a detailed record of meals, insulin doses, and key influencing factors.

2. **Data-Driven Decision Support** – Get relevant insights from past meals to guide your insulin decisions.

## ⚙️ How It Works

🍽 **Log Your Meal** – Enter the weight of each ingredient (e.g., 10g of banana, 100g of rice), and the app calculates the total carbohydrate content.

🔄 **Compare with Past Meals** – Instantly access data from similar past meals, including physical activity, time of day, and blood sugar trends.

🩸 **Input Key Factors** – Add your current blood sugar level, correction insulin, and other relevant details.

📌 **Make an Informed Decision** – With all essential data at a glance, confidently estimate the right insulin dose.

⏳ **Track Post-Meal Glucose** – Return after three hours to log your updated blood sugar level, improving future insights.

📊 **Review Your Meal History** – Access detailed records of past meals, insulin doses, carb intake, and trends over time.

🔍 **Filter Your History** – Quickly find specific meals based on factors like time of day, physical activity, or carb content.

📝 **Quick Dashboard Notes** – Add a temporary note to the dashboard when you’re short on time to log a full meal entry.

## 📸 Screenshots

### 1. **Dashboard View**

![Dashboard Screenshot](https://github.com/amandineameye/Diabestie_React/blob/main/src/assets/readmeScreenshots/Demo1.png?raw=true)

### 2. **Entering Ingredients Data**

![Entering Ingredients Data Screenshot](https://github.com/amandineameye/Diabestie_React/blob/main/src/assets/readmeScreenshots/Demo2.png?raw=true)

### 3. **Insulin Decision Page**

![Insulin Decision Page Screenshot](https://github.com/amandineameye/Diabestie_React/blob/main/src/assets/readmeScreenshots/Demo3.png?raw=true)

### 4. **History Page**

![History Page Screenshot](https://github.com/amandineameye/Diabestie_React/blob/main/src/assets/readmeScreenshots/Demo4.png?raw=true)

---

## 🎮 Demo

Create an account or use:  
**Username:** Test  
**Password:** Test12345

🚀 [Try it now](https://diabestie-ecru.vercel.app/)

---

## 🛠 Tech Stack

- **Frontend:** React, Redux
- **Backend:** Node.js, Express
- **Database:** MongoDB
- **Authentication:** JWT (JSON Web Tokens)
- **Hosting:** Vercel

---

## 🔐 Authentication

Diabestie uses **JWT (JSON Web Tokens)** for secure user authentication. After login, the browser stores the token, which is included in the header of subsequent API requests, ensuring secure access without needing to re-login.

---

## 💻 Local Setup

To run Diabestie locally, follow these steps.

### 📌 Prerequisites

Ensure you have **Node.js** (v23.7.0 or a compatible version) installed on your machine.

If you haven’t installed it yet, you can get it from the [official Node.js website](https://nodejs.org/en/download).

---

## 🚀 Frontend Setup

1. Clone the frontend repository: [Diabestie Frontend](https://github.com/amandineameye/Diabestie_React.git)

2. Create a `.env` file in the frontend directory with the following content:

```env
VITE_API_URL=http://localhost:3001
```

3. Install dependencies and start the development server:

```sh
npm install
npm run dev
```

---

## 🔧 Backend Setup

1. Clone the backend repository: [Diabestie Backend](https://github.com/amandineameye/Diabestie_Node.git)

2. Create a `.env` file in the backend directory with the following content:

```env
JWT_SECRET=your-very-secure-random-secret
JWT_AUDIENCE=diabestie-users
JWT_ISSUER=diabestie-backend

FRONTEND_URL=http://localhost:5173
PORT=3001
MONGODB_CONNECTION_STRING=your-mongodb-connection-string (see next section)
```

3. Install dependencies and start the development server:

```sh
npm install
npm run dev
```

**Note:** In the data folder of the backend repository, you will find a **`diabestieDB.usersData.json`** file and a **`diabestieDB.carbsRates.json`**, providing an example of how the data is structured in the database.

You can view the folder directly on GitHub here: [Data folder](https://github.com/amandineameye/Diabestie_Node/blob/main/data)

---

## 🗄 Database Setup

### Option 1: Using MongoDB Atlas (Cloud)

1. Create a **MongoDB Atlas** account.
2. Set up a **free cluster**.
3. In the **Atlas dashboard**, go to **Network Access** and add your **IP address** (or use `0.0.0.0/0` to allow all connections).
4. Update your backend `.env` file with your own connection string:

```env
MONGODB_CONNECTION_STRING=your-mongodb-connection-string
```

### Option 2: Using Local MongoDB

1. Install **MongoDB Community Edition** from [MongoDB’s website](https://www.mongodb.com/try/download/community).
2. Start the MongoDB server (usually by running `mongod`).
3. Update your backend `.env` file:

```env
MONGODB_CONNECTION_STRING=mongodb://localhost:27017
```

---

## ✨ Future Improvements

- 📱 **Mobile Version:**
  - The app is not yet optimized for mobile. A fully responsive version is planned for future development.
- 🔄 **Loading Data:**
  - Improve the data loading process to ensure all necessary information is available before the page loads, avoiding delays or visual glitches.
- 🧑‍💻 **User Interface Clarifications:**
  - Add tooltips or info icons for clearer explanations of sections like "Quick Note" to enhance user understanding.
- 📝 **Meal Input Flow (Carb Table):**
  - Relocate the carb calculation table to make the decision page cleaner and less cluttered, while allowing users to access the table when needed.
- 🧑‍🍳 **Ingredient Adjustment:**
  - Allow users to modify ingredient inputs while seeing an updated total carb count in real-time for more flexibility during meal entry.
- 📈 **Graphs page (Under Construction):**
  - Add a placeholder page for the "Graphs" section.
  - Develop a page that estimates the carbohydrate-to-insulin ratio (carbs per 1 unit of insulin) and the blood sugar reduction per 1 unit of insulin in different contexts.
- 🌐 **Carb Rate API Integration:**
  - Currently, carb rates (percentage of carbs in different ingredients) are hardcoded in the database. An improvement would be to find a reliable, free API to dynamically fetch these values, making the app more flexible and easier to maintain.
