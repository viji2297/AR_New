import AsyncStorage from '@react-native-async-storage/async-storage'
import { router } from 'expo-router'
import React, { useState } from 'react'
import { StatusBar, StyleSheet, ToastAndroid, useColorScheme, View } from 'react-native'
import { Avatar, Button, MD3DarkTheme, MD3LightTheme, PaperProvider, Text, TextInput } from 'react-native-paper'
import { configuration } from './Configuration/ServerConfig'
import { SignInService } from './Services/Authentication'

const SignIn = () => {
    const [userName, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState("");

    const colorScheme = useColorScheme();

    const isDarkMode = colorScheme === 'dark';

    const theme = {
        ...(isDarkMode ? MD3DarkTheme : MD3LightTheme),
        colors: {
            ... (isDarkMode ? MD3DarkTheme.colors : MD3LightTheme.colors),
            primary: '#C6FAD2', 
            onSurface: isDarkMode ? '#fff' : '#000', 
            surface: isDarkMode ? '#333' : '#fff', 
            background: isDarkMode ? '#F48882' : '#DD9BCF'
        }
    };

    const navigateToHome = async () => {
        console.log("button clicked");
        
        let data = {
            userName,
            password,
            companyId: configuration.companyID,
            // imei: configuration.IMEI
        };

        try {
            if (!userName || !password){
                setErrorMessage("Please enter the mandatory fields.");
            }
            else{
                const response = await SignInService(data);
            console.log("responseresponse.user",response.userData);
            
                if (response) {
                    await AsyncStorage.setItem('loginId', response.userData.user.mobileNumber);
                    await AsyncStorage.setItem('userId',String(response.userData.user.userId))
                    await AsyncStorage.setItem('userEmailId', response.userData.user.userEmailId); 
                    ToastAndroid.showWithGravity("SignIn Successful",ToastAndroid.SHORT, ToastAndroid.CENTER);                
                    router.replace("/(tabs)");
                } else {
                    setErrorMessage("Invalid Credentials");
                }
            }
           
        } catch (error: any) {  
            console.log("error",error);

            if (error.response && error.response.data) {
                console.log("Error", error.response.data.message); 
                setErrorMessage(error.response.data.message.split(":")[1]);
            } else {
                console.log("An unknown error occurred:", error);
                setErrorMessage("An unknown error occurred. Please try again.");
            }
        }
    };
    
    
    
    return (
        <PaperProvider theme={theme}>
            <StatusBar backgroundColor={isDarkMode ? "#121212" : "#DD9BCF"} barStyle={isDarkMode ? "light-content" : "dark-content"} />

                <View style={[styles.mainContainer, { backgroundColor: theme.colors.background }]}>
                <View style={styles.iconView}>
            <Avatar.Image size={120} source={require('../assets/images/icon.png')} style={{}}/>
            </View>
                    <View style={styles.fieldView}>
                        <View>
                            <TextInput label='UserName' value={userName} onChangeText={(txt: string) =>{setUsername(txt); setErrorMessage('')}} activeUnderlineColor= {isDarkMode ? '#C6FAD2':'#F48882'}/>
                        </View>
                        <View>
                            <TextInput label='Password' value={password} onChangeText={(txt: string) =>{setPassword(txt); setErrorMessage('')}} activeUnderlineColor= {isDarkMode ? '#C6FAD2':'#F48882'} secureTextEntry={true}/>
                        </View>
                        <View>
                            <Text style={{color:'#F6FFEE'}}>{errorMessage}</Text>
                        </View>
                    </View>
                    <View style={styles.buttonView}>
                        <Button mode='elevated'
                        //  buttonColor='#bb4d53'
                        buttonColor='#F6FFEE'
                          rippleColor="#C6FAD2" textColor='#F48882' onPress={() => {navigateToHome();}} >Login</Button>
                    </View>
                </View>
            </PaperProvider>
    )
}

export default SignIn

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",       
    },
    backgroundImage: {
        flex: 1,
        justifyContent: "center"
    },
    lockIcon: {
        backgroundColor: "#e5e5e5",
    },
    iconView: {
        marginBottom: 50,
        marginTop: -50
    },
    fieldView: {
        rowGap: 15,
        width: "70%",
    },
    buttonView: {
        width: "70%",
        marginTop: 25
    },
    avatarText: {
        marginTop: 10, 
        fontSize: 16, 
        color: 'blue', 
        fontWeight: 900,
        textAlign: 'center',
    },
})