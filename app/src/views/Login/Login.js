import React from 'react';
import './Login.css'
import Navbar from '../../components/Navbar/Navbar';
import { Link } from 'react-router-dom';

function Login() {
    return (
        <div className='w-full h-full'>
            <Navbar />
            <div className='w-[100%] h-[100%] flex flex-col justify-center items-center'>
                <span className='text-3xl font-bold mt-[7%]'>Sign In</span>
                <div className='w-[40%] h-[70%] flex flex-col justify-center items-center gap-1'>
                    <span className='w-[360px] text-gray-500 text-left mt-[40px]'>Email</span>
                    <input className='w-[360px] h-[45px] border-login-blue outline rounded-md pl-2' />
                    <span className='w-[360px] text-gray-500 text-left mt-[20px]'>Password</span>
                    <input className='w-[360px] h-[45px] border-login-blue outline rounded-md pl-2' />
                    <Link
                    id="forgot-password"
                    to='/forgot_password'
                    className='text-gray-500 ml-[240px]'>Forgot Password?</Link>
                    <button
                    href='/events'
                    className='w-[360px] h-[45px] bg-login-blue text-white font-bold rounded-lg mt-[30px]'>Log In</button>
                    <span className='font-normal text-gray-500 mt-4'>Don't have an account?</span>
                    <Link
                    id="sign-up"
                    to='register'
                    className='text-login-blue font-bold'>Sign Up</Link>
                    <button
                    href='/events'
                    className='w-[260px] h-[45px] bg-black text-white font-medium rounded-full mt-[30px]'>Sign in with Google</button>
                </div>
            </div>
        </div>
    )
};

export default Login;