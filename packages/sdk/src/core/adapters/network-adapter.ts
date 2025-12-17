export type NetworkState = {
  isConnected: boolean;
};

export type NetworkStateListener = (state: NetworkState) => void;
export type UnsubscribeFn = () => void;

export type NetworkAdapter = {
  fetchNetworkState(): Promise<NetworkState>;
  addNetworkListener(listener: NetworkStateListener): UnsubscribeFn;
};
