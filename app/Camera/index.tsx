import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useEffect, useRef, useState } from 'react';
import { Alert, Button, StyleSheet, Text, View } from 'react-native';
import { IconButton } from 'react-native-paper';
import Constants from 'expo-constants';
import * as MediaLibrary from 'expo-media-library';
import * as Location from 'expo-location';
import { ThemedView } from '@/components/ThemedView';
import database from '../LocalStorage/database';
import transactions from '../LocalStorage/models/Transaction.model';
import { router } from 'expo-router';
import { uploadImageUrl } from '../Services/ImageUpload';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CameraComponent() {
    const [facing, setFacing] = useState<CameraType>('back');
    const [permission, requestPermission] = useCameraPermissions();
    const [isCameraLoading, setIsCameraLoading] = useState(false);
    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [permissionResponse, requestpermission] = MediaLibrary.usePermissions();
    const [swipeFlag,setSwipeFlag] = useState("N")
    const cameraRef = useRef(null);

    async function getAlbums() {
        if (!permissionResponse || permissionResponse.status !== 'granted') {
            const response = await requestpermission();
            if (response.status !== 'granted') {
                Alert.alert('Permission required', 'Media library permission is required to fetch albums.');
                return;
            }
        }
        const fetchedAlbums = await MediaLibrary.getAlbumsAsync({
            includeSmartAlbums: true,
        });
    }

    useEffect(() => {
        getAlbums();
        checkAndRequestLocation();

        async function checkAndRequestLocation() {
            let { status } = await Location.requestForegroundPermissionsAsync();

            if (status !== 'granted') {
                Alert.alert(
                    'Location Permission Required',
                    'Please enable location services to continue using the app.',
                    [
                        {
                            text: 'Retry',
                            onPress: () => checkAndRequestLocation(),
                        },
                        {
                            text: 'Cancel',
                            style: 'cancel',
                        }
                    ]
                );
                return;
            }

            try {
                let currentLocation = await Location.getCurrentPositionAsync({});
                setLocation(currentLocation);
            } catch (e) {
                Alert.alert(
                    'Enable Location Services',
                    'Please ensure location services are turned on.',
                    [
                        {
                            text: 'Open Settings',
                            onPress: () => Location.enableNetworkProviderAsync(),
                        },
                        {
                            text: 'Retry',
                            onPress: () => checkAndRequestLocation(),
                        }
                    ]
                );
            }
        }
    }, []);

    if (!permission) {
        return <View />;
    }

    if (!permission.granted) {
        return (
            <View style={styles.container}>
                <Text style={styles.message}>We need your permission to show the camera</Text>
                <Button onPress={requestPermission} title="grant permission" />
            </View>
        );
    }

    function toggleCameraFacing() {
        setFacing(current => (current === 'back' ? 'front' : 'back'));
    }

    async function saveImage(newPhoto: any): Promise<string | null> {
        try {
            const asset = await MediaLibrary.createAssetAsync(newPhoto.uri);
            const albumName = Constants.expoConfig?.slug ?? 'AR';
            let album = await MediaLibrary.getAlbumAsync(albumName);
    
            if (!album) {
                album = await MediaLibrary.createAlbumAsync(albumName, asset, false);
            } else {
                await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
            }
    
            const assets = await MediaLibrary.getAssetsAsync({
                album,
                mediaType: MediaLibrary.MediaType.photo,
                sortBy: MediaLibrary.SortBy.creationTime,
                first: 1,
            });
    
            console.log("Saved Image URI:", assets.assets[0].uri);
    
            return assets.assets[0].uri; 
        } catch (error: any) {
            if (error.code === 'E_NO_PERMISSION') {
                Alert.alert("Permission Denied", "You need to allow storage access to save images.");
            } else {
                console.error('Error saving image:', error);

            }
            return null; 
        }
    }
    
    

    const takePicture = async () => {
        const userID = await AsyncStorage.getItem('userId');
        setIsCameraLoading(true);
      
        try {
          if (cameraRef?.current) {
            const photo = await cameraRef.current.takePictureAsync({
              exif: true,
              base64: true,
              additionalExif: {
                GPSLatitude: location?.coords.latitude,
                GPSLongitude: location?.coords.longitude,
                GPSAltitude: location?.coords.altitude,
              },
            });
      
            let geo_Coords = { coords: JSON.stringify(location?.coords) };
            console.log("geo_Coords", geo_Coords);
      
            const newPhoto = {
              height: photo.height,
              uri: photo.uri,
              width: photo.width,
              exif: true,
            };
      
            const imageUri = await saveImage(newPhoto);
      
            if (imageUri) {
              try {
                const fileName = imageUri.split('/').pop() || 'photo.jpg';
                const fileType = fileName.includes('.') ? fileName.split('.').pop() : 'jpg';
      
                const formData = new FormData();
                formData.append('image', {
                  uri: imageUri, 
                  type: `image/${fileType}`,
                  name: fileName,
                } as any);
      
                if(swipeFlag === "N"){
                    setSwipeFlag("Y")
                }else{
                    setSwipeFlag("N")
                }
                formData.append('userId', userID ?? '');
                formData.append('uri', imageUri);
                formData.append('swipeFlag', swipeFlag);
                formData.append('swipingTime', new Date().toISOString());
                formData.append('wfhFlag', 'No');
                formData.append('appVersion', '2.2.4');
      
                console.log("Before upload image");
      
                const syncImageResponse = await uploadImageUrl(formData);
                console.log("Upload Image Response", syncImageResponse.imageUrl);
      
                const newActivity = await database.write(async () => {
                  const activity = await database.get<transactions>('transactions').create((activity) => {
                    activity.imageUrl = syncImageResponse.imageUrl;
                    activity.swipeFlag = swipeFlag;
                    activity.swipeTime = new Date().toString();
                    activity.userId = userID ? userID : "";
                    activity.wfhFlag = "No";
                    activity.uri = syncImageResponse.imageUrl;
                    activity.syncFlag = "Y";
                    activity.appVersion = "2.2.4";
                  });
                  return activity;
                });
      
                router.replace('/(tabs)');
              } catch (error: any) {
                console.log("Database error:", error.message);
              }
            } else {
              console.log("Image not saved, staying on camera.");
            }
          }
        } catch (error) {
          console.error("Error capturing photo: ", error);
        } finally {
          setIsCameraLoading(false);
        }
      };
         

    return (
        <View style={styles.container}>
            <CameraView style={{ flex: 1 }} facing="back" ref={cameraRef}>
                <ThemedView style={styles.cameraIconContainer}>
                    <IconButton
                        icon="camera"
                        iconColor="white"
                        size={35}
                        style={styles.cameraStyle}
                        onPress={takePicture}
                        disabled={isCameraLoading}
                        loading={isCameraLoading}
                    />
                </ThemedView>
            </CameraView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    message: {
        textAlign: 'center',
        paddingBottom: 10,
    },
    camera: {
        flex: 1,
    },
    buttonContainer: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'transparent',
        margin: 64,
    },
    cameraIconContainer: {
        flex: 1,
        backgroundColor: "transparent",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "flex-end",
    },
    button: {
        flex: 1,
        alignSelf: 'flex-end',
        alignItems: 'center',
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
    },
    cameraStyle: {
        alignSelf: "flex-end",
        alignItems: "center",
        backgroundColor: "black",
        marginBottom: 10,
    },
});
