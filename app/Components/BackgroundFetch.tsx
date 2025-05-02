import * as TaskManager from 'expo-task-manager';
import * as BackgroundFetch from 'expo-background-fetch';
import { Platform } from 'react-native';
import NetInfo from '@react-native-community/netinfo';


const NETWORK_CHECK_TASK = 'network-check-task';

TaskManager.defineTask(NETWORK_CHECK_TASK, async () => {
  try {
    const state = await NetInfo.fetch();
    console.log('Network status in the background:', state.isConnected ? 'Online' : 'Offline');
    return 'NewData'; 
  } catch (error) {
    console.error('Error in background network check:', error);
    return 'Failed';  
  }
});


export async function registerBackgroundNetworkCheck() {
  if (Platform.OS === 'android') {
    try {
      await BackgroundFetch.registerTaskAsync(NETWORK_CHECK_TASK, {
        minimumInterval: 1, 
        stopOnTerminate: false, 
        startOnBoot: true, 
      });
      console.log('Background network check task registered successfully.');
    } catch (error) {
      console.error('Failed to register background network check task:', error);
    }
  }
}

export async function unregisterBackgroundNetworkCheck() {
  try {
    await BackgroundFetch.unregisterTaskAsync(NETWORK_CHECK_TASK);
    console.log('Background network check task unregistered.');
  } catch (error) {
    console.error('Failed to unregister background network check task:', error);
  }
}
