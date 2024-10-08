import React from "react";
import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar/Navbar";
import { useNavigate, useParams } from "react-router-dom";
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { Stack } from "@mui/material";
//import { withAuth } from "../withAuth";

function EditBlog() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [selected, setSelected] = useState("");
  const [blogID, setBlogID] = useState("");
  const [currentBlogData, setCurrentBlogData] = useState({
    blogName: "",
    blogContent: "",
    blogType: "",
    blogPhotos: ""
  });
  const [initialType, setInitialType] = useState(true);
  const [editedBlogData, setEditedBlogData] = useState({
    blogName: "",
    blogContent: "",
    blogType: "",
    blogPhotos: []
  });

  useEffect(() => {
    console.log("EDITED BLOG: ", editedBlogData);
  }, [editedBlogData]);

  let id = useParams();
  let resp = false;

  useEffect(() => {
    setLoading(true);
    let previews = [];

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
            currentBlogData.blogName = data.title;
            currentBlogData.blogContent = data.text;
            currentBlogData.blogType = data.visibility;
            currentBlogData.blogPhotos = data.pictures;

            previews.push(currentBlogData.blogPhotos.split(","));
            setImagePreviews(previews);
            console.log("PREVIEWS: ", imagePreviews);
            console.log("CURRENT DATA: ", currentBlogData);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleChange = (event) => {
    // Update the inputData state when form fields change
    setEditedBlogData({
      ...editedBlogData,
      [event.target.name]: event.target.value,
    });
    console.log(editedBlogData, event.target);
  };

  const [imagePreviews, setImagePreviews] = useState([]);
  const [blogPhotos, setBlogPhotos] = useState([]);
  const handlePhotoChange = (event) => {
    let previews = [];
    let photos = [];

    var pattern = /image-*/;

    for (let i = 0; i < event.target.files.length; i++) {
      if (!event.target.files[i].type.match(pattern)) {
        alert("Please choose an image file.");
        return;
      }

      previews.push(URL.createObjectURL(event.target.files[i]));
      photos.push(event.target.files[i]);
    }

    setImagePreviews(previews);
    setBlogPhotos(photos);
  };

  const handleSubmit = () => {
    let formData = new FormData();
    formData.append("blogID", blogID);
    formData.append("blogName", editedBlogData.blogName);
    formData.append("blogContent", editedBlogData.blogContent);
    formData.append("blogType", editedBlogData.blogType);
    if (blogPhotos) {
      for (let i = 0; i < blogPhotos.length; i++) {
        formData.append("blogPhotos[]", blogPhotos[i]);
      }
    }

    fetch("http://localhost:5000/blog/edit", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("token"),
      },
      body: formData,
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
        navigate(`/blogdetails/${blogID}`);
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  const handleBlogType = (type) => {
    if (initialType == true) {
        setInitialType(false);
        currentBlogData.blogType = "";
    }
    if (selected == type) {
      setSelected("");
      setEditedBlogData({
        ...editedBlogData,
        ["blogType"]: "",
      });
    } else {
      setSelected(type);
      setEditedBlogData({
        ...editedBlogData,
        ["blogType"]: type,
      });
    }
  };

  return (
    <div className="w-full h-full">
      <Navbar />
      {loading ? (
        <Stack width="100%" height="100%" alignItems="center"><l-pinwheel size="100" stroke="3.5" speed="0.9" color="black"></l-pinwheel></Stack>
      ) : (
      <div className="m-[5%] flex flex-col gap-4">
        <div className="text-4xl font-bold text-left mb-[3%]">Edit Blog</div>

        <div className="flex flex-row gap-1">
          <div className="text-l  text-left "> Blog Title</div>
          <div className="text-l  text-left text-red-600"> *</div>
        </div>
        <input
          name="blogName"
          onChange={handleChange}
          defaultValue={currentBlogData.blogName}
          className="w-full h-[45px] border-login-blue outline rounded-md align-left pl-2"
        ></input>

        <div className="flex flex-row gap-1">
            <div className="text-l  text-left "> Content </div>
            <div className="text-l  text-left text-red-600"> *</div>
        </div>
        <textarea
          name="blogContent"
          rows={4}
          onChange={handleChange}
          defaultValue={currentBlogData.blogContent}
          className="w-full h-[300px] border-login-blue outline rounded-md align-left pl-2 pt-2"
        ></textarea>

        <div className="flex flex-row gap-1">
            <div className="text-l  text-left "> Visibility </div>
            <div className="text-l  text-left text-red-600"> *</div>
        </div>
        <div className="flex flex-row gap-8  justify-start">
          <button
            name="blogType"
            value="Private"
            onClick={() => handleBlogType("Private")}
            class={`${
              currentBlogData.blogType === "Private" || selected === "Private" ? "bg-[#A1CFFF4D]" : "bg-transparent"
            } border-2 border-[#02407F] hover:bg-[#A1CFFF4D] text-[#02407F] font-bold py-4 px-10 rounded-lg`}
          >
            Private
          </button>
          <button
            name="blogType"
            value="Friends Only"
            onClick={() => handleBlogType("Friends Only")}
            class={`${
                currentBlogData.blogType === "Friends Only" || selected === "Friends Only" ? "bg-[#A1CFFF4D]" : "bg-transparent"
            } border-2 border-[#02407F] hover:bg-[#A1CFFF4D] text-[#02407F] font-bold py-4 px-10 rounded-lg`}
          >
            Friends Only
          </button>
          <button
            name="blogType"
            value="Public"
            onClick={() => handleBlogType("Public")}
            class={`${
                currentBlogData.blogType === "Public" || selected === "Public" ? "bg-[#A1CFFF4D]" : "bg-transparent"
            } border-2 border-[#02407F] hover:bg-[#A1CFFF4D] text-[#02407F] font-bold py-4 px-10 rounded-lg`}
          >
            Public
          </button>
        </div>

        <div className="text-l  text-left "> Photos</div>
        <div class="flex items-center justify-center w-full">
          <label for="dropzone-file" class="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
              <div class="flex flex-col items-center justify-center pt-5 pb-6">
                  <FileUploadIcon fontSize="large" style={{ color: "#6b7280", marginBottom: 5}}/>
                  <p class="mb-2 text-gray-500 dark:text-gray-400">Click to upload</p>
              </div>
              <input id="dropzone-file" type="file" multiple class="hidden" onChange={handlePhotoChange} />
          </label>
        </div>     

        {imagePreviews && (
            <Stack direction="row" gap={2} sx={{overflowX: "auto", paddingBottom: 1}}>
              {imagePreviews.map((img, i) => (
                  <img src={img} style={{height: "200px"}}/>
              ))}
            </Stack>
        )}

        <button
          onClick={handleSubmit}
          class="w-[20%] h-[60px] bg-[#02407F] mt-5 text-white font-bold  rounded-xl"
        >
          Edit
        </button>

        <hr class="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"></hr>
      </div>
      )}
    </div>
  );
}
export default EditBlog;
