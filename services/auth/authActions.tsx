import { auth } from "../../utils/firebase";
import {
  UserCredential,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  GoogleAuthProvider,
} from "firebase/auth";

export const authActions = {
  async signUp(
    email: string,
    password: string,
    displayName: string
  ): Promise<UserCredential> {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    await updateProfile(userCredential.user, {
      displayName,
      photoURL: "/images/gsdp.png",
    });
    return userCredential;
  },

  async signIn(email: string, password: string): Promise<UserCredential> {
    return signInWithEmailAndPassword(auth, email, password);
  },

  async googleSignIn(): Promise<UserCredential> {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  },

  async logOut(): Promise<void> {
    return signOut(auth);
  },
};