# TransportationApp
Here is a **starter React Native application** that integrates with your **Spring Boot backend** for a **Transportation Management App**. This setup will allow your mobile app to interact with the backend using REST APIs.

---

### **1. Prerequisites**
Ensure you have the following installed:
- **Node.js** (>= 14.x)
- **React Native CLI** (`npm install -g react-native-cli`)
- **Android Studio** (for Android) or **Xcode** (for iOS)
- **Spring Boot Backend** (running on `http://localhost:8080` or a deployed URL)

---

### **2. Create a New React Native Project**
Run the following command in your terminal:

```sh
npx react-native init TransportationApp
cd TransportationApp
npm install axios react-navigation react-native-gesture-handler
```

---

### **3. Project Structure**
```
TransportationApp/
│── src/
│   ├── screens/
│   │   ├── HomeScreen.js
│   │   ├── VehiclesScreen.js
│   ├── components/
│   │   ├── VehicleCard.js
│   ├── services/
│   │   ├── api.js
│── App.js
│── package.json
│── index.js
```

---

### **4. API Service (Connect to Spring Boot)**
Create a file `src/services/api.js` to interact with the backend.

```javascript
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api'; // Change to your backend URL

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' }
});

export const getVehicles = async () => {
  try {
    const response = await api.get('/vehicles');
    return response.data;
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    return [];
  }
};

export const addVehicle = async (vehicleData) => {
  try {
    const response = await api.post('/vehicles', vehicleData);
    return response.data;
  } catch (error) {
    console.error('Error adding vehicle:', error);
    return null;
  }
};
```

---

### **5. Home Screen (Navigation)**
Create a new file `src/screens/HomeScreen.js`.

```javascript
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Transportation Management</Text>
      <Button title="View Vehicles" onPress={() => navigation.navigate('Vehicles')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 }
});

export default HomeScreen;
```

---

### **6. Vehicles Screen (List of Vehicles)**
Create a new file `src/screens/VehiclesScreen.js`.

```javascript
import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { getVehicles } from '../services/api';
import VehicleCard from '../components/VehicleCard';

const VehiclesScreen = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    const data = await getVehicles();
    setVehicles(data);
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={vehicles}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <VehicleCard vehicle={item} />}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 }
});

export default VehiclesScreen;
```

---

### **7. Vehicle Card Component**
Create a new file `src/components/VehicleCard.js`.

```javascript
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const VehicleCard = ({ vehicle }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.name}>{vehicle.name}</Text>
      <Text>Type: {vehicle.type}</Text>
      <Text>Capacity: {vehicle.capacity}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: { padding: 15, marginBottom: 10, backgroundColor: '#f9f9f9', borderRadius: 5 },
  name: { fontSize: 18, fontWeight: 'bold' }
});

export default VehicleCard;
```

---

### **8. Configure Navigation**
Modify `App.js` to set up React Navigation.

```javascript
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './src/screens/HomeScreen';
import VehiclesScreen from './src/screens/VehiclesScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Vehicles" component={VehiclesScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
```

---

### **9. Running the App**
- **For Android:**
  ```sh
  npx react-native run-android
  ```
- **For iOS (Mac users with Xcode installed):**
  ```sh
  npx react-native run-ios
  ```

---

### **10. Expected Behavior**
- The **Home screen** displays a title and a button to navigate to the vehicle list.
- The **Vehicles screen** fetches and displays vehicle data from your **Spring Boot backend**.
- **VehicleCard** components show vehicle details (name, type, capacity).

---

### **Next Steps**
- Add authentication (JWT) to secure API calls.
- Implement real-time tracking (WebSockets).
- Add forms for adding/updating vehicle records.

---
### **Adding Authentication (JWT) and WebSocket Integration to Your React Native Transportation App**
Since your backend is built with **Spring Boot**, we'll enhance your React Native app by adding:
1. **JWT Authentication** – Secure API requests.
2. **WebSocket Integration** – Enable real-time vehicle tracking.

---

## **1. Implementing JWT Authentication**
### **Backend (Spring Boot)**
Ensure your Spring Boot backend has JWT authentication enabled. If not, follow these steps:

#### **1.1. Add Dependencies to Spring Boot**
```xml
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt</artifactId>
    <version>0.11.5</version>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>
```

#### **1.2. Configure JWT Authentication in Spring Boot**
Create a `JwtUtil.java` file to generate and validate tokens.

```java
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class JwtUtil {
    private String secretKey = "yourSecretKey";

    public String generateToken(String username) {
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10))
                .signWith(SignatureAlgorithm.HS256, secretKey)
                .compact();
    }

    public String extractUsername(String token) {
        return Jwts.parser().setSigningKey(secretKey).parseClaimsJws(token).getBody().getSubject();
    }

    public boolean validateToken(String token, String username) {
        return (extractUsername(token).equals(username));
    }
}
```

#### **1.3. Secure API Endpoints**
Modify your Spring Boot API to require JWT authentication.

```java
@RestController
@RequestMapping("/api")
public class VehicleController {

    @GetMapping("/vehicles")
    public ResponseEntity<List<Vehicle>> getVehicles(@RequestHeader("Authorization") String token) {
        if (jwtUtil.validateToken(token.replace("Bearer ", ""), "user")) {
            return ResponseEntity.ok(vehicleService.getAllVehicles());
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }
}
```

---

### **2. Implement JWT Authentication in React Native**
#### **2.1. Install Secure Storage for JWT**
```sh
npm install @react-native-async-storage/async-storage axios
```

#### **2.2. Create Authentication Service (`src/services/auth.js`)**
```javascript
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

export const login = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, { username, password });
    if (response.data.token) {
      await AsyncStorage.setItem('token', response.data.token);
      return response.data;
    }
  } catch (error) {
    console.error('Login failed:', error);
  }
  return null;
};

export const getAuthToken = async () => {
  return await AsyncStorage.getItem('token');
};

export const logout = async () => {
  await AsyncStorage.removeItem('token');
};
```

#### **2.3. Modify API Service to Include JWT Token**
Update `src/services/api.js` to include JWT in requests.

```javascript
import axios from 'axios';
import { getAuthToken } from './auth';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({ baseURL: API_BASE_URL });

api.interceptors.request.use(async (config) => {
  const token = await getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

export const getVehicles = async () => {
  try {
    const response = await api.get('/vehicles');
    return response.data;
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    return [];
  }
};
```

#### **2.4. Create Login Screen (`src/screens/LoginScreen.js`)**
```javascript
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { login } from '../services/auth';

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    const result = await login(username, password);
    if (result) {
      navigation.navigate('Home');
    } else {
      alert('Login failed');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput style={styles.input} placeholder="Username" onChangeText={setUsername} />
      <TextInput style={styles.input} placeholder="Password" secureTextEntry onChangeText={setPassword} />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  input: { borderWidth: 1, padding: 10, marginBottom: 10 }
});

export default LoginScreen;
```

#### **2.5. Update Navigation in `App.js`**
```javascript
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import VehiclesScreen from './src/screens/VehiclesScreen';

const Stack = createStackNavigator();

const App = () => (
  <NavigationContainer>
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Vehicles" component={VehiclesScreen} />
    </Stack.Navigator>
  </NavigationContainer>
);

export default App;
```

---

## **3. Adding WebSocket for Real-Time Vehicle Updates**
### **3.1. Enable WebSockets in Spring Boot**
Add this to your Spring Boot configuration.

```java
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        registry.enableSimpleBroker("/topic");
        registry.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws").setAllowedOrigins("*").withSockJS();
    }
}
```

### **3.2. Update React Native to Support WebSockets**
Install WebSocket dependencies:
```sh
npm install @stomp/stompjs
```

Create `src/services/websocket.js`:
```javascript
import { Client } from '@stomp/stompjs';

const socketURL = 'ws://localhost:8080/ws';

export const socketClient = new Client({
  brokerURL: socketURL,
  onConnect: () => console.log('Connected to WebSocket'),
  onDisconnect: () => console.log('Disconnected from WebSocket'),
});

export const subscribeToVehicleUpdates = (callback) => {
  socketClient.onStompError = (error) => console.error('WebSocket error:', error);
  socketClient.activate();
  
  socketClient.onConnect = () => {
    socketClient.subscribe('/topic/vehicles', (message) => {
      callback(JSON.parse(message.body));
    });
  };
};
```

Modify `VehiclesScreen.js` to subscribe to updates:
```javascript
import { subscribeToVehicleUpdates } from '../services/websocket';

useEffect(() => {
  subscribeToVehicleUpdates((updatedVehicle) => {
    setVehicles((prevVehicles) => prevVehicles.map(v => v.id === updatedVehicle.id ? updatedVehicle : v));
  });
}, []);
```

---

## **Conclusion**
- **JWT Authentication** secures API requests.
- **WebSockets** enable real-time vehicle tracking.

---
### **Adding Real-Time Vehicle Movement in the UI**
To visually display real-time vehicle movement, we'll integrate **React Native Maps** and update vehicle locations dynamically using **WebSockets**.

---

## **1. Install Required Packages**
```sh
npm install react-native-maps @react-native-maps/maps @stomp/stompjs
```
For **iOS**, install pods:
```sh
cd ios && pod install && cd ..
```

---

## **2. Update WebSocket Service to Handle Real-Time Vehicle Updates**
Modify `src/services/websocket.js` to handle vehicle location updates.

```javascript
import { Client } from '@stomp/stompjs';

const socketURL = 'ws://localhost:8080/ws';

export const socketClient = new Client({
  brokerURL: socketURL,
  debug: (str) => console.log(str), // Debugging WebSocket connection
  onConnect: () => console.log('Connected to WebSocket'),
  onDisconnect: () => console.log('Disconnected from WebSocket'),
});

export const subscribeToVehicleUpdates = (callback) => {
  socketClient.onStompError = (error) => console.error('WebSocket error:', error);
  socketClient.activate();
  
  socketClient.onConnect = () => {
    socketClient.subscribe('/topic/vehicles', (message) => {
      callback(JSON.parse(message.body));
    });
  };
};
```

---

## **3. Modify Vehicles Screen to Show Live Map Updates**
Modify `src/screens/VehiclesScreen.js` to display **vehicle locations** in real time.

```javascript
import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { getVehicles } from '../services/api';
import { subscribeToVehicleUpdates } from '../services/websocket';

const VehiclesScreen = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVehicles();
    subscribeToVehicleUpdates((updatedVehicle) => {
      setVehicles((prevVehicles) =>
        prevVehicles.map((v) =>
          v.id === updatedVehicle.id ? updatedVehicle : v
        )
      );
    });
  }, []);

  const fetchVehicles = async () => {
    const data = await getVehicles();
    setVehicles(data);
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: vehicles.length ? vehicles[0].latitude : 37.7749, // Default center
            longitude: vehicles.length ? vehicles[0].longitude : -122.4194,
            latitudeDelta: 0.1,
            longitudeDelta: 0.1,
          }}
        >
          {vehicles.map((vehicle) => (
            <Marker
              key={vehicle.id}
              coordinate={{
                latitude: vehicle.latitude,
                longitude: vehicle.longitude,
              }}
              title={vehicle.name}
              description={`Type: ${vehicle.type} | Capacity: ${vehicle.capacity}`}
            />
          ))}
        </MapView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
});

export default VehiclesScreen;
```

---

## **4. Update Backend to Send Real-Time Location Updates**
Modify your **Spring Boot** controller to broadcast vehicle location changes.

```java
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Random;

@RestController
@RequestMapping("/api")
public class VehicleController {

    private final SimpMessagingTemplate messagingTemplate;
    private final VehicleService vehicleService;
    private final Random random = new Random();

    public VehicleController(SimpMessagingTemplate messagingTemplate, VehicleService vehicleService) {
        this.messagingTemplate = messagingTemplate;
        this.vehicleService = vehicleService;
    }

    @GetMapping("/vehicles")
    public List<Vehicle> getVehicles() {
        return vehicleService.getAllVehicles();
    }

    // Simulate real-time location updates every 5 seconds
    @Scheduled(fixedRate = 5000)
    public void sendVehicleUpdates() {
        List<Vehicle> vehicles = vehicleService.getAllVehicles();
        for (Vehicle vehicle : vehicles) {
            vehicle.setLatitude(vehicle.getLatitude() + (random.nextDouble() - 0.5) * 0.01);
            vehicle.setLongitude(vehicle.getLongitude() + (random.nextDouble() - 0.5) * 0.01);
            messagingTemplate.convertAndSend("/topic/vehicles", vehicle);
        }
    }
}
```

---

## **5. Testing the App**
1. **Run Spring Boot Backend**
   ```sh
   mvn spring-boot:run
   ```
2. **Run React Native App**
   ```sh
   npx react-native run-android
   ```
   OR
   ```sh
   npx react-native run-ios
   ```

---

## **6. Expected Behavior**
- The app **displays a map** with vehicle locations as markers.
- Vehicles **move dynamically** every **5 seconds**, simulating real-time tracking.
- React Native **receives WebSocket updates** and updates vehicle positions accordingly.

---

### **Next Steps**
- Add **real GPS tracking** using a GPS-enabled device.
- Implement a **backend database (PostgreSQL, MySQL, MongoDB)** for persistent tracking.
- Enhance UI with **real-time animations** for smoother movement.

---
### **Implementing Real GPS Tracking in the React Native Transportation App**
To track **real-time vehicle locations** using **GPS**, we will:
1. **Use React Native’s location services** to get GPS coordinates.
2. **Send GPS data to the Spring Boot backend**.
3. **Update the WebSocket service to broadcast real locations**.
4. **Visualize the movement on the map in real-time**.

---

## **1. Install Location Services in React Native**
First, install the required packages:
```sh
npm install @react-native-community/geolocation
npm install react-native-permissions
```
For **iOS**, update `Info.plist` (found in `ios/YourApp/Info.plist`) and add:
```xml
<key>NSLocationWhenInUseUsageDescription</key>
<string>We need access to your location for tracking</string>
<key>NSLocationAlwaysUsageDescription</key>
<string>We need access to track vehicle movement</string>
```
For **Android**, update `AndroidManifest.xml` (found in `android/app/src/main/AndroidManifest.xml`):
```xml
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION"/>
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION"/>
```

---

## **2. Update React Native to Send GPS Data to Backend**
Modify `src/services/location.js` to send GPS coordinates to the backend.

```javascript
import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';

const API_URL = 'http://localhost:8080/api/vehicles/update-location';

export const trackVehicleLocation = (vehicleId) => {
  Geolocation.watchPosition(
    async (position) => {
      const { latitude, longitude } = position.coords;
      try {
        await axios.post(API_URL, { vehicleId, latitude, longitude });
      } catch (error) {
        console.error('Error sending location update:', error);
      }
    },
    (error) => console.error('Error getting location:', error),
    { enableHighAccuracy: true, distanceFilter: 10 }
  );
};
```

---

## **3. Call Location Tracking from the Vehicles Screen**
Modify `src/screens/VehiclesScreen.js` to start tracking.

```javascript
import { useEffect } from 'react';
import { trackVehicleLocation } from '../services/location';

useEffect(() => {
  const vehicleId = 1; // Replace with dynamic vehicle ID
  trackVehicleLocation(vehicleId);
}, []);
```

---

## **4. Update Spring Boot Backend to Handle GPS Updates**
Modify the `VehicleController.java` to accept GPS updates.

```java
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/vehicles")
public class VehicleController {

    private final SimpMessagingTemplate messagingTemplate;
    private final VehicleService vehicleService;

    public VehicleController(SimpMessagingTemplate messagingTemplate, VehicleService vehicleService) {
        this.messagingTemplate = messagingTemplate;
        this.vehicleService = vehicleService;
    }

    @PostMapping("/update-location")
    public void updateVehicleLocation(@RequestBody Vehicle vehicleUpdate) {
        Vehicle vehicle = vehicleService.updateLocation(vehicleUpdate.getId(), vehicleUpdate.getLatitude(), vehicleUpdate.getLongitude());
        messagingTemplate.convertAndSend("/topic/vehicles", vehicle);
    }
}
```

---

## **5. Implement Database Storage for GPS Updates**
Modify `VehicleService.java` to store GPS data in the database.

```java
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class VehicleService {

    private final VehicleRepository vehicleRepository;

    public VehicleService(VehicleRepository vehicleRepository) {
        this.vehicleRepository = vehicleRepository;
    }

    public List<Vehicle> getAllVehicles() {
        return vehicleRepository.findAll();
    }

    public Vehicle updateLocation(Long vehicleId, double latitude, double longitude) {
        Optional<Vehicle> optionalVehicle = vehicleRepository.findById(vehicleId);
        if (optionalVehicle.isPresent()) {
            Vehicle vehicle = optionalVehicle.get();
            vehicle.setLatitude(latitude);
            vehicle.setLongitude(longitude);
            return vehicleRepository.save(vehicle);
        }
        return null;
    }
}
```

---

## **6. Run and Test**
1. Start the **Spring Boot backend**:
   ```sh
   mvn spring-boot:run
   ```
2. Start the **React Native app**:
   ```sh
   npx react-native run-android
   ```
   OR
   ```sh
   npx react-native run-ios
   ```

---

## **7. Expected Behavior**
- When the app runs, it requests **GPS permissions**.
- The **vehicle’s GPS location updates** every few seconds.
- The **backend receives and broadcasts** the updates via **WebSockets**.
- The **React Native app map updates in real-time**.

---

## **Next Steps**
- Add **GPS history tracking**.
- Implement **geofencing** (alerts if a vehicle leaves a defined area).
- Optimize **battery efficiency** with background tracking.

Would you like me to implement GPS history tracking next? 🚀
---
