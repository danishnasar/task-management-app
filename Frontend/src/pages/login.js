import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { addCache } from "../services/cacheSettings";
import { API_ROUTES } from "../services/api";
import fetchUtility from "../services/fetchUtility";

export default function Login() {
  const [userDetails, setUserDetails] = useState({});
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const updateCache = (LoggedinUser) => {
    const userData = JSON.stringify(LoggedinUser);
    addCache('loggedInUser', userData);
  };

  const additionalValidation = () => {
    let error = '';
    const regEx = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;
    if (!userDetails.userName.match(regEx)) error = 'Please enter a valid email id';
    else if (userDetails.password.length < 6) error = 'Password should be longer than 6 characters';

    return error;
  };

  const validateUser = () => {
    let message = '';
    if (!userDetails.userName && !userDetails.password) message = 'Please enter user name and password';
    else if (!userDetails.userName) message = 'Please enter a user name';
    else if (!userDetails.password) message = 'Please enter a password';
    const valid = message ? '' : additionalValidation();
    if (message || valid) {
      setErrorMsg(message ? message : valid);
    }
    else {
      setErrorMsg("");
      loginUser();
    }
  };

  const loginUser = async () => {
    try {
      await fetchUtility(
        "post",
        API_ROUTES.AUTH.LOGIN,
        userDetails
      ).then((res) => {
        updateCache(res.data);
        navigate("/");
      })
    } catch (error) {
      if (error.response.status === 401) setErrorMsg(error.response.data.msg);
    }
  };

  return (
    <div className="relative flex flex-col justify-center min-h-screen overflow-hidden">
      <div className="w-full p-6 m-auto bg-white rounded-md shadow-md lg:max-w-xl">
        <h1 className="text-3xl font-semibold text-center text-sky-500">
          Sign in
        </h1>
        <form className="mt-6">
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
              onChange={(e) => setUserDetails({...userDetails, userName: e.target.value})}
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
              onChange={(e) => setUserDetails({...userDetails, password: e.target.value})}
            />
          </div>
          <Link
            to="/forgotpassword"
            className="text-xs text-sky-600 hover:underline"
          >
            Forget Password?
          </Link>
          <div className="mt-6">
            <button
              type="button"
              onClick={() => validateUser()}
              className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-sky-700 rounded-md hover:bg-sky-600 focus:outline-none focus:bg-sky-600"
            >
              Login
            </button>
            {errorMsg ? <label className="mt-2 text-red-500 font-serif">{errorMsg}</label> : ''}
          </div>
        </form>

        <p className="mt-8 text-xs font-light text-center text-gray-700">
          {" "}
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="font-medium text-sky-600 hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
