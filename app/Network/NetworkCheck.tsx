import NetInfo from '@react-native-community/netinfo';
import * as Notifications from 'expo-notifications';

export const checkNetworkStatus = async () => {
  const networkState = await NetInfo.fetch();
  if (networkState.isConnected) {
    
    return true;
  } else {
    console.log("No network connection.");
    return false;
  }
};


export const sendNotification = async (title: string, body: string) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,  
      body,   
    },
    trigger: null,  
  });
};
