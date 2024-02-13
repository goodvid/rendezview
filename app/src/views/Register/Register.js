import React, { useState, useEffect } from 'react';
import './Register.css'
import Navbar from '../../components/Navbar/Navbar';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Register() {

    const [email, setEmail] = useState("");

    const updateEmail = (event) => {
        if (event != null) {
            setEmail(event.target.value);
        }
    };

    const [password, setPassword] = useState("");

    const updatePassword = (event) => {
        if (event != null) {
            setPassword(event.target.value);
        }
    };

    const register = () => {
        axios.post("http://localhost:3000/user/register", {
            email: email,
            password: password
        })
        .then(res => {
            console.log(res)
        })
        .catch(err => {
            console.log(err)
        });
        setEmail("");
        setPassword("");
    }

    return (
        <div className='w-full h-full'>
            <Navbar />
            <div className='w-[100%] h-[100%] flex flex-col justify-center items-center'>
                <span className='text-3xl font-bold mt-[7%]'>Create a RendezView Account</span>
                <div className='w-[40%] h-[70%] flex flex-col justify-center items-center gap-1'>
                    <div className='flex flex-row justify-center items-center gap-[220px]'>
                        <div className='flex flex-col justify-center items-center gap-1'>
                            <span className='w-[360px] text-gray-500 text-left mt-[40px]'>Email</span>
                            <input onChange={updateEmail} className='w-[360px] h-[45px] border-login-blue outline rounded-md pl-2' />
                            <span className='w-[360px] text-gray-500 text-left mt-[20px]'>Password</span>
                            <input onChange={updatePassword} className='w-[360px] h-[45px] border-login-blue outline rounded-md pl-2' />
                        </div>
                        <div className='mt-8 w-[300px]'>
                            <span>Choose Profile Picture</span>
                            <button className='w-[150px] h-[150px] rounded-full outline mt-4' />
                        </div>
                    </div>
                    <span className='w-[360px] text-gray-500 text-left mt-[10px] mr-[525px]'>Select Preferences</span>
                    <div className='w-[680px] flex flex-row justify-center items-center mt-1 gap-[50px] mr-[210px]'>
                        <button
                        href='/quiz'
                        className='w-[360px] h-[45px] bg-login-blue text-white font-bold rounded-lg'>Take Preference Quiz</button>
                        <span className='text-gray-500'>OR</span>
                        <span className='text-gray-500 font-bold'>Manually Add Preferences</span>
                    </div>
                    <Link
                    to='/login'>
                        <button
                        className='w-[260px] h-[45px] bg-login-blue text-white font-medium rounded-lg mt-[80px]'
                        onClick={register}>Create Account</button>
                    </Link>
                    <span className='font-normal text-gray-500 mt-4'>Already have an account?</span>
                    <Link
                    id="log-in"
                    to='/login'
                    className='text-login-blue font-bold'>Log In</Link>
                </div>
            </div>
        </div>
    );
};

export default Register;