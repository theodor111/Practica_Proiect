import { useState, useEffect } from 'react';
import { auth, db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';

export function useUserRole() {
  const [rol, setRol] = useState('vizitator'); 
  const [loadingRol, setLoadingRol] = useState(true);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (user) => {
      if (user) {
        // Caută în baza de date dosarul acestui utilizator
        const snap = await getDoc(doc(db, 'users', user.uid));
        if (snap.exists()) {
          setRol(snap.data().rol || 'vizitator');
        } else {
          setRol('vizitator');
        }
      } else {
        setRol('vizitator'); // Dacă nu e logat deloc, e vizitator
      }
      setLoadingRol(false);
    });
    return () => unsub();
  }, []);

  return { rol, loadingRol };
}