import React from 'react';
import './Event.css';

function Event() {
    return (
        <div className='w-[400px] h-[200px] rounded-lg outline'>
            <div className='w-[100%] h-[100%] flex flex-row justify-center items-center gap-5'>
                <div className=' w-[180px] h-[180px] bg-light-gray'>Image</div>
                <div className='w-[180px] h-[180px] flex flex-col'>
                    <span className='text-left font-bold'>Event Name</span>
                    <span className='text-left'>Tags</span>
                    <span className='text-left'>Description</span>
                </div>
            </div>
        </div>
    )
};

export default Event;