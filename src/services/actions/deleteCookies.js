'use server';

import { cookies } from 'next/headers';

export const deleteCookies = (keys) => {
   keys.forEach((key) => {
      cookies().delete(key);
   });
};
