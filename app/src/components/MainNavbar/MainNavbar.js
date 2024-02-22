import React from 'react';
import './MainNavbar.css';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { HOST_NAME } from '../../Global';

const handleSignOut = async (navigate) => {
    axios.get("http://" + HOST_NAME + ":5000/delinkGoogle")
        .then(res => {
            if (res.data.status === 200) {
                // Navigate to another route on success
                sessionStorage.removeItem('token');
                navigate('/login');
            } else {
                // Handle non-success status here, if any
                console.log('Authentication successful but with non-success status', res.data);
            }
        })
        .catch(err => {
            console.log(err);
            // Optionally, navigate to an error page or display a message
            alert("Error Occurred: Try Again Later");
        });
    // try {
    //     axios.get('http://' + HOST_NAME + ':5000/delinkGoogle');
    //     sessionStorage.removeItem('token');
    //     navigate('/login');
    // } catch (error) {
    //     alert("Error Logging out");
    //     console.error('Logout failed', error);
    // }
};

function MainNavbar() {
    const navigate = useNavigate();
    return (
        <div className='w-[100%] h-[60px] flex flex-row justify-center items-center gap-10 bg-navbar-blue'>
            <input type='text' placeholder='Search' className='w-[200px] h-[30px] pl-2 mr-10' />
            <Link to='/home' className='text-white'>Home</Link>
            <Link to='/events' className='text-white'>Events</Link>
            <Link to='/blogs' className='text-white'>Blogs</Link>
            <div className='w-[130px] flex flex-row gap-2 ml-[500px]'>
                <Link to='/login' className='text-white'>Sign In</Link>
                <div className='text-white'>|</div>
                <Link to='/register' className='text-white'>Register</Link>
                <div className='text-white'>|</div>
                <button onClick={() => handleSignOut(navigate)} className='text-white'>Sign Out</button>
            </div>
        </div>
    )
};

export default MainNavbar;