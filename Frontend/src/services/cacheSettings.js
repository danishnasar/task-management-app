export const fetchCache = (name) => {
  const userString = localStorage.getItem(name);
  if (userString) return JSON.parse(userString);
  else return "";
};

export const deleteCache = (name) => {
  localStorage.removeItem(name);
};

export const addCache = (name, data) => {
  localStorage.setItem(name, data);
};

export const getLoggedInUser = () => {
  const user = fetchCache("loggedInUser");

  return user;
};

export const getToken = () => {
  const userDetails = fetchCache("loggedInUser");
  const token = userDetails.token;
  const config = {
    Authorization: `Bearer ${token}`,
  };

  return config;
};
