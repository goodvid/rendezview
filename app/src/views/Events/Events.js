import React from 'react';
import axios from 'axios';
import './Events.css'
import { useState } from "react";
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import MainNavbar from '../../components/MainNavbar/MainNavbar';

function Anon() {
    return (
        <div>
            a
        </div>
    )
}

function EventList() {
    return (
        <div>
            b
        </div>
    )
}

function Events() {

    return (
        <div className="w-full h-full">
            <MainNavbar />
            {sessionStorage.getItem("token") ?
                <EventList /> : <Anon />
            }
        </div>
    );
};

export default Events;