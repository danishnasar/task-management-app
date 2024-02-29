import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { deleteCache, fetchCache } from "../services/cacheSettings";

export default function User({ page }) {
  const [user, setUser] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const userDetails = fetchCache("loggedInUser");
    setUser(userDetails);
  }, []);

  const logoutUser = () => {
    deleteCache("loggedInUser");
    navigate("/login");
  };

  return (
    <div
      style={{ height: "6vh" }}
      className={page === "projects" ? "flex flex-row" : ""}
    >
      {page === "projects" && <div className="basis-3/4 bg-slate-50"></div>}
      <div className="bg-slate-50 basis-1/4">
        <div className="flex flex-row">
          <h4 className="basis-3/4 px-3 mt-2 h-10">
            LoggedIn User: <span className="font-bold">{`${user?.user?.firstName} ${user?.user?.lastName}`}</span>
          </h4>
          <button
            style={{ height: "3.5vh" }}
            onClick={logoutUser}
            className="basis-1/8 ml-10 px-3 m-2 tracking-wide text-white transition-colors duration-200 transform bg-sky-700 rounded-md hover:bg-sky-600 focus:outline-none focus:bg-sky-600 cursor-pointer"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
