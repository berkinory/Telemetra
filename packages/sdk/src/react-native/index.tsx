import type { ReactNode } from 'react';
import { useEffect, useRef } from 'react';
import { PhaseSDK } from '../core/sdk';
import { setStorageAdapter } from '../core/storage/storage';
import type { DeviceProperties, EventParams, PhaseConfig } from '../core/types';
import { logger } from '../core/utils/logger';
import { getRNDeviceInfo } from './device/rn-device-info';
import { addNetworkListener, fetchNetworkState } from './network/rn-network';
import { clear, getItem, removeItem, setItem } from './storage/rn-storage';

let sdk: PhaseSDK | null = null;
let initializationPromise: Promise<boolean> | null = null;

function getSDK(): PhaseSDK | null {
  return sdk;
}

function ensureSDK(): PhaseSDK {
  if (!sdk) {
    sdk = new PhaseSDK();
  }
  return sdk;
}

function initSDK(config: PhaseConfig): Promise<boolean> {
  if (initializationPromise) {
    return initializationPromise;
  }

  initializationPromise = (async () => {
    try {
      setStorageAdapter({
        getItem,
        setItem,
        removeItem,
        clear,
      });

      const networkAdapter = {
        fetchNetworkState,
        addNetworkListener,
      };

      await ensureSDK().init(config, getRNDeviceInfo, networkAdapter);

      return true;
    } catch (error) {
      logger.error('Initialization failed', error);
      initializationPromise = null;
      return false;
    }
  })();

  return initializationPromise;
}

type PhaseProps = PhaseConfig & {
  children: ReactNode;
};

/**
 * Phase Analytics provider for React Native
 * @param apiKey Phase API key (required, starts with `phase_`)
 * @param children App content (required)
 * @param baseUrl Custom API endpoint (optional, default: "https://api.phase.sh")
 * @param logLevel Logging level (optional, info, warn, error, none, default: "none")
 * @param deviceInfo Collect device metadata (optional, default: true)
 * @param userLocale Collect locale & geolocation (optional, default: true)
 * @example
 * <PhaseProvider apiKey="phase_xxx">
 *   <NavigationContainer>
 *     <Stack.Navigator>
 *       <Stack.Screen name="Home" component={HomeScreen} />
 *     </Stack.Navigator>
 *   </NavigationContainer>
 * </PhaseProvider>
 */
function PhaseProvider({
  children,
  apiKey,
  baseUrl,
  logLevel,
  deviceInfo,
  userLocale,
}: PhaseProps): ReactNode {
  const initStarted = useRef(false);

  useEffect(() => {
    if (initStarted.current) {
      return;
    }
    initStarted.current = true;

    const config: PhaseConfig = {
      apiKey,
      baseUrl,
      logLevel,
      deviceInfo,
      userLocale,
    };

    initSDK(config);

    return () => {
      initStarted.current = false;
    };
  }, [apiKey, baseUrl, deviceInfo, logLevel, userLocale]);

  return <>{children}</>;
}

/**
 * Register device and start session
 * @param properties Custom device attributes (optional)
 * @example
 * // Basic usage
 * await Phase.identify();
 *
 * // After user login
 * await Phase.identify({ user_id: '123', plan: 'premium' });
 */
async function identify(properties?: DeviceProperties): Promise<void> {
  if (initializationPromise) {
    await initializationPromise;
  }

  const instance = getSDK();
  if (!instance) {
    logger.error('SDK not initialized. Wrap your app with <PhaseProvider>.');
    return;
  }
  await instance.identify(properties);
}

/**
 * Track custom event
 * @param name Event name (required, alphanumeric, `_`, `-`, `.`, `/`)
 * @param params Event parameters (optional, primitives only)
 * @example
 * await Phase.track('purchase', { amount: 99.99, currency: 'USD' });
 */
async function track(name: string, params?: EventParams): Promise<void> {
  if (initializationPromise) {
    await initializationPromise;
  }

  const instance = getSDK();
  if (!instance) {
    logger.error('SDK not initialized. Wrap your app with <PhaseProvider>.');
    return;
  }
  instance.track(name, params);
}

/**
 * Track screen view
 * @param name Screen name (required, use path format like "/home")
 * @param params Additional parameters (optional, primitives only)
 * @example
 * await Phase.trackScreen('/home');
 * await Phase.trackScreen('/profile', { user_id: '123' });
 */
async function trackScreen(name: string, params?: EventParams): Promise<void> {
  if (initializationPromise) {
    await initializationPromise;
  }

  const instance = getSDK();
  if (!instance) {
    logger.error('SDK not initialized. Wrap your app with <PhaseProvider>.');
    return;
  }
  instance.trackScreen(name, params);
}

/**
 * Phase Analytics SDK
 *
 * @example
 * import { Phase } from '@phase-analytics/react-native';
 *
 * // Identify device
 * await Phase.identify({ user_id: '123' });
 *
 * // Track events
 * await Phase.track('purchase', { amount: 99.99 });
 *
 * // Track screens
 * await Phase.trackScreen('/home');
 */
const Phase = {
  identify,
  track,
  trackScreen,
};

export { PhaseProvider, Phase };
export type { DeviceProperties, EventParams, PhaseConfig } from '../core/types';
