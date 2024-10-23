# Welcome to React Native Django App 🚀

This project combines the power of [React Native Expo](https://expo.dev) for a seamless cross-platform mobile app experience with [Django](https://www.djangoproject.com/) as a robust and scalable backend framework.

## Get Started

### 1. Install Frontend Dependencies

To get the mobile app up and running, install the required npm dependencies:

```bash
cd bpjs_prpl
npm install
```
### 2. Install Backend dependencies

For the backend, make sure to have all necessary Python packages installed:

```bash
cd server
pip install -r reqirements.txt
```

### 3. Run the Backend

Ensure your Django backend is running by using the following command:

```bash
cd server
python manage.py runserver
```

This will start the backend on `http://127.0.0.1:8000/`.

### 4. Run the Frontend

Now, start the React Native Expo app:

```bash
cd bpjs_prpl
npx expo start
```

This will open a new tab in your browser with the Expo Developer Tools. From here, you can run the app on an emulator or your physical device using the QR code with Expo Go.
