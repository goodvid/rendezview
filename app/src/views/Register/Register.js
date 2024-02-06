import React from 'react';
import './Register.css'
import Navbar from '../../components/Navbar/Navbar';
import { Link } from 'react-router-dom';

function Register() {
    return (
        <div className='w-full h-full'>
            <Navbar />
            <div className='w-[100%] h-[100%] flex flex-col justify-center items-center'>
                <span className='text-3xl font-bold mt-[7%]'>Create a RendezView Account</span>
                <div className='w-[40%] h-[70%] flex flex-col justify-center items-center gap-1'>
                    <div className='flex flex-row justify-center items-center gap-[220px]'>
                        <div className='flex flex-col justify-center items-center gap-1'>
                            <span className='w-[360px] text-gray-500 text-left mt-[40px]'>Email</span>
                            <input className='w-[360px] h-[45px] border-login-blue outline rounded-md pl-2' />
                            <span className='w-[360px] text-gray-500 text-left mt-[20px]'>Password</span>
                            <input className='w-[360px] h-[45px] border-login-blue outline rounded-md pl-2' />
                        </div>
                        <div className='mt-8 w-[300px]'>
                            <span>Choose Profile Picture</span>
                            <button className='w-[150px] h-[150px] rounded-full outline mt-4' />
                        </div>
                    </div>
                    <span className='w-[360px] text-gray-500 text-left mt-[10px] mr-[525px]'>Select Preferences</span>
                    <div className='w-[680px] flex flex-row justify-center items-center mt-1 gap-[50px] mr-[210px]'>
                        <button
                        href='/preference_quiz'
                        className='w-[360px] h-[45px] bg-login-blue text-white font-bold rounded-lg'>Take Preference Quiz</button>
                        <span className='text-gray-500'>OR</span>
                        <span className='text-gray-500 font-bold'>Manually Add Preferences</span>
                    </div>
                    <button
                    href='/login'
                    className='w-[260px] h-[45px] bg-login-blue text-white font-medium rounded-lg mt-[80px]'>Create Account</button>
                    <span className='font-normal text-gray-500 mt-4'>Already have an account?</span>
                    <Link
                    id="log-in"
                    to='/login'
                    className='text-login-blue font-bold'>Log In</Link>
                </div>
            </div>
        </div>
    )
};

export default Register;