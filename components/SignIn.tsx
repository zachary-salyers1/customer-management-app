import { useState } from 'react';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';

export function SignIn() {
  const [error, setError] = useState<string | null>(null);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      setError('Failed to sign in');
      console.error(error);
    }
  };

  return (
    <div>
      <Button onClick={signInWithGoogle}>Sign in with Google</Button>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}