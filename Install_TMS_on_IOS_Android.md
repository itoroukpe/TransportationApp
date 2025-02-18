### **🚀 Installing the Transportation Management Application on iOS & Android**  
Once the **Transportation Management System (TMS) mobile application** is completely developed using **React Native**, the next steps involve:  
✅ **Building the App for iOS & Android**  
✅ **Testing on Real Devices & Simulators**  
✅ **Deploying to the App Store (iOS) & Google Play Store (Android)**  

---

## **📌 1. Building the App for iOS & Android**  
### **🔹 Step 1: Install Dependencies**
Before building the mobile app, install the required dependencies:  
```sh
npm install -g react-native-cli
cd tms-mobile-app
npm install
```
✅ **Installs necessary libraries for React Native development**  

---

### **🔹 Step 2: Configure App for iOS**
For iOS development, install CocoaPods:  
```sh
cd ios
pod install
cd ..
```
✅ **Installs iOS dependencies for native modules**  

---

### **🔹 Step 3: Build and Run on iOS Emulator**
To test on an iOS simulator, run:
```sh
npx react-native run-ios
```
✅ **Launches the app on the iPhone simulator**  

---

### **🔹 Step 4: Build and Run on Android Emulator**
To test on an Android emulator, run:
```sh
npx react-native run-android
```
✅ **Launches the app on an Android emulator**  

---

## **📌 2. Installing the App on Real Devices**
### **🔹 iOS Device Installation (TestFlight)**
1️⃣ **Connect an iPhone via USB & Open Xcode**  
2️⃣ **Select the device & run the app**  
3️⃣ **For non-developer devices, use TestFlight:**  
   - Archive the app in Xcode (`Product -> Archive`)  
   - Upload to App Store Connect  
   - Distribute via **TestFlight**  

✅ **Allows real users to test the app on iPhones**  

---

### **🔹 Android Device Installation (APK)**
1️⃣ **Connect an Android phone via USB**  
2️⃣ **Enable Developer Mode & USB Debugging**  
3️⃣ **Run the app on the device:**
```sh
npx react-native run-android
```
4️⃣ **For external testers, generate an APK:**
```sh
cd android
./gradlew assembleRelease
```
✅ **Generates an installable APK file**  

---

## **📌 3. Publishing to the App Store & Google Play**
### **🔹 Step 1: Prepare the App for Deployment**
- **iOS:** Requires an **Apple Developer Account ($99/year)**  
- **Android:** Requires a **Google Play Developer Account ($25 one-time fee)**  

---

### **🔹 Step 2: Generate Production Builds**
#### **iOS: Build & Sign the App**
1️⃣ **Open Xcode**  
2️⃣ **Archive the app (`Product → Archive`)**  
3️⃣ **Sign the app using Apple Developer Credentials**  
4️⃣ **Upload to App Store Connect**
```sh
xcodebuild -exportArchive -archivePath build/YourApp.xcarchive \
           -exportOptionsPlist exportOptions.plist \
           -exportPath build/
```
✅ **Prepares the iOS app for App Store submission**  

---

#### **Android: Generate Signed APK**
```sh
cd android
./gradlew assembleRelease
```
1️⃣ **Sign the APK using a Keystore:**  
```sh
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 \
  -keystore my-release-key.keystore app-release-unsigned.apk alias_name
```
2️⃣ **Upload the APK to Google Play Console**  

✅ **Prepares the Android app for Google Play submission**  

---

### **🔹 Step 3: Submit for Review**
- **iOS:** Submit the app for review in **App Store Connect**  
- **Android:** Upload & release the app in **Google Play Console**  

✅ **Once approved, the app is live!** 🚀  

---

### **🎯 Next Steps**
Would you like:  
✅ **Automated CI/CD for App Deployment with Fastlane?**  
✅ **Push Notifications using Firebase & APNs?**  

---
### **🚀 Implementing CI/CD for App Deployment (Fastlane) & Push Notifications (Firebase/APNs) for iOS & Android**  

This guide extends our **TMS Mobile Application Deployment** by adding:  
✅ **Fastlane for Automated CI/CD Deployment** (Streamlined app release process)  
✅ **Firebase Cloud Messaging (FCM) & Apple Push Notification Service (APNs)** (Real-time notifications for drivers & users)  

---

## **📌 1. Setting Up Fastlane for CI/CD Deployment**  
Fastlane automates **iOS & Android build, testing, and deployment**.

---

### **🔹 Step 1: Install Fastlane**
1️⃣ **Install Fastlane globally:**  
```sh
npm install -g fastlane
```
2️⃣ **Initialize Fastlane in your project:**  
```sh
cd tms-mobile-app
fastlane init
```
✅ **Configures Fastlane for automating app builds**  

---

### **🔹 Step 2: Configure Fastlane for iOS Deployment**
Edit `fastlane/Fastfile`:
```ruby
default_platform(:ios)

platform :ios do
  desc "Deploy to App Store"
  lane :deploy do
    match(type: "appstore")
    gym(scheme: "TMSApp")
    deliver
  end
end
```
✅ **Automates iOS app signing & App Store upload**  

---

### **🔹 Step 3: Configure Fastlane for Android Deployment**
Edit `fastlane/Fastfile`:
```ruby
default_platform(:android)

platform :android do
  desc "Deploy to Google Play Store"
  lane :deploy do
    gradle(task: "assembleRelease")
    supply(track: "production")
  end
end
```
✅ **Automates Android app signing & Google Play upload**  

---

### **🔹 Step 4: Run Fastlane for Deployment**
#### **iOS Deployment:**
```sh
fastlane ios deploy
```
#### **Android Deployment:**
```sh
fastlane android deploy
```
✅ **Fastlane automatically signs & uploads the app to the store**  

---

## **📌 2. Implementing Push Notifications (FCM & APNs)**
The app will receive **real-time notifications** for:  
✅ **Geofence alerts**  
✅ **Trip status updates**  
✅ **New booking requests**  

---

### **🔹 Step 1: Set Up Firebase Cloud Messaging (FCM) for Android**
1️⃣ **Create a Firebase Project:**  
- Go to [Firebase Console](https://console.firebase.google.com/)  
- Click **Add Project** → Enter project name  

2️⃣ **Add Firebase SDK to the Android App:**  
- Download `google-services.json`  
- Place it in `android/app/`  

3️⃣ **Install Firebase Dependencies in React Native:**  
```sh
npm install @react-native-firebase/app @react-native-firebase/messaging
```

4️⃣ **Configure Firebase in `android/app/build.gradle`:**
```gradle
apply plugin: 'com.google.gms.google-services'
dependencies {
    implementation platform('com.google.firebase:firebase-bom:32.1.1')
    implementation 'com.google.firebase:firebase-messaging'
}
```
✅ **Android is now ready to receive push notifications**  

---

### **🔹 Step 2: Set Up APNs for iOS Push Notifications**
1️⃣ **Enable Push Notifications in Apple Developer Account:**  
- Go to **Certificates, Identifiers & Profiles**  
- Select your app **Bundle ID**  
- Enable **Push Notifications**  

2️⃣ **Generate APNs Authentication Key:**  
- Go to **Keys → Create Key**  
- Enable **APNs** and Download `.p8` file  

3️⃣ **Install Firebase in iOS:**  
```sh
cd ios
pod install
```

4️⃣ **Configure APNs in `AppDelegate.m`:**
```objective-c
#import <Firebase.h>

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
  if ([FIRApp defaultApp] == nil) {
    [FIRApp configure];
  }
  return YES;
}
```
✅ **iOS is now ready to receive push notifications**  

---

### **🔹 Step 3: Handling Push Notifications in React Native**
Edit `App.js`:
```js
import messaging from '@react-native-firebase/messaging';
import { useEffect } from 'react';
import { Alert } from 'react-native';

const App = () => {
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      Alert.alert('New Notification', remoteMessage.notification.body);
    });

    return unsubscribe;
  }, []);

  return null;
};
```
✅ **App now displays alerts when receiving push notifications**  

---

### **🔹 Step 4: Send a Push Notification from Firebase**
```sh
curl -X POST "https://fcm.googleapis.com/fcm/send" \
-H "Authorization: key=YOUR_SERVER_KEY" \
-H "Content-Type: application/json" \
-d '{
  "to": "DEVICE_FCM_TOKEN",
  "notification": {
    "title": "New Trip Request",
    "body": "You have a new ride request. Accept now!"
  }
}'
```
✅ **Sends a push notification to the mobile app**  

---

## **📌 3. Automate Deployment with GitHub Actions**
### **🔹 Step 1: Create a GitHub Workflow (`.github/workflows/deploy.yml`)**
```yaml
name: Build & Deploy

on:
  push:
    branches:
      - main

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Code
        uses: actions/checkout@v3

      - name: Install Dependencies
        run: npm install

      - name: Build Android
        run: fastlane android deploy

      - name: Build iOS
        run: fastlane ios deploy
```
✅ **Automatically builds & deploys the app when code is pushed**  

---

## **📌 4. Automate Terraform Deployment**
Run:
```sh
terraform init
terraform apply -auto-approve
```
✅ **Deploys Fastlane CI/CD & Firebase push notifications automatically**  

---

## **📌 5. Next Steps**
Would you like:  
✅ **In-App Chat using Firebase Firestore?**  
✅ **Background Location Tracking for Vehicle Movement?**  

