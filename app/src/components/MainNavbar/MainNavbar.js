import React from 'react';
import './MainNavbar.css';
import { Link } from 'react-router-dom';
import { IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Settings from '@mui/icons-material/Settings';

function MainNavbar() {

    const logout = () => {
        sessionStorage.removeItem("token");
        console.log('removed');
        window.location.reload();
        navigate("/");
    }

    const navigate = useNavigate();
    const settingsClick = () => {
        navigate("/settings");
    };

    return (
        <div className='w-[100%] h-[60px] flex flex-row justify-center items-center gap-10 bg-navbar-blue'>
            <input type='text' placeholder='Search' className='w-[200px] h-[30px] pl-2 mr-10' />
            <Link to='/home' className='text-white'>Home</Link>
            <Link to='/events' className='text-white'>Events</Link>
            <Link to='/blogs' className='text-white'>Blogs</Link>

            {sessionStorage.getItem("token") ?
                <div className='w-[150px] ml-[500px]'>
                    <IconButton onClick={settingsClick}><Settings sx={{color: "white"}}></Settings></IconButton>
                    <button onClick={logout} className='text-white'>
                        Logout
                    </button>
                </div>
                :
                <div className='w-[150px] flex flex-row gap-2 ml-[500px]'>
                    <Link to='/login' className='text-white'>Sign In</Link>
                    <div className='text-white'>|</div>
                    <Link to='/register' className='text-white'>Register</Link>
                </div>
            }
        </div>
    )
};

export default MainNavbar;