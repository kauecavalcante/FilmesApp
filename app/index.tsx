import { useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../src/services/firebaseConfig';
import Splash from './_splash'; 

export default function Index() {
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      
      const inAuthGroup = segments[0] === '(auth)'; 
      const inAppGroup = segments[0] === '(tabs)';

      if (user) {
       
        if (!inAppGroup) {
          router.replace('/(tabs)/home');
        }
      } else {
        
        router.replace('/onboarding');
      }
    });

   
    return () => unsubscribe();
  }, [router]); 

  
  return <Splash />;
}