import { createContext, useContext, useEffect, useState } from 'react'
import {
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    signInWithPopup,
} from 'firebase/auth'
import { auth, googleProvider } from '../config/firebase'
import { useRouter } from 'next/router';

const AuthContext = createContext<any>({})

export const useAuth = () => useContext(AuthContext)

export const AuthContextProvider = ({
    children,
}: {
    children: React.ReactNode
}) => {
    const [user, setUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    // console.log(user)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser({
                    uid: user.uid,
                    email: user.email,
                    displayName: user.displayName,
                })
            } else {
                setUser(null)
            }
            setLoading(false)
        })

        return () => unsubscribe()
    }, [])

    // const signInWithGoogle = async () => {
    //     const router = useRouter(); // Use the useRouter hook.

    //     try {
    //         await signInWithPopup(auth, googleProvider);
    //         router.push('/all-templates'); // Redirect to /all-templates after successful sign-in.
    //     } catch (error) {
    //         console.error("Error signing in with Google:", error);
    //         // Handle the error accordingly.
    //     }
    // }

    const signup = (email: string, password: string) => {
        return createUserWithEmailAndPassword(auth, email, password)
    }

    const login = (email: string, password: string) => {
        return signInWithEmailAndPassword(auth, email, password)
    }

    const logout = async () => {
        setUser(null)
        await signOut(auth)
    }

    return (
        <AuthContext.Provider value={{ user, login, signup, logout }}>
            {loading ? null : children}
        </AuthContext.Provider>
    )
}
