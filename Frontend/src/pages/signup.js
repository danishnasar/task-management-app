import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_ROUTES } from "../services/api";
import fetchUtility from "../services/fetchUtility";

export default function Signup() {
  const [userDetails, setUserDetails] = useState({});
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const additionalValidation = () => {
    let error = '';
    const regEx = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;
    if (!userDetails.userName.match(regEx)) error = 'Please enter a valid email id';
    else if (userDetails.password.length < 6) error = 'Password should be longer than 6 characters';

    return error;
  };

  const validateUser = () => {
    let message = "";
    if (
      !userDetails.firstName ||
      !userDetails.lastName ||
      !userDetails.userName ||
      !userDetails.password
    )
      message = "Please enter the user details";
    const valid = message ? '' : additionalValidation();
    if (message || valid) { 
      setErrorMsg(message ? message : valid);
    } else {
      setErrorMsg("");
      registerUser();
    }
  };

  const registerUser = async () => {
    try {
      await fetchUtility(
        "post",
        API_ROUTES.AUTH.REGISTER,
        userDetails
      );
      navigate("/login");
    } catch (error) {
      if (error.response.status === 401) setErrorMsg(error.response.data.msg);
      if (error.response.status === 400) setErrorMsg("User name already exist");
    }
  };

  return (
    <div className="relative flex flex-col justify-center min-h-screen overflow-hidden">
      <div className="w-full p-6 m-auto bg-white rounded-md shadow-md lg:max-w-xl">
        <h1 className="text-3xl font-semibold text-center text-sky-500">
          Sign up
        </h1>
        <form className="mt-6">
          <div className="mb-2">
            <label
              for="firstname"
              className="block text-sm font-semibold text-gray-400"
            >
              First Name
            </label>
            <input
              type="firstname"
              className="block w-full px-4 py-2 mt-2 text-sky-700 bg-white border rounded-md focus:border-sky-400 focus:ring-sky-300 focus:outline-none focus:ring focus:ring-opacity-40"
              onChange={(e) =>
                setUserDetails({ ...userDetails, firstName: e.target.value })
              }
            />
          </div>
          <div className="mb-2">
            <label
              for="lastname"
              className="block text-sm font-semibold text-gray-400"
            >
              Last Name
            </label>
            <input
              type="lastname"
              className="block w-full px-4 py-2 mt-2 text-sky-700 bg-white border rounded-md focus:border-sky-400 focus:ring-sky-300 focus:outline-none focus:ring focus:ring-opacity-40"
              onChange={(e) =>
                setUserDetails({ ...userDetails, lastName: e.target.value })
              }
            />
          </div>
          <div className="mb-2">
            <label
              for="email"
              className="block text-sm font-semibold text-gray-400"
            >
              User Name
            </label>
            <input
              type="email"
              className="block w-full px-4 py-2 mt-2 text-sky-700 bg-white border rounded-md focus:border-sky-400 focus:ring-sky-300 focus:outline-none focus:ring focus:ring-opacity-40"
              onChange={(e) =>
                setUserDetails({ ...userDetails, userName: e.target.value })
              }
            />
          </div>
          <div className="mb-2">
            <label
              for="password"
              className="block text-sm font-semibold text-gray-400"
            >
              Password
            </label>
            <input
              type="password"
              className="block w-full px-4 py-2 mt-2 text-sky-700 bg-white border rounded-md focus:border-sky-400 focus:ring-sky-300 focus:outline-none focus:ring focus:ring-opacity-40"
              onChange={(e) =>
                setUserDetails({ ...userDetails, password: e.target.value })
              }
            />
          </div>
          <div className="mt-6">
            <button
              type="button"
              onClick={validateUser}
              className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-sky-700 rounded-md hover:bg-sky-600 focus:outline-none focus:bg-sky-600"
            >
              Register
            </button>
            <label className="mt-2 text-red-500 font-serif">{errorMsg}</label>
          </div>
        </form>
      </div>
    </div>
  );
}
