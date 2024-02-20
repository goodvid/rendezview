import React, { useState, useEffect } from 'react';
import MainNavbar from '../components/MainNavbar/MainNavbar';
import Event from '../components/Event/Event';
import axios from 'axios';

function Main() {

    const [events, setEvents] = useState([]);

    useEffect(() => {
        console.log("hi");
        axios.get("http://localhost:5000/events")
            .then(res => {
                console.log(res.data['status']);
                setEvents(res.data['events']);
            })
            .catch(err => {
                console.log(err)
            });
    }, []);

    return (
        <div className='w-full h-full'>
            <MainNavbar />
            <div className='w-full h-[360px] bg-light-blue flex justify-center items-center'><span className='font-medium text-3xl'>Featured Event + Details</span></div>
            <div className='w-full h-[533px] flex flex-col'>
                <span className='text-xl'>Categories</span>
                <div className='w-full flex flex-row'>
                    <div className='bg-light-gray w-[150px] h-[100px]'> Category</div>
                    <div className='bg-light-gray w-[150px] h-[100px]'> Category</div>
                    <div className='bg-light-gray w-[150px] h-[100px]'> Category</div>
                    <div className='bg-light-gray w-[150px] h-[100px]'> Category</div>
                    <div className='bg-light-gray w-[150px] h-[100px]'> Category</div>
                    <div className='bg-light-gray w-[150px] h-[100px]'> Category</div>
                    <div className='bg-light-gray w-[150px] h-[100px]'> Category</div>
                    <div className='bg-light-gray w-[150px] h-[100px]'> Category</div>
                    <div className='bg-light-gray w-[150px] h-[100px]'> Category</div>
                    <div className='bg-light-gray w-[150px] h-[100px]'> Category</div>
                    <div className='bg-light-gray w-[150px] h-[100px]'> Category</div>
                    <div className='bg-light-gray w-[150px] h-[100px]'> Category</div>
                    <div className='bg-light-gray w-[150px] h-[100px]'> Category</div>
                </div>
                <div className='flex flex-row flex-wrap gap-5 pl-10 pt-10'>
                    {events.map((event, i) => {
                        return (
                            <Event
                                name={event.name}
                                date={event.time}
                                location={event.location}
                                key={i} />
                        );
                    })}
                </div>
            </div>
        </div>
    )
};

export default Main;