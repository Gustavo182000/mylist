import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { auth } from '../firebaseConnection'

function Private({ children }) {

    const [loading, setLoading] = useState(true);
    const [logado, setLogado] = useState(false);

    async function ckeckLogin() {
        const unsub = onAuthStateChanged(auth, (user) => {

            if (user) {
                const userDetail = {
                    email: user.email,
                    uid: user.uid
                }
                localStorage.setItem("UserDetail", JSON.stringify(userDetail));
                setLoading(false);
                setLogado(true)
            } else {
                setLoading(false);
                setLogado(false);
            }

        })
    }

    useEffect(() => {
        ckeckLogin();
    }, [])

    if (loading) {
        return (
            <div className="d-flex justify-content-center">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        )
    }

    if (!logado) {
        return <Navigate to='/' />
    }

    return children
}


export default Private;