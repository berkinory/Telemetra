# Phase Analytics SDK

Analytics SDK for React Native and Expo applications.

## Installation

```bash
npm install @phase-analytics/react-native
# or
bun add @phase-analytics/react-native
```

## React Native

### Setup

Wrap your app with `PhaseProvider`:

```tsx
import { PhaseProvider, Phase } from '@phase-analytics/react-native';
import { NavigationContainer } from '@react-navigation/native';

function App() {
  return (
    <PhaseProvider apiKey="phase_xxx">
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </PhaseProvider>
  );
}
```

### Usage

```tsx
import { Phase } from '@phase-analytics/react-native';

// Identify user (call after login or on app start)
await Phase.identify({ user_id: '123', plan: 'premium' });

// Track events
await Phase.track('purchase', { amount: 99.99, currency: 'USD' });

// Track screens (call in your screen components or navigation listeners)
await Phase.trackScreen('/home');
await Phase.trackScreen('/profile', { user_id: '123' });
```

### Track Screens with React Navigation

```tsx
import { Phase } from '@phase-analytics/react-native';
import { useNavigationContainerRef } from '@react-navigation/native';

function App() {
  const navigationRef = useNavigationContainerRef();

  return (
    <PhaseProvider apiKey="phase_xxx">
      <NavigationContainer
        ref={navigationRef}
        onStateChange={() => {
          const currentRoute = navigationRef.getCurrentRoute();
          if (currentRoute?.name) {
            Phase.trackScreen(`/${currentRoute.name.toLowerCase()}`);
          }
        }}
      >
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </PhaseProvider>
  );
}
```

### Options

```tsx
<PhaseProvider
  apiKey="phase_xxx"             // Required: Your Phase API key
  baseUrl="https://api.phase.sh" // Optional: Custom API endpoint
  logLevel="info"                // Optional: 'info' | 'warn' | 'error' | 'none'
  deviceInfo={true}              // Optional: Collect device metadata
  userLocale={true}              // Optional: Collect locale & geolocation
>
  {children}
</PhaseProvider>
```

## Expo

### Setup

Wrap your app with `PhaseProvider`:

```tsx
import { PhaseProvider } from '@phase-analytics/expo';
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <PhaseProvider apiKey="phase_xxx" trackNavigation>
      <Stack>
        <Stack.Screen name="index" />
        <Stack.Screen name="profile" />
      </Stack>
    </PhaseProvider>
  );
}
```

### Usage

```tsx
import { Phase } from '@phase-analytics/expo';

// Identify user
await Phase.identify({ user_id: '123', plan: 'premium' });

// Track events
await Phase.track('purchase', { amount: 99.99, currency: 'USD' });
```

### Options

```tsx
<PhaseProvider
  apiKey="phase_xxx"           // Required: Your Phase API key
  trackNavigation              // Optional: Auto-track screen navigation
  baseUrl="https://api.phase.sh" // Optional: Custom API endpoint
  logLevel="info"              // Optional: 'info' | 'warn' | 'error' | 'none'
  deviceInfo={true}            // Optional: Collect device metadata
  userLocale={true}            // Optional: Collect locale & geolocation
>
  {children}
</PhaseProvider>
```

## API

### `Phase.identify(properties?)`

Register device and start session. Call this after user login or on app start.

```tsx
await Phase.identify();
await Phase.identify({ user_id: '123', plan: 'premium' });
```

### `Phase.track(name, params?)`

Track custom events.

```tsx
await Phase.track('purchase', { amount: 99.99, currency: 'USD' });
await Phase.track('button_click', { button_id: 'checkout' });
```

### `Phase.trackScreen(name, params?)` (React Native only)

Track screen views manually.

```tsx
await Phase.trackScreen('/home');
await Phase.trackScreen('/profile', { user_id: '123' });
```

## Notes

- SDK automatically waits for initialization before processing calls
- All tracking calls are async and safe to call immediately
- Expo: Navigation tracking is automatic when `trackNavigation` is enabled
- React Native: Use `Phase.trackScreen()` manually in navigation listeners
