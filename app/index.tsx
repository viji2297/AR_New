//Main Branch
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as BackgroundFetch from 'expo-background-fetch';
import { useCameraPermissions } from 'expo-camera';
import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';
import * as TaskManager from 'expo-task-manager';
import React, { useEffect } from 'react';
import { Button, StyleSheet } from 'react-native';
import { ThemedText, ThemedView } from './Components/Common/Theme';
import checkTokenExpiration from './Components/Common/TokenCheck';
import { checkNetworkStatus, sendNotification } from './Network/NetworkCheck';

const NETWORK_TASK_NAME = 'background-network-task';

export default function Index() {
  const [permission, requestPermission] = useCameraPermissions();

  useEffect(() => {
    requestNotificationPermissions();
    requestCameraPermissions();
    registerBackgroundNetworkCheck();
    return () => {};
  }, []);

  useEffect(() => {
    if (!permission) {
      permissionFunction();
    }
  }, [permission, requestPermission]);

  const permissionFunction = async () => {
    if (!permission) {
      return <ThemedView />;
    }

    if (!permission.granted) {
      return (
        <ThemedView style={styles.container}>
          <ThemedText style={styles.message}>We need your permission to show the camera</ThemedText>
          <Button onPress={requestPermission} title="Grant Permission" />
        </ThemedView>
      );
    }
  };

  const checkScreen = async () => {
    // try{
    //   router.replace("/(tabs)");     
    // }catch(error:any){
    //   console.log("error",error);
    //   router.replace("/(tabs)");     
    // }
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        navigateToSignIn();
      } else {
        const tokenExpired = await checkTokenExpiration();
        if (tokenExpired) {
          router.replace("/SignIn");
          return;
        } else{
        //   router.replace("MainTab");
        router.replace('/(tabs)')
        }
      }
    } catch (error: any) {
      console.log("error", error);
      navigateToSignIn();
    }
  }

  useEffect(() => {
    checkScreen()
  }, []);

  const navigateToSignIn = () => {
    setTimeout(() => {
      router.replace("/SignIn");
    }, 1000);
  };

  const requestNotificationPermissions = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      console.log('Notification permission not granted');
    }
  };

  const requestCameraPermissions = async () => {
    const { status } = await requestPermission(); 
    if (status !== 'granted') {
      console.log('Camera permission not granted');
    }
  };
 
  const registerBackgroundNetworkCheck = async () => {
    const isRegistered = await TaskManager.isTaskRegisteredAsync(NETWORK_TASK_NAME);

    if (!isRegistered) {
      await BackgroundFetch.registerTaskAsync(NETWORK_TASK_NAME, {
        minimumInterval: 3 * 60, 
        stopOnTerminate: false,
        startOnBoot: true,
      });

      console.log("Background network check registered.");
    }
  };

  return <></>;
}

TaskManager.defineTask(NETWORK_TASK_NAME, async () => {
  try {
    const isConnected = await checkNetworkStatus();
    
    if (isConnected) {
      console.log("Network available in background, synchronizing...");

      await performBackgroundSynchronization();

      return BackgroundFetch.BackgroundFetchResult.NewData;  
    } else {
      console.log("Network not available in background.");
      return BackgroundFetch.BackgroundFetchResult.NoData;
    }
  } catch (error) {
    console.error("Error during background task:", error);
    return BackgroundFetch.BackgroundFetchResult.Failed;  
  }
});

const performBackgroundSynchronization = async () => {
  try {
    await sendNotification("Sync Successful", "Data has been synchronized.");
  } catch (error) {
    console.error("Error during background sync:", error);
    await sendNotification("Sync Failed", "Failed to synchronize data.");
  } finally {
    try {
      await BackgroundFetch.unregisterTaskAsync(NETWORK_TASK_NAME);
      console.log("Background fetch task unregistered successfully.");
    } catch (unregisterError) {
      console.error("Error unregistering background fetch task:", unregisterError);
    }
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    margin: 30,
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
});
