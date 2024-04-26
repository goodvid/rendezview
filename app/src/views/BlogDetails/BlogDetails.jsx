import React from "react";
import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar/Navbar";
import testImage from "../../media/testImage.jpeg";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { pinwheel } from "ldrs";
import { Stack, Button, IconButton } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { RedButton, GrayButton } from "../../components/StyledComponents/StyledComponents";
import Edit from "@mui/icons-material/Edit";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import CloseIcon from "@mui/icons-material/Close";

function BlogDetails() {
  pinwheel.register(); // loading animation
  const [loading, setLoading] = useState(false);

  let id = useParams();
  let resp = false;

  const [blogID, setBlogID] = useState(0);
  const [blogTitle, setBlogTitle] = useState("");
  const [blogText, setBlogText] = useState("");
  const [authorID, setAuthorID] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [date, setDate] = useState("");
  const [photos, setPhotos] = useState([]);

  const [username, setUsername] = useState("");

  // Delete Blog
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const handleDeleteOpen = () => {
    setDeleteOpen(true);
  };
  const handleDeleteClose = () => {
    setDeleteOpen(false);
  };

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:5000/user/getusername", {
        headers: {
          Authorization: "Bearer " + sessionStorage.getItem("token"),
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        console.log("USERNAME: ", res.data["username"]);
        setUsername(res.data["username"]);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {  
    let pictures = "";

    setLoading(true);
    fetch("http://localhost:5000/blog/details", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + sessionStorage.getItem("token"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(id),
      })
      .then((response) => {
        resp = response;
        return response.json();
      })
      .then((data) => {
        if (resp.status === 200) {
            setLoading(false);
            setBlogID(data.id);
            setBlogTitle(data.title);
            setBlogText(data.text);
            setAuthorID(data.authorID);
            setAuthorName(data.authorName);
            setDate(data.date);
            pictures = data.pictures;
            setPhotos(pictures.split(","));
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const deleteBlogClick = () => {
    fetch("http://localhost:5000/blog/delete", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + sessionStorage.getItem("token"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(id),
      })
      .then((response) => {
        if (response.status === 401) {
          alert("unauthorized");
          return response.json();
        } else if (response.status == 200) {
          return response.json();
        }
      })
      .then((data) => {
        console.log(data);
        navigate("/blogs");
      })
      .catch((error) => {
        console.log("error", error);
      });

  };

  const editBlogClick = () => {
    navigate(`/editblog/${blogID}`);
  };

  const checkOwner = () => {   
    console.log(authorName);
    console.log(username);
    return username == authorName;
  }
  
  return (
    <div>
      <Navbar />
      {loading ? (
        <Stack width="100%" height="100%" alignItems="center"><l-pinwheel size="100" stroke="3.5" speed="0.9" color="black"></l-pinwheel></Stack>
      ) : (
        <Stack alignItems="center" marginInline="10%">
          <Stack margin="3rem" gap="1rem">
            <div>

            <Stack direction="row" justifyContent="space-between">
                <Stack direction="column" justifyContent="center">
                    <Stack justifyContent="flex-start" textAlign="left" paddingBottom={3}>
                        <h1 style={{ fontWeight: "bold" }}> {blogTitle} </h1>
                        <h3 style={{ color: "#818181" }}> {date} </h3>
                        <h3 style={{ color: "#818181" }}> by {authorName} </h3>
                    </Stack>
                </Stack>
            </Stack>
              
            <Stack>
              <Stack direction="row" gap={2} sx={{overflowX: "auto", paddingBottom: 1}}>
                {photos.map((img, i) => (
                    <img src={img} style={{height: "400px", paddingRight: "20px"}}/>
                ))}
              </Stack>
            </Stack>

            <Stack className="section">
                <p> {blogText} </p>
            </Stack>

            </div>

            {checkOwner() && (sessionStorage.getItem("token") ? 
              <Stack direction="row" justifyContent="flex-end" >
                  <GrayButton textAlign="left" variant="contained" justifyContent="center" style={{margin: 8, height: "30%"}} onClick={editBlogClick}>
                      Edit Blog
                  </GrayButton>
                  <RedButton textAlign="left" variant="contained" style={{margin: 8, height: "30%"}} onClick={handleDeleteOpen}>
                      Delete Blog
                  </RedButton> 
                  <Dialog onClose={handleDeleteClose} open={deleteOpen}>
                    <DialogTitle
                      sx={{
                        m: 2,
                        p: 2,
                        paddingBottom: 0,
                        width: "500px",
                        color: "red",
                      }}
                    >
                      {" "}
                      Delete Blog?
                    </DialogTitle>
                    <IconButton
                      onClick={handleDeleteClose}
                      sx={{ position: "absolute", right: 20, top: 25 }}
                    >
                      <CloseIcon />
                    </IconButton>
                    <DialogContent sx={{ marginLeft: 1, paddingBottom: 0 }}>
                      Are you sure you'd like to delete your blog?{" "}
                    </DialogContent>
                    <DialogContent sx={{ marginLeft: 1 }}>
                      Deleting your blog is permanent.
                    </DialogContent>
                    <DialogActions>
                      <Button
                        className="DeleteButton2"
                        variant="contained"
                        sx={{
                          p: 2,
                          backgroundColor: "red",
                          color: "white",
                          "&:hover": { backgroundColor: "red", color: "white" },
                        }}
                        autoFocus
                        onClick={deleteBlogClick}
                      >
                        Delete Blog
                      </Button>
                    </DialogActions>
                  </Dialog>
              </Stack> 
              : <div />)}
          </Stack>
        </Stack>
      )}
    </div>
  );
}

export default BlogDetails;
