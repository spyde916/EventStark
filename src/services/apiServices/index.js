import { Error } from "@mui/icons-material";
import { axiosInstance } from "../index";

export const registerUser = async (formData) => {
  try {
    const res = await axiosInstance.post("/signup", formData);
    console.log(res, "this is a res");
    return res;
  } catch (error) {
    console.log(error, "something went wrong");
    throw error.response;
  }
};

export const verifyOtp = async (otp, userId) => {
  const data = { otp, userId };
  try {
    const res = await axiosInstance.post("/verifyOtp", data);
    console.log(res, "res form opt verification");
    return res;
  } catch (error) {
    console.log(error, "something went wrong");
    throw Error(error);
  }
};

export const emailVerificationWithOtp = async (userId) => {
  try {
    const res = await axiosInstance.post("/updateVerify", { userID: userId });
    return res;
  } catch (error) {
    console.log(error, "something went wrong with the email verification");
  }
};

export const saveUserId = async () => {
  try {
    const res = await axiosInstance.get("/acceptMessage");
    return res;
  } catch (error) {
    console.log("error ", error);
  }
};

export const eventDataSave = async (data) => {
  console.log("eventDataSave", data);
  try {
    const res = await axiosInstance.post("/eventForm", data);
    return res;
  } catch (error) {
    console.log("form data save error " , error);
    throw new Error("Form not Submitted!");
  }
};

export const getMyEvents = async () => {
  try {
    const res = await axiosInstance.get("/dashboard");
    return res.data.data;
  } catch (error) {
    return error;
  }
};

export const getUpcomingEvents = async () => {
  try {
    const res = await axiosInstance.get("/upcomingEvents");
    console.log("response from upcoming in servicee" , res);
    return res.data;
  } catch (error) {
    return error;
  }
};

export const getFeaturedEvents = async () => {
  try {
    const res = await axiosInstance.get("/featuredEvents");
    return res.data;
  } catch (error) {
    return error;
  }
};

export const getEventDetail = async (id) => {
  try {
    const res = await axiosInstance.get(`/eventDetails/${id}`);
    return res.data;
  } catch (error) {
    return error;
  }
};

export const deleteEvent = async (id) => {
  try {
    const res = await axiosInstance.delete(`/deleteEvent/${id}`);
    return res;
  } catch (error) {
    return error;
  }
};

export const updateEvent = async (id, data) => {
  try {
    const res = await axiosInstance.put(`/updateEvent/${id}`, data);
    return res;
  } catch (error) {
    console.log("update error " , error);
    throw new Error("Event Not Updated!");
  }
};

export const resisterIntoEvent = async (data) => {
  try {
    const res = await axiosInstance.post(`/eventRegister`, data);
    return res;
  } catch (error) {
    return error;
  }
};

export const EmailVerificationforPassword = async (values) => {
  try {
    const res = await axiosInstance.post("/forgetPassword", values);
    return res;
  } catch (error) {
    return error;
  }
};

export const resendOtpForVerification = async (id) => {
  try {
    const res = await axiosInstance.post("/resendOtp", { id });
    return res;
  } catch (error) {
    return error;
  }
};

export const updatePassword = async (data) => {
  try {
    const res = await axiosInstance.post("/newPassword", data);
    return res;
  } catch (error) {
    return error;
  }
};

export const search = async (data) => {
  try {
    const res = await axiosInstance.get("/searchBar" ,{
       params : {searchTerm : data}
    });
    return res;
  } catch (error) {
    return error;
  }
};

export const updateEventStatus = async (data) => {
  try {
    const res = await axiosInstance.put("/statusUpdate" ,data);
    return res;
  } catch (error) {
    return error;
  }
};

