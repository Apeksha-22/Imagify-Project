import React, { useContext, useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext';
import { motion } from 'motion/react';
import axios from 'axios'
import { toast } from 'react-toastify';

const Login = () => {

    const [state, setState] = useState('Login');
    const {setShowLogin, backendUrl, setToken, setUser} = useContext(AppContext)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const onSubmitHandler = async (e) =>{
      e.preventDefault();

      try {
        if(state === 'Login'){
          const {data} = await axios.post(backendUrl + '/api/user/login', {email,password});

          if(data.success){
            setToken(data.token)
            setUser(data.user)
            localStorage.setItem('token', data.token)
            setShowLogin(false)
          }else{
            toast.error(data.message);
          }
        }else{
          const {data} = await axios.post(backendUrl + '/api/user/register', {name,email,password});

          if(data.success){
            setToken(data.token)
            setUser(data.user)
            localStorage.setItem('token', data.token)
            setShowLogin(false)
          }else{
            toast.error(data.message);
          }
        }
      } catch (error) {
        toast.error(error.message);
      }
    }
    //it's apply for scrolling stop when login form is opened
    useEffect(()=>{
        document.body.style.overflow = 'hidden'

        return()=>{
            document.body.style.overflow = 'unset'
        }
    },[])

  return (
    <div className='fixed flex top-0 right-0 left-0 bottom-0 backdrop-blur-sm z-10 bg-black/30 justify-center items-center'>
      <motion.form onSubmit={onSubmitHandler}
            initial={{ opacity: 0.2, y: 50 }}
            transition={{ duration: 0.3}}
            whileHover={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
      className='relative bg-white rounded-xl p-10 text-slate-500'>
        <h1 className='text-center text-3xl text-neutral-700 font-medium'>{state}</h1>
        <p className='text-sm mt-3'>Welcome back! Please sign in to continue</p>


        {state !== 'Login' && 
            <div className='flex border px-8 py-2 mt-5 rounded-full items-center gap-2'>
                <img width={22} src={assets.user_icon} alt="icon" />
            <input onChange={e =>setName(e.target.value)} value={name} className='outline-none text-sm' type="text" placeholder='Full Name' required/>
            </div>
        }

        <div className='flex border px-8 py-2 mt-4 rounded-full items-center gap-2'>
            <img src={assets.email_icon} alt="icon" />
        <input onChange={e =>setEmail(e.target.value)} value={email} className='outline-none text-sm' type="email" placeholder='Email id' required/>
        </div>

        <div className='flex border px-8 py-2 mt-4 rounded-full items-center gap-2'>
            <img src={assets.lock_icon} alt="icon" />
        <input onChange={e =>setPassword(e.target.value)} value={password} className='outline-none text-sm' type="password" placeholder='Password' required/>
        </div>
        
        <p className='my-4 text-sm cursor-pointer text-blue-600 '>Forgot password?</p>
        <button className='bg-blue-600 text-white py-2 w-full rounded-full'>{state =='Login'? 'Login':'Create account'}</button>
        {
            state =='Login'?
            <p className='text-center mt-5'>Don't have an account? <span className='text-blue-600 cursor-pointer' onClick={()=>setState('Sign up')}>Sign Up</span> </p>
            :
            <p className='text-center mt-5'>Already have an account <span className='text-blue-600 cursor-pointer' onClick={()=>setState('Login')}>Sign In</span> </p>
        }
        
        

        <img src={assets.cross_icon} onClick={()=>setShowLogin(false)} className='absolute top-5 right-5 cursor-pointer' alt="" />
      </motion.form>
    </div>
  )
}

export default Login
