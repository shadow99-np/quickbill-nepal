import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User as FirebaseUser
} from 'firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  arrayUnion,
  collection,
  addDoc
} from 'firebase/firestore';
import { auth, db, isFirebaseConfigured } from './firebase';
import { UserAccount } from './db';
import { ClientProfile, InvoiceData } from '@/types/invoice';

export async function firebaseSignUpUser(formData: {
  email: string;
  password: string;
  businessName: string;
  pan?: string;
  phone?: string;
  address?: string;
}): Promise<{ success: boolean; user?: UserAccount; token?: string; error?: string }> {
  if (!isFirebaseConfigured || !auth || !db) {
    return { success: false, error: 'Firebase is not yet configured with valid API keys.' };
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
    const fbUser = userCredential.user;
    const token = await fbUser.getIdToken();

    const username = formData.email.split('@')[0].toLowerCase().replace(/[^a-z0-9_]/g, '');
    const now = new Date().toISOString();

    const newAccount: UserAccount = {
      id: fbUser.uid,
      email: formData.email,
      username,
      passwordHash: 'FIREBASE_AUTH_MANAGED',
      businessName: formData.businessName || username,
      pan: formData.pan || '',
      phone: formData.phone || '',
      address: formData.address || '',
      clients: [],
      role: 'user',
      isPro: false,
      createdAt: now,
      updatedAt: now,
    };

    // Save profile to Firestore collection 'users'
    await setDoc(doc(db, 'users', fbUser.uid), newAccount);

    return {
      success: true,
      user: newAccount,
      token,
    };
  } catch (err: any) {
    let msg = 'Failed to create account with Firebase.';
    if (err.code === 'auth/email-already-in-use') msg = 'This email is already registered.';
    else if (err.code === 'auth/weak-password') msg = 'Password must be at least 6 characters.';
    else if (err.code === 'auth/invalid-email') msg = 'Please enter a valid email address.';
    return { success: false, error: msg };
  }
}

export async function firebaseSignInUser(
  email: string,
  pass: string
): Promise<{ success: boolean; user?: UserAccount; token?: string; error?: string }> {
  if (!isFirebaseConfigured || !auth || !db) {
    return { success: false, error: 'Firebase is not configured.' };
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, pass);
    const fbUser = userCredential.user;
    const token = await fbUser.getIdToken();

    // Fetch user profile from Firestore
    const userDocRef = doc(db, 'users', fbUser.uid);
    const userDoc = await getDoc(userDocRef);

    let userAccount: UserAccount;
    if (userDoc.exists()) {
      userAccount = userDoc.data() as UserAccount;
    } else {
      const username = email.split('@')[0];
      const now = new Date().toISOString();
      userAccount = {
        id: fbUser.uid,
        email,
        username,
        passwordHash: 'FIREBASE_AUTH_MANAGED',
        businessName: username,
        pan: '',
        phone: '',
        address: '',
        clients: [],
        role: 'user',
        isPro: false,
        createdAt: now,
        updatedAt: now,
      };
      await setDoc(userDocRef, userAccount);
    }

    return { success: true, user: userAccount, token };
  } catch (err: any) {
    let msg = 'Invalid email or password.';
    if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
      msg = 'Invalid email or password.';
    }
    return { success: false, error: msg };
  }
}

export async function firebaseSaveClient(
  uid: string,
  client: ClientProfile
): Promise<boolean> {
  if (!isFirebaseConfigured || !db) return false;
  try {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, {
      clients: arrayUnion(client),
      updatedAt: new Date().toISOString(),
    });
    return true;
  } catch (err) {
    return false;
  }
}

export async function firebaseUpdateProfile(
  uid: string,
  updates: Partial<UserAccount>
): Promise<boolean> {
  if (!isFirebaseConfigured || !db) return false;
  try {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
    return true;
  } catch (err) {
    return false;
  }
}

export async function firebaseSaveInvoice(
  uid: string,
  invoice: InvoiceData
): Promise<boolean> {
  if (!isFirebaseConfigured || !db) return false;
  try {
    await setDoc(doc(db, 'users', uid, 'invoices', invoice.id), {
      ...invoice,
      updatedAt: new Date().toISOString(),
    });
    return true;
  } catch (err) {
    return false;
  }
}
