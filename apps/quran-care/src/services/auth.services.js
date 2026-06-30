

import {
   getFromLocalStorage,
   removeFromLocalStorage,
   setToLocalStorage,
} from '@/utils/local-storage';

let authKey = 'user';


export const storeUserInfo = ({ accessToken }) => {
  
   return setToLocalStorage(authKey, accessToken);
};

export const getUserInfo = () => {
  const authData = getFromLocalStorage("user");
  const token = getFromLocalStorage("token");


  if (!authData) return null;
  if (!token) return null;

  try {
    const parsed = JSON.parse(authData);

    return {
      ...parsed,
      role: parsed.role,
      token: token,


    };

    
  } catch (error) {
    console.error("Failed to decode user info:", error);
    return null;
  }
};







export const isLoggedIn = () => {
  const authToken = getFromLocalStorage("user");
  if (!authToken) return false;

  try {
    const parsed = JSON.parse(authToken);
    return !!parsed.token;
  } catch (err) {
    console.error("Invalid JSON in localStorage for 'user'", err);
    return false;
  }
};

export const removeUser = () => {
   return removeFromLocalStorage(authKey);
};
