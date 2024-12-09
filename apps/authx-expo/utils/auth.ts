import axios from 'axios';

export const fetchGoogleLogin = async (idToken: string) => {
  try {
    const response = await axios.post(
      'https://api.dev.campusx.co.in/auth/login/google',
      {},
      {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      }
    );
    console.log(`Responseeee:`, response);
    return response;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};
