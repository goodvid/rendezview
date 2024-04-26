import React from "react";
import axios from "axios";
import { Stack } from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MainNavbar from "../../components/MainNavbar/MainNavbar";
import Blog from "../../components/Blog/Blog";
import { Button } from '@mui/material';
//import { withAuth } from "../withAuth";

function BlogList() {
    const navigate = useNavigate();

    const [blogs, setBlogs] = useState([]);
    const [publicBlogs, setPublicBlogs] = useState([]);

  const createBlogClick = () => {
    navigate("/newblog");
  };

    useEffect(() => {
        console.log(sessionStorage.getItem("token"));
        axios
          .get("http://localhost:5000/blog/user_blogs", {
            headers: {
              Authorization: "Bearer " + sessionStorage.getItem("token"),
              "Content-Type": "application/json",
            },
          })
          .then((res) => {
            setBlogs(res.data["blogs"]);
          });
    
        axios
          .get("http://localhost:5000/blog/public_blogs", {
            headers: {
              Authorization: "Bearer " + sessionStorage.getItem("token"),
              "Content-Type": "application/json",
            },
          })
          .then((res) => {
            console.log(res);
            if (res.status == 200) {
              setPublicBlogs(res.data["blogs"]);
            }
          });
      }, []);

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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {blogs.map((blog, i) => {
                return (
                    <Blog
                    id={blog.id}
                    name={blog.title}
                    date={blog.date}
                    author={blog.author}
                    desc={blog.content}
                    key={i}
                    />
                );
                })}
            </div>
            <div className="text-left text-3xl font-bold my-5">Public Blogs</div>
            <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {publicBlogs.map((blog, i) => {
                return (
                    <Blog
                    id={blog.id}
                    name={blog.title}
                    date={blog.date}
                    author={blog.author}
                    desc={blog.content}
                    key={i}
                    />
                );
                })}
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
