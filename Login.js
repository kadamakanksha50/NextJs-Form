"use client";
import toast, { Toaster } from 'react-hot-toast';
import styles from './Login.module.css';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
export default function Login(){
    const [isSignin,setSignin]=useState(true)
    const [isSignup, setSignup]=useState(false)

    const [username,setUser]=useState('')
    const [password,setPass]=useState('')

    const router = useRouter()

    const [formData,setFormData]=useState({
        fullname:'',
        email:'',
        npass:'',
        cpass:''
    })
    const handleChange=(e)=>{
        const {name,value}=e.target
        setFormData({
            ...formData,
            [name]:value,
        })
    }

    const inClick=()=>{
        setSignin(true)
        setSignup(false)
        setUser('')
        setPass('')
    }
    const upClick=()=>{
        setSignin(false)
        setSignup(true)
        setFormData({
            fullname:'',
            email:'',
            npass:'',
            cpass:''
        })
    }
    const onSignIn=async(e)=>{
        e.preventDefault()
        const res = await fetch('http://localhost:8000/api/validateSignIn',{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                username:username,
                password:password
            })
        })
        const data = await res.json()
        console.log(data)
        if(data.status){
            toast.success(data.message)
            setTimeout(()=>{
                localStorage.setItem('token',username)
                router.push('/dashboard')
            },2500)
        }
        else{
            toast.error(data.message)
            if(data.message=='Invalid credentials'){
                setPass('')
            }
            else{
                setUser('')
                setPass('')
            }
        }
    }
    const onSignUp=async(e)=>{
        e.preventDefault()
        if(formData.npass!=formData.cpass){
            toast.error("Password doesn't match !!")
            setFormData({
                npass:'',
                cpass:''
            })
            return
        }
        const res = await fetch('http://localhost:8000/api/signup',{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify(formData)
        })
        const data = await res.json()
        if(data.status){
            toast.success(data.message)
        }
        else{
            toast.error(data.message)
            setFormData({
                fullname:'',
                email:'',
                npass:'',
                cpass:''
            })
        }
    }
    return(
        <>
        <div>
            <Toaster
                position="top-center"
                reverseOrder={false}
            />
        </div>
        <div className={styles.container}>
            <div className={isSignin ?styles.login:styles.signup}>
                 <div className={styles.title}>
                    <h2 className={isSignin ? styles.active:''} onClick={inClick}>Sign In</h2>
                    <h2 className={isSignup ? styles.active:''} onClick={upClick}>Sign Up</h2>
                 </div>
                 {
                    isSignin &&
                    <form onSubmit={onSignIn}>
                        <div className={styles.input_field}>
                            <label>Username<span>*</span></label>
                            <input type='email' value={username} onChange={(e)=>setUser(e.target.value)}></input>
                        </div>
                        <div className={styles.input_field}>
                            <label>Password<span>*</span></label>
                            <input type='password' value={password} onChange={(e)=>setPass(e.target.value)}></input>
                        </div>
                        <input type='submit' value='Sign In'></input>
                    </form>
                 }
                 {
                    isSignup &&
                    <form onSubmit={onSignUp}>
                        <div className={styles.input_field}>
                            <label>FullName<span>*</span></label>
                            <input type='text' name='fullname' value={formData.fullname} onChange={handleChange}></input>
                        </div>
                        <div className={styles.input_field}>
                            <label>Email Address<span>*</span></label>
                            <input type='email' name='email' value={formData.email} onChange={handleChange}></input>
                        </div>
                        <div className={styles.input_field}>
                            <label>New Password<span>*</span></label>
                            <input type='password' name='npass' value={formData.npass} onChange={handleChange}></input>
                        </div>
                        <div className={styles.input_field}>
                            <label>Confirm Password<span>*</span></label>
                            <input type='password' name='cpass' value={formData.cpass} onChange={handleChange}></input>
                        </div>
                        <input type='submit' value='Sign Up'></input>
                    </form>
                 }
            </div>
        </div>
        </>
    );
}