import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MainNavbar from "../../components/MainNavbar/MainNavbar";
import Event from "../../components/Event/Event";
import { Button } from '@mui/material';
//import { withAuth } from "../withAuth";

function BlogList() {
    const navigate = useNavigate();

    const createBlogClick = () => {
        navigate("/newblog");
    };

    return (
        <div className="w-full h-full p-10">
            <div className="text-left text-3xl font-bold my-5">My Blogs</div>
            <div className="text-left">
                <Button variant="contained"
                    size="large"
                    sx={{
                        textTransform: "none",
                        fontWeight: "bold",
                        backgroundColor: "#D1EEFF",
                        color: "black",
                        "&:hover": { backgroundColor: "#8bd4ff", color: "black" },
                    }}
                    onClick={createBlogClick}
                >
                    + New Blog
                </Button>
            </div>
        </div>
    );
}

function Blogs() {
    const navigate = useNavigate();

    useEffect(() => {
        if (!sessionStorage.getItem("token")) {
            navigate("/login");
        }
    }, []);

    return (
        <div className="w-full h-full">
            <MainNavbar />
            {sessionStorage.getItem("token") ? <BlogList /> : <div />}
        </div>
    );
}

export default Blogs;
