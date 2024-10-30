import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { useAuth } from './authcontext'

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { user } = useAuth()
    const router = useRouter()

    useEffect(() => {
        // console.log("User: ", user);
        if (!user) {
            console.log("Redirecting to sign-in");
            router.push('/auth/sign-in')
        }
    }, [router, user])

    return <>{user ? children : null}</>
}

export default ProtectedRoute