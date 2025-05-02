import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { configuration } from '../Configuration/ServerConfig';

export async function SignInService(data: any) {
    const config = {
        // url: configuration.authServer + "user-profile-service/login",
        url:configuration.localServer + 'Aby/authLogin',
        method: 'post',
        data
    }    
    try {
        const response = await axios(config); 
        return response.data;
    } catch (error: any) {
        throw error;
    }
}


export async function LogoutFunction(loginId : any, companyId:any) {    
    const token = await AsyncStorage.getItem('token');
    // let loginIdToString = loginId.toString()
    const config = {
        url : configuration.authServer + 'user-profile-service/logout',
            method : 'post',
            data:{
                address : "",
                loginId : loginId,
                companyId: companyId
            },
            // headers: { Authorization: `Bearer ${token}` },
    }
    try{
        const response = await axios(config)   
        return response.data
    }catch(error:any){
        throw error
    }
}

export async function refreshToken() {
    const refToken = await AsyncStorage.getItem('refToken');
    const config = {
        url: configuration.authServer + `user-profile-service/loginRefreshBasedOnCompany/${configuration.companyID}`,
        method: "post",
        params: { jwtRefreshCookie: refToken }
    };

    try {
        const response = await axios(config);
        if (response) {
            console.log("response",response.data);
            
            await AsyncStorage.setItem('token', response.data.jwtBearer);
            await AsyncStorage.setItem('refToken', response.data.jwtRefresh);
            await AsyncStorage.setItem('logoutStatus', 'refreshTokenExpired');
 
            return response.data;
        }
    } catch (error) {
        console.log("error",error);
        
        throw error;
    }
}

export async function changePasswordFunction(data: any) {
    const config = {
        url: configuration.authServer + "user-profile-service/resetPasswordByCompanyId",
        method: 'post',
        data
    }
    try {
        const response = await axios(config); 
        return response.data;
    } catch (error: any) {
        throw error;
    }
}