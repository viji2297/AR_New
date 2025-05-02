import axios from "axios";
import { configuration } from "../Configuration/ServerConfig";

export async function uploadImageUrl(data: any) {

  try {
    const response = await axios.post(
      configuration.localServer + 'Aby/transaction/uploadfile',
      data,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Accept: 'application/json',
        },
        timeout: 10000, 
      }
    );
    console.log("UPLOAD SUCCESS", response.data);
    return response.data;
  } catch (error: any) {
    console.log("UPLOAD ERROR", error?.message);
    throw error;
  }
}
