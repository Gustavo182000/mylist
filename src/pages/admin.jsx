import './admin.css'
import { BsTrash, BsPen } from "react-icons/bs";
import { useEffect, useState } from 'react';
import { signOut } from "firebase/auth";
import { auth, db } from '../firebaseConnection'
import { addDoc, collection, onSnapshot, orderBy, query, updateDoc, where , doc, deleteDoc} from 'firebase/firestore';
import Swal from 'sweetalert2'


function Admin() {
    const [tarefa, setTarefa] = useState("");
    const [UserDetail, setUserDetail] = useState({});
    const [userTarefas, setUserTarefas] = useState([])
    const [idTarefa, setIdTarefa] = useState("");

    

    useEffect(() => {

        getUid();

    }, [])

    function getUid() {

        
        const UserDetails = localStorage.getItem("UserDetail");
        setUserDetail(JSON.parse(UserDetails))
        if (UserDetails) {
            const data = JSON.parse(UserDetails);
            const q = query(collection(db, 'tarefas'), orderBy("created", "desc"), where("userId", "==", data?.uid))

            const unsub = onSnapshot(q, (snapshot) => {
                let lista = []

                snapshot.forEach((item) => {
                    lista.push({
                        id: item.id,
                        tarefa: item.data().tarefa,
                        userId: item.data().uid,
                    })
                })

                setUserTarefas(lista);

            })

        }
    }

    async function handleRegistrarTarefa() {
        if (tarefa === '') {
            console.log("tarefa vazia");
            Swal.fire(
                'O campo tarefa não pode estar vazio !',
                '',
                'error'
              )
            return;
        }
        await addDoc(collection(db, "tarefas"), {
            tarefa: tarefa,
            created: new Date(),
            userId: UserDetail.uid
        }).then(() => {
            console.log('Salvo com sucesso')
            Swal.fire(
                'Tarefa salva com sucesso !',
                '',
                'success'
              )
        }).catch((err) => {
            console.log(err);
        })


        setTarefa("");
        console.log(`Tarefa ${tarefa}`);

    }

    async function logoult() {
        signOut(auth).then(() => {
            console.log('Sucesso ao sair')
        }).catch((err) => {
            console.log(err)
        })
    }

    function editar(item) {

        setIdTarefa(item.id)
        setTarefa(item.tarefa)

    }

    async function atualizarTarefa(){
        if (tarefa === '') {
            console.log("tarefa vazia");
            Swal.fire(
                'O campo tarefa não pode estar vazio !',
                '',
                'error'
              )
            return;
        }
        await updateDoc(doc(db,"tarefas",idTarefa),{
            tarefa: tarefa
        }).then(()=>{
            console.log("Atualizado")
            Swal.fire(
                'Tarefa atualizada com sucesso !',
                '',
                'success'
              )
            setIdTarefa("")
            setTarefa("")
        }).catch((err)=>{
            Swal.fire(
                'Falha ao atualizar tarefa !',
                '',
                'error'
              )
        })

    }
    function cancelar(){
        setIdTarefa("")
        setTarefa("")
    }

   async function excluir(item){
        await deleteDoc(doc(db,"tarefas",item.id)).then(()=>{
            console.log("Tarefa excluida")
            Swal.fire(
                'Tarefa excluida com sucesso !',
                '',
                'success'
              )
            
        }).catch((err)=>{
            Swal.fire(
                'Falha ao excluir tarefa !',
                '',
                'error'
              )
            console.log(err)
        })
    }

    return (
        <div>
            <div className='d-flex justify-content-end'>
                <button className='btn btn-outline-primary' onClick={logoult}>Sair</button>
            </div>
            <div className="container">
                <div className="row justify-content-center">

                    <div className="col align-self-center">
                        <h1>Minhas Tarefas</h1>
                    </div>
                </div>
                <div className='row'>
                    <div className='col'>
                        <textarea className='form-control' name="" id="" cols="60" rows="5" value={tarefa} onChange={(e) => setTarefa(e.target.value)}></textarea>
                    </div>
                </div>

                {idTarefa ? (
                    <div className='row reg'>
                        <div className='col'>
                            <button className='btn btn-primary' onClick={atualizarTarefa}>Atualizar tarefa</button>
                            <button className='btn btn-danger' onClick={cancelar}>Cancelar</button>

                        </div>
                    </div>
                ) : (
                    <div className='row reg'>
                        <div className='col'>
                            <button className='btn btn-primary' onClick={handleRegistrarTarefa}>Registrar tarefa</button>
                        </div>
                    </div>
                )}


            
                <div className='row'>
                    <div className='col'>
                        <table className="table">
                            <tbody>
                                {userTarefas.map((item) => (
                                    <tr key={item.id}>
                                        <td>{item.tarefa}</td>
                                        <td><button className='btn' onClick={() => editar(item)}><BsPen color='green' /></button><button className='btn'  onClick={() => excluir(item)}><BsTrash color='red' /></button></td>
                                    </tr>
                                ))
                                }

                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Admin;