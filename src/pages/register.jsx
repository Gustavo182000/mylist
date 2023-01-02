import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from '../firebaseConnection'
import Swal from 'sweetalert2'


function Register() {

    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const navigate = useNavigate();

    async function handleRegistrar(e) {
        e.preventDefault();

        console.log(`Email: ${email} Senha: ${senha}`);

        await createUserWithEmailAndPassword(auth, email, senha).then((value) => {
            navigate('/admin', { replace: true })
        }).catch((err) => {
            console.log(err.code)

            if (err.code === 'auth/invalid-email') {
                Swal.fire("E-mail invalido !", '', 'error')
            }
            if (err.code === 'auth/internal-error') {
                Swal.fire("Erro Interno, verifique os dados e tente novamente !", '', 'error')
            }
            if (err.code === 'auth/weak-password') {
                Swal.fire("Senha muito fraca !", '', 'error')
            }
            if (err.code === 'auth/email-already-in-use') {
                Swal.fire("Esse e-mail já está em uso !", '', 'error')
            }


        })

    }

    return (
        <section className="vh-100">
            <div className="container py-5 h-100">
                <div className="row d-flex align-items-center justify-content-center h-100">
                    <div className="col-md-8 col-lg-7 col-xl-6">
                        <img src="https://img.freepik.com/premium-vector/user-verification-unauthorized-access-prevention-private-account-authentication-cyber-security_566886-2817.jpg"
                            className="img-fluid w-5" alt="Phone image" />
                    </div>
                    <div className="col-md-7 col-lg-5 col-xl-5 offset-xl-1">

                        <form>
                            <div className="form-outline mb-4">
                                <input value={email} type="email" id="email" className="form-control form-control-lg" placeholder="E-mail" onChange={(e) => setEmail(e.target.value)} />
                            </div>
                            <div className="form-outline mb-4">
                                <input value={senha} type="password" id="password" className="form-control form-control-lg" placeholder="Senha" onChange={(e) => setSenha(e.target.value)} />
                            </div>
                            <button type="submit" className="btn btn-primary btn-lg btn-block" onClick={handleRegistrar}>Registrar</button>
                            <hr />
                            <p className="small text-muted">Já possue uma conta ? <Link to="/">Entrar</Link> </p>

                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}


export default Register;