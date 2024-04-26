import React from "react";
import { Link } from "react-router-dom";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { ReadMoreButton} from "../../components/StyledComponents/StyledComponents";
import { useNavigate } from "react-router-dom";

function Blog({ id, name, date, author, desc }) {
  const navigate = useNavigate();
  const eventLink = "/blogdetails/" + id;

  const readMoreLimit = 200;
  
  return (
    <button
      onClick={() => navigate(eventLink)}
      className="w-full h-full rounded-lg border-2 border-[#1C3659] flex justify-between items-start gap-5 p-2 overflow-scroll"
    >
      {/* <div className=" w-[180px] h-[180px] bg-light-gray">Image</div> */}
      <div className="w-full flex flex-col p-[1rem] gap-5">
        <h3 className="text-left font-bold">{name}</h3>
        <div className="flex flex-col gap-3">
        <div className="flex flex-row gap-3">
            <AccountCircleIcon sx={{ color: "#1C3659" }} />
            <p className="text-left">{author}</p>
          </div>
          <div className="flex flex-row gap-3">
            <AccessTimeIcon sx={{ color: "#1C3659" }} />
            <p className="text-left">{date}</p>
          </div>
          <div className="flex flex-row mt-1">
            <p className="text-left font-normal">
              {desc.length < readMoreLimit ? (
                  <div>
                    <p>{desc}</p>
                  </div>
                ) : (
                  <div>
                    <p>{desc.substring(0, readMoreLimit).concat("...")}</p>
                    <ReadMoreButton
                      size="small"
                      onClick={() => navigate(eventLink)}
                    >
                      Read More
                    </ReadMoreButton>
                  </div>
                )}
            </p>
          </div>
        </div>
      </div>
    </button>
  );
}

export default Blog;
