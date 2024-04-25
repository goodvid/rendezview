import React from "react";
import axios from "axios";
import { Stack } from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MainNavbar from "../../components/MainNavbar/MainNavbar";
import Event from "../../components/Event/Event";
import Blog from "../../components/Blog/Blog";
import { Button } from "@mui/material";
//import { withAuth } from "../withAuth";

function BlogList() {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    getBlogs();
  }, []);

  const getBlogs = () => {
    axios
      .get("http://localhost:5000/blogs/get_user_blogs", {
        headers: {
          Authorization: "Bearer " + sessionStorage.getItem("token"),
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        console.log("response:", res);
        console.log("blog:", res.data["blogs"]);
        setBlogs(res.data["blogs"]);
      });
  };

  const createBlogClick = () => {
    navigate("/newblog");
  };

  return (
    <div className="w-full h-full p-10">
      <div className="text-left text-3xl font-bold my-5">My Blogs</div>
      <div className="text-left">
        <Stack
          direction="row"
          gap={2}
          sx={{ width: "max-content", height: "100%", marginBlock: "2rem" }}
        >
          {blogs.length > 0 ? (
            blogs.map((blog) => (
              <Blog
                key={blog.blogID}
                blogID={blog.blogID}
                title={blog.title}
                text={blog.text}
                authorID={blog.authorID}
                authorName={blog.authorName}
                date={blog.date}
                visibility={blog.visibility}
                pictures={blog.pictures}
              />
            ))
          ) : (
            <h3>No blogs</h3>
          )}
        </Stack>
        <Button
          variant="contained"
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
