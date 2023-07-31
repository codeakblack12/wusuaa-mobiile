import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
export const WUSUAA_API = "https://coral-app-r6lzx.ondigitalocean.app/";

export const doPost = async (url: string, payload: any) => {
  try {
      const response = await axios.post(WUSUAA_API + url, payload, {
        headers: {
          'Authorization': "None",
          Accept: "Application/json",
          'Content-Type': "Application/json",
          "Charset": "UTF-8"
        },
      });
      // console.log(response)
      return response.data
  } catch (error) {
    console.log(error)
  }
};

export const getRequest = async (url: string) => {

    const token = await AsyncStorage.getItem("USER_TOKEN");

    const authorize = token ? `Bearer ${token}` : 'None'

    const response = await axios.get(WUSUAA_API + url, {
        headers: {
          authorization: authorize,
          'Content-Type': 'application/json',
          "Charset": "UTF-8"
        },
        timeout: 15000
    })
    return response.data
}

export const sendPost = async ( url: string, payload: any ) => {

    const token: any = await AsyncStorage.getItem("USER_TOKEN");

    var response = await axios.post(WUSUAA_API + url, payload, {
        headers: {
          authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          "Charset": "UTF-8"
        },
    });

    return response
};

export const sendDelete = async ( url: string, payload: any ) => {

  const token: any = await AsyncStorage.getItem("USER_TOKEN");

  var response = await axios.delete(WUSUAA_API + url, {
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        "Charset": "UTF-8"
      },
  });

  return response
};

export default {doPost, getRequest, sendPost}