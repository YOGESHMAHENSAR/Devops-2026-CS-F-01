import {GoogleLogin} from '@react-oauth/google';
import { googleLogin } from '../api/auth';

export default function GoogleAuthButton({role, onAuthSuccess, onError}) {
  async function handleGoogleSuccess(credentialResponse) {
      const {ok, body} = await googleLogin({
        credential: credentialResponse.credential,
        role,
      });
      // console.log("credentials of google btn & body : ", credentialResponse, body);
      if(!ok){
        onError(body.message || "Google sing-in Falied!");
        return;
      }

      localStorage.setItem('token', body.token);
      localStorage.setItem('user', JSON.stringify(body.user));
      onAuthSuccess(body.user);
  }
  return (
    <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => onError('Google sign-in was cancelled or failed')} />
  );
}
