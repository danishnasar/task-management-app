import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CircularProgress from '@mui/material/CircularProgress';
import { ToastContainer, toast } from "react-toastify";
import { API_ROUTES } from "../services/api";
import fetchUtility from "../services/fetchUtility";

export default function ForgotPassword() {
  const [userDetails, setUserDetails] = useState({});
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordChange, setPasswordChange] = useState(false);
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(window.location.search);

  useEffect(() => {
    const resetToken = searchParams.get("resetToken");
    if (resetToken) setPasswordChange(true);
  }, []);

  const additionalValidation = () => {
    let error = "";
    const regEx =
      /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;
    if (!passwordChange) {
      if (!userDetails.userName.match(regEx))
        error = "Please enter a valid email id";
    } else {
      if (userDetails.password.length < 6)
        error = "Password should be longer than 6 characters";
    }

    return error;
  };

  const validateUser = () => {
    let message = "";
    if (!userDetails.userName && !passwordChange)
      message = "Please enter a user name";
    else if (!userDetails.password && passwordChange)
      message = "Please enter a password";
    const valid = message ? "" : additionalValidation();
    if (message || valid) {
      window.onbeforeunload = () => true;
      setErrorMsg(message ? message : valid);
    } else resetPassword();
  };

  const forgotPassword = async () => {
    try {
      setLoading(true);
      const input = { userName: userDetails.userName, reqLink: window.location.href };
      await fetchUtility(
        "post",
        API_ROUTES.AUTH.FORGOTPASSWORD,
        input
      );
      setErrorMsg("");
      setLoading(false);
      toast.success(
        "Email has been sent to the registered email id. Please follow the instructions in the email to reset the password"
      );
    } catch (error) {
      setLoading(false);
      setErrorMsg(error.response.data.msg);
    }
  };

  const updatePassword = async () => {
    try {
      const resetToken = searchParams.get("resetToken");
      setLoading(true);
      await fetchUtility(
        "put",
        `${API_ROUTES.AUTH.RESETPASSWORD}/${resetToken}`,
        { password: userDetails.password }
      );
      setErrorMsg("");
      setLoading(false);
      toast.success("Password updated!");
      navigate("/login");
    } catch (error) {
      setLoading(false);
      setErrorMsg(error.response.data.msg);
    }
  };

  const resetPassword = () => {
    if (passwordChange) updatePassword();
    else forgotPassword();
  };

  return (
    <div className="relative flex flex-col justify-center min-h-screen overflow-hidden">
      <div className="w-full p-6 m-auto bg-white rounded-md shadow-md lg:max-w-xl">
        <h1 className="text-3xl font-semibold text-center text-sky-500">
          Forgot Password
        </h1>
        <form className="mt-6">
        {loading && (
              <div style={{margin: 0,
                position: "absolute",
                top: "50%",
                left: "48%",
                transform: "translate("-50%", "-50%")"}}>
                <CircularProgress size="3rem" color="success" />
              </div>
            )}
          {!passwordChange && (
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
          )}
          {passwordChange && (
            <div className="mb-2">
              <label
                for="password"
                className="block text-sm font-semibold text-gray-400"
              >
                New Password
              </label>
              <input
                type="password"
                className="block w-full px-4 py-2 mt-2 text-sky-700 bg-white border rounded-md focus:border-sky-400 focus:ring-sky-300 focus:outline-none focus:ring focus:ring-opacity-40"
                onChange={(e) =>
                  setUserDetails({ ...userDetails, password: e.target.value })
                }
              />
            </div>
          )}
          <div className="mt-6">
            <button
              type="button"
              disabled={loading}
              onClick={validateUser}
              className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-sky-700 rounded-md hover:bg-sky-600 focus:outline-none focus:bg-sky-600"
            >
              Reset Password
            </button>
            <label className="mt-2 text-red-500 font-serif">{errorMsg}</label>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}
