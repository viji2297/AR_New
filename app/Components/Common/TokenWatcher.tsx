import { router } from 'expo-router';
import { useEffect, useRef } from "react";
import { AppState, AppStateStatus } from "react-native";
import checkTokenExpiration from "./TokenCheck";

const TokenWatcher = () => {
    const appState = useRef<AppStateStatus>(AppState.currentState);
    const intervalRef = useRef<number | null>(null);

    useEffect(() => {
        const handleAppStateChange = (nextAppState: AppStateStatus) => {
            if (appState.current === "active" && nextAppState.match(/inactive|background/)) {
                console.log("App moved to background");
            } else if (appState.current.match(/inactive|background/) && nextAppState === "active") {
                console.log("App resumed from background");
                checkTokenExpiration(); 
            }
            appState.current = nextAppState;
        };

        const subscription = AppState.addEventListener("change", handleAppStateChange);

        intervalRef.current = setInterval(() => {
            checkTokenExpiration()
                .then((expired: boolean) => { 
                    if (expired) {
                        console.log("Token expired, redirecting to login...");
                        router.replace("/SignIn");
                    }
                })

                .catch((error: any) => console.error("Error checking token:", error));
        }, 5 * 60 * 1000); 

        return () => {
            subscription.remove();
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

    return null; 
};

export default TokenWatcher;
