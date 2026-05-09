import { useState, useEffect } from 'react';
import { auth, db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';

export function useUserRole() {
  const [rol, setRol] = useState('vizitator'); // default vizitator
  const [loadingRol, setLoadingRol] = useState(true);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const snap = await getDoc(doc(db, 'users', user.uid));
        if (snap.exists()) {
          setRol(snap.data().rol || 'vizitator');
        }
      } else {
        setRol('vizitator');
      }
      setLoadingRol(false);
    });
    return () => unsub();
  }, []);

  return { rol, loadingRol };
}