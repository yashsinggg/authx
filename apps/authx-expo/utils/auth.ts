import axios from 'axios';

export const fetchGoogleLogin = async (idToken: string) => {
  try {
    const response = await axios.post(
      'https://api.campusx.co.in/auth/login/google',
      {},
      {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      }
    );
    console.log(`Response:`, response);
    return response;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};
