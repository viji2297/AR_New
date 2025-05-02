import { decode } from "base-64";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { refreshToken } from "@/app/Services/Authentication";
import { checkNetworkStatus } from "@/app/Network/NetworkCheck";

interface DecodedToken {
    exp?: number;
}

const checkTokenExpiration = async (): Promise<boolean> => {
    try {
        const token = await AsyncStorage.getItem("token");
        const logoutStatus = await AsyncStorage.getItem("logoutStatus");
        console.log("Logout Status:", logoutStatus);

        if (!token) {
            console.error("No token provided.");
            return true;
        }

        const tokenParts = token.split(".");
        if (tokenParts.length !== 3) {
            console.error("Invalid token format.");
            return true;
        }

        const [, payload] = tokenParts;
        const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
        const decodedPayload = JSON.parse(decode(base64)) as DecodedToken;

        if (!decodedPayload.exp) {
            console.error("Token does not have an expiration date.");
            return true;
        }

        const expiryTime = decodedPayload.exp * 1000;
        const currentTime = Date.now();

        if (expiryTime > currentTime) {
            console.log("Token is valid.");
            return false;
        }

        if (logoutStatus === "refreshToken" && currentTime >= expiryTime) {
            console.log("Token expired, attempting to refresh...");
            const isConnected = await checkNetworkStatus();

            if (isConnected) {
                try {
                    // await refreshToken();
                    const resp = await refreshToken();
                    if (resp.message === 'Success') {
                        console.log("Tokens refreshed");
                        return false;

                    }
                    else {
                        console.log("No response for token refresh");
                        return true;
                    }
                    // console.log("Token successfully refreshed.",token_wait);
                    // return false;
                } catch (error) {
                    console.error("Failed to refresh token:", error);
                    return true;
                }
            } else {
                console.error("No network connection, cannot refresh token.");
                return true;
            }
        }

        if (logoutStatus === "refreshTokenExpired" && currentTime >= expiryTime) {
            console.log("Token and refresh token both expired. User must log in again.");
            return true;
        }

        console.log("Token has already expired.");
        return true;
    } catch (error) {
        console.error("Error decoding or validating token:", error);
        return true;
    }
};

export default checkTokenExpiration;
