import { getNetworkStateAsync } from 'expo-network';
import { logger } from '../../core/utils/logger';

export type NetworkState = {
  isConnected: boolean;
};

export type NetworkStateListener = (state: NetworkState) => void;
export type UnsubscribeFn = () => void;

export async function fetchNetworkState(): Promise<NetworkState> {
  try {
    const networkState = await getNetworkStateAsync();
    return {
      isConnected: networkState.isConnected ?? false,
    };
  } catch (error) {
    logger.error('Failed to fetch network state', error);
    return { isConnected: true };
  }
}

export function addNetworkListener(
  listener: NetworkStateListener
): UnsubscribeFn {
  let isActive = true;
  let lastState: NetworkState | null = null;

  const pollInterval = 5000;

  const poll = async () => {
    if (!isActive) {
      return;
    }

    try {
      const currentState = await fetchNetworkState();

      if (
        lastState === null ||
        lastState.isConnected !== currentState.isConnected
      ) {
        lastState = currentState;
        listener(currentState);
      }
    } catch (error) {
      logger.error('Network polling error', error);
    }

    if (isActive) {
      setTimeout(poll, pollInterval);
    }
  };

  poll();

  return () => {
    isActive = false;
  };
}
