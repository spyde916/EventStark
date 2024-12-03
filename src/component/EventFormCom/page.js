"use client";

import {
  Box,
  Button,
  CircularProgress,
  Container,
  Grid2,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import WestIcon from "@mui/icons-material/West";
import "./eventFromCom.css";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import Checkbox from "@mui/material/Checkbox";
import EastOutlinedIcon from "@mui/icons-material/EastOutlined";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import CancelIcon from '@mui/icons-material/Cancel';
import { useFormik } from "formik";
import * as Yup from "yup";
import { useParams, useRouter } from "next/navigation";
import GoogleMapReact from "google-map-react";
import { TimePicker } from "@mui/x-date-pickers";
import { useEffect, useRef, useState } from "react";
import { eventDataSave, eventImgSave, getEventDetail, updateEvent } from "@/services/apiServices";
import { enqueueSnackbar } from "notistack";
import dayjs from 'dayjs';
import utc from "dayjs/plugin/utc";  
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';


const EventForm = () => {
  const coverFileInputRef = useRef(null);
  const QRfileInputRef = useRef(null);
  const [selectedCoverFile, setSelectedCoverFile] = useState(null);
  const [errorMessageCover, setErrorMessageCover] = useState("");
  const [selectedQRFile, setSelectedQRFile] = useState(null);
  const [errorMessageQR, setErrorMessageQR] = useState("");
  const [coverBase64 , setCoverBase64] = useState(""); 
  const [QRBase64 , setQRBase64] = useState("");
  const [submiting , setSubmiting] = useState(false);
  const [btnText , setBtnText] = useState("Create Event");
  const [submitingBtnText , setSubmitingBtnText] = useState("Creating...");
  const [eventData , setEventData ] = useState("");
  const router = useRouter();
  const params = useParams();
  const id = params?.id && params.id[0];
  const [pageLoading , setPageLoading] = useState(true);
  const [AllFieldsFilled ,setAllFieldsFilled] = useState();

  dayjs.extend(utc);

  console.log("AllFieldsFilled" , AllFieldsFilled);
  


    
  
  const handleClick = (type) => {
    console.log("type click", type);
    type == "cover"
      ? coverFileInputRef.current.click()
      : QRfileInputRef.current.click();
  };


  const handleFileChange = (event, type) => {
    console.log("event", event);
    console.log("type", type);
    const file = event.target.files[0];
    console.log("files" , file);

    if (file) {
      
      const validTypes = ["image/jpeg", "image/jpg"];
      if (!validTypes.includes(file.type)) {
        type == "cover"
          ? setErrorMessageCover("Only JPG and JPEG files are allowed.")
          : setErrorMessageQR("Only JPG and JPEG files are allowed.");
        return;
      }

      const reader = new FileReader();
      if (type == "cover") {
        console.log("inside cover");
        setSelectedCoverFile(file);
        setErrorMessageCover(""); 
        reader.addEventListener('load' , ()=>{
            setCoverBase64(reader.result)
       } )
       reader.readAsDataURL(file);
      } else {
        console.log("inside QR");
        setSelectedQRFile(file);
        setErrorMessageQR(""); 
        reader.addEventListener('load' , ()=>{
          setQRBase64(reader.result);
       } )
       reader.readAsDataURL(file);
      }
    }
    event.target.value = "";
  };

  const dateConvert = (data)=>{
    console.log("data in dateConvert" , data);
    const {$D , $M , $y} = data;
    const date = `${$y}-${$M+1}-${$D}`;
    console.log(date);
    return date;
}

const timeConvert = (data)=>{
  const {$H , $m} = data;
  const time = `${$H}:${$m}`
  console.log(time);
  return time;
}

function timeStringToMuiObj(timeString) {
  const [hours, minutes] = timeString.split(':');
  const dateObj = new Date();
  dateObj.setHours(parseInt(hours), parseInt(minutes), 0, 0);
  console.log("dateObj in timeStringToDate " , dateObj);
   const muiTimeObj =  dayjs(dateObj);
  return muiTimeObj;
}

  const validationSchema = Yup.object({
    eventName: Yup.mixed().required("Event Name required"),
    hostName: Yup.mixed().required("Host Name required"),
    description: Yup.mixed().required("Description required"),
    eventDate: Yup.mixed().required("Event Date required"),
    eventStartTime: Yup.mixed().required("Start Time required"),
    eventEndTime: Yup.mixed().required("End Time required"),
    location: Yup.mixed().required("Location required"),
    start_visibility_date: Yup.mixed().required("Start Date required"),
    end_visibility_date: Yup.mixed().required("End Date required"),
    start_visibility_time: Yup.mixed().required("Start Time required"),
    end_visibility_time: Yup.mixed().required("End Time required"),
    agreeToTerms: Yup.bool()
    .oneOf([true], 'You must accept the terms and conditions') 
    .required('This field is required'),
  });

  const formik = useFormik({
    initialValues: {
      eventName: "",
      description:"",
      eventDate: "",
      eventStartTime: "",
      eventEndTime: "",
      location: "",
      start_visibility_date: "",
      end_visibility_date:"",
      start_visibility_time: "",
      end_visibility_time: "",
      coverImg: "",
      qrCode: "",
      hostName : "",
      status :"published",
      agreeToTerms: false
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {

      const data = {
        eventName : values.eventName,
        description : values.description,
        eventDate :  dateConvert(values.eventDate),
        startTime :  timeConvert(values.eventStartTime),
        endTime : timeConvert(values.eventEndTime),
        location : values.location,
        coverImage : coverBase64 || "",
        visibleStartDate : dateConvert(values.start_visibility_date),
        visibleStartTime : timeConvert(values.start_visibility_time),
        visibleEndDate : dateConvert(values.end_visibility_date),
        visibleEndTime : timeConvert(values.end_visibility_time),
        qrCode : QRBase64 || "",
        hostName : values.hostName,
        status : values.status
      }

      console.log("data of updated data" , data);

       const saveData= async()=>{
          try{
            setSubmiting(true);
            let res = "";
            if(id){
              res = await updateEvent(id , data);
                    if(res.status == "200"){
                      enqueueSnackbar("Event Updated Successfully!" , {variant :'success'})
                    }
            }else{
               res = await eventDataSave(data);
                    if(res.status =="200"){
                      enqueueSnackbar("Event Created Successfully!" , {variant :'success'})
                    }
            }
            router.push("/dashboard");
            setSubmiting(false);
            console.log("response from save form" , res); 
          }catch(error){
            console.log("error in save data" , error);
            enqueueSnackbar(error , {variant :'error'})
            setSubmiting(false);
          }
          
       }

       saveData();
    }
  });


  const removeImg=(type)=>{
      if(type == "cover"){
        setSelectedCoverFile("");
        setCoverBase64("");
      }else{
        setSelectedQRFile("");
        setQRBase64("");
      }
  }



  
  // useEffect(() => {
  //   const formikData = formik.values;
  //   const allFilled = Object.values(formikData).every((value) =>  typeof value == 'boolean' ?  value === true : value !== "" );
  //   setAllFieldsFilled(allFilled);
  // }, [formik.values]);

  
  

 useEffect(()=>{
  formik.setFieldValue("eventName", eventData?.event_name || "");
  formik.setFieldValue("description", eventData.description || "");
  formik.setFieldValue("eventDate",    dayjs.utc(eventData.event_date)|| "");
  formik.setFieldValue("eventStartTime",  (eventData?.start_time && timeStringToMuiObj(eventData.start_time)) || "");
  formik.setFieldValue("eventEndTime", (eventData?.end_time && timeStringToMuiObj(eventData.end_time)) || "");
  formik.setFieldValue("location", eventData.location || "");
  formik.setFieldValue("start_visibility_date", dayjs.utc(eventData.start_visibility_date) || "");
  formik.setFieldValue("end_visibility_date", dayjs.utc(eventData.end_visibility_date) || "");
  formik.setFieldValue("start_visibility_time", (eventData?.start_visibility_time && timeStringToMuiObj(eventData.start_visibility_time))  || "");
  formik.setFieldValue("end_visibility_time", (eventData?.end_visibility_time && timeStringToMuiObj(eventData.end_visibility_time)) || "");
  formik.setFieldValue("coverImg", eventData.cover_image || "");
  formik.setFieldValue("qrCode", eventData.donations_qr_code || "");
  formik.setFieldValue("hostName", eventData.host_name || "");
  setCoverBase64(eventData.cover_image);
  setQRBase64(eventData.donations_qr_code);
 }, [eventData]);


  const fetchEventDetail = async()=>{
    setPageLoading(true);
    try{
      const res = await getEventDetail(id);
      setPageLoading(false);
      setEventData(res.data[0]);
      console.log("res in fetch eventformData" , res.data[0]);
    }catch(error){
        console.log("Error in fetch eventformData" , error);
    }
  }

  

  useEffect(()=>{
    formik.resetForm();
    setCoverBase64("");
    setQRBase64("");
    if(id){
      setPageLoading(true);
      setBtnText("Update Event");
      setSubmitingBtnText("Updating...");
      fetchEventDetail();
    }else{
      setPageLoading(false);
    }
  }, [])
  
  console.log("EventData" ,eventData);
  console.log("fomrik data" ,formik.values);
    console.log("=========>"  , formik?.values?.eventStartTime &&  dayjs.utc(formik.values.eventStartTime));
 

  return (
    <Box>
      <Container
        maxWidth="xl"
        sx={{
          backgroundImage: { xs: "none", md: `url('/Img/bgImg.png')`},
          backgroundRepeat: "no-repeat",
          backgroundPosition: "top",
          backgroundSize: "contain",
          padding: { xs: "0", md: "60px 30px 20px" },
          backgroundPositionY: "-50px",
          display: "grid",
          placeItems: "center",
        }}
      >

        {
          pageLoading ? (
            <>
             <Box sx={{width :"100vw" , height :"80vh" ,   display :"grid" , placeContent : "center"}}>
                        <CircularProgress sx={{color :"#4626fd"}} />
            </Box>
            </>
          ):(<>
                <Grid2
          container
          sx={{
            background: "white",
            boxShadow: { sx: "none", md: "0px 0px 7px 5px rgba(0,0,0,0.11)" },
            width: { xs: "100%", md: "80%" },
            padding: "22px",
            borderRadius: "6px",
          }}
        >
          <Grid2 item size={{ md: 12 }}>
            <Box sx={{ display: "flex", gap: "10px"  , alignItems :'center'}}>
                <IconButton onClick={()=>router.push("/dashboard")}><WestIcon fontSize="large" sx={{ color: "#3612ff" }} /></IconButton>
              <Box>
                <Typography
                  sx={{ fontWeight: "400", fontSize: "24px", color: "#333333" }}
                >
                 {id ? "Update" : "Create" } Your Event
                </Typography>
              </Box>
            </Box>
          </Grid2>

          <form onSubmit={formik.handleSubmit}>     
          <Grid2
            container
            sx={{
              padding: { xs: "20px 0px", md: 5 },
              columnGap: 10,
              rowGap: 6,
              marginLeft: { xs: "0px", md: "20px" },
            }}
          >
            
            <Grid2 item size={{ md: 5 }}>
              <Typography
                sx={{
                  fontSize: "18px",
                  marginBottom: "8px",
                  color: "#333333",
                }}
              >
                What's the name of your event?
              </Typography>
              <Typography
                sx={{
                  fontSize: "14px",
                  color: "#767676",
                  marginBottom: "22px",
                }}
              >
                This will be the official name displayed across all listings,
                promotions, and communications, so make it clear and catchy.
              </Typography>
              <TextField
                required
                id="outlined-required"
                label="Event Name"
                name="eventName"
                onBlur={formik.handleBlur}
                value={formik.values.eventName|| ""}
                onChange={(e)=>{
                   formik.setFieldValue("eventName" ,e.target.value);
                }}
                fullWidth
                sx={{
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "#3612FF",
                  },
                  "& .MuiOutlinedInput-root": {
                    "&:hover fieldset": {
                      borderColor: "gray",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "gray",
                    },
                  },
                  "& .MuiInputLabel-root.Mui-focused .MuiInputLabel-asterisk": {
                    color: "red",
                  },
                }}
              />
               {formik.touched.eventName && formik.errors.eventName && (
              <div style={{ color: "red" }} className="error">
                {formik.errors.eventName}
              </div>
            )}
            </Grid2>
            
            <Grid2 item size={{ md: 5 }}>
              <Typography
                sx={{
                  fontSize: "18px",
                  marginBottom: "8px",
                  color: "#333333",
                }}
              >
                How would you describe your event?
              </Typography>
              <Typography
                sx={{
                  fontSize: "14px",
                  color: "#767676",
                  marginBottom: "22px",
                }}
              >
                Provide a engaging description that highlights what
                makes your event special. This will be displayed on the event
                page to attract attendees.
              </Typography>
              <TextField
                required
                id="outlined-required"
                label="Description"
                multiline={true}
                minRows={2}
                maxRows={4}
                fullWidth
                name="description"
                onBlur={formik.handleBlur}
                value={formik.values.description|| ""}
                onChange={(e)=>{
                   formik.setFieldValue("description" ,e.target.value);
                }}
                sx={{
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "#3612FF",
                  },
                  "& .MuiOutlinedInput-root": {
                    "&:hover fieldset": {
                      borderColor: "gray",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "gray",
                    },
                  },
                  "& .MuiInputLabel-root.Mui-focused .MuiInputLabel-asterisk": {
                    color: "red",
                  },
                }}
              />
               {formik.touched.description && formik.errors.description && (
              <div style={{ color: "red" }} className="error">
                {formik.errors.description}
              </div>
            )}
            </Grid2>
            <Grid2 item size={{ md: 5 }}>
              <Typography
                sx={{
                  fontSize: "18px",
                  marginBottom: "8px",
                  color: "#333333",
                }}
              >
                When is your event happening?
              </Typography>
              <Typography
                sx={{
                  fontSize: "14px",
                  color: "#767676",
                  marginBottom: "22px",
                }}
              >
                Choose the date and time your event will take place.
              </Typography>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer
                  components={["DatePicker"]}
                  sx={{ width: "100%" }}
                >
                  <DatePicker
                    label={
                      <>
                        Event Date<span className="required-asterisk"> *</span>
                      </>
                    }
                format="DD/MM/YYYY"
                value={formik.values.eventDate || null}
                onChange={(e)=>{
                  formik.setFieldValue("eventDate" ,e);
                }}
                    sx={{
                      width: "100%",
                      "& .Mui-focused .required-asterisk": {
                        color: "red",
                      },
                      "& .MuiInputLabel-root.Mui-focused": {
                        color: "#3612FF",
                      },
                      "& .MuiOutlinedInput-root": {
                        "&:hover fieldset": {
                          borderColor: "gray",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "gray",
                        },
                      },
                    }}
                  />
                </DemoContainer>
              </LocalizationProvider>
              {formik.touched.eventDate && formik.errors.eventDate && (
              <div style={{ color: "red" }} className="error">
                {formik.errors.eventDate}
              </div>
            )}
              <Box
                sx={{
                  display: "flex",
                  gap: 5,
                  justifyContent: "space-between",
                  marginTop: "20px",
                }}
              >
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer  components={["TimePicker"]}>
                    <TimePicker
                      label={
                        <>
                          Start Time
                          <span className="required-asterisk"> *</span>
                        </>
                      }
                      value={formik.values.eventStartTime || null}
                      onChange={(e)=>{
                   formik.setFieldValue("eventStartTime" ,e);
                }}
                      sx={{
                        "& .MuiInputLabel-root.Mui-focused": {
                          color: "#3612FF",
                        },
                        "& .MuiOutlinedInput-root": {
                          "&:hover fieldset": {
                            borderColor: "gray",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "gray",
                          },
                        },
                        "& .MuiInputLabel-root.Mui-focused .required-asterisk":
                          {
                            color: "red",
                          },
                      }}
                    />
                    {formik.touched.eventStartTime && formik.errors.eventStartTime && (
              <div style={{ color: "red" }} className="error">
                {formik.errors.eventStartTime}
                </div>
            )}
                  </DemoContainer>
                  
                </LocalizationProvider>
                

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={["TimePicker"]}>
                    <TimePicker
                      label={
                        <>
                          End Time
                          <span className="required-asterisk"> *</span>
                        </>
                      }
                      value={formik.values.eventEndTime || null}
                      onChange={(e)=>{
                        formik.setFieldValue("eventEndTime" ,e);
                     }}
                      sx={{
                        "& .MuiInputLabel-root.Mui-focused": {
                          color: "#3612FF",
                        },
                        "& .MuiOutlinedInput-root": {
                          "&:hover fieldset": {
                            borderColor: "gray",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "gray",
                          },
                        },
                        "& .MuiInputLabel-root.Mui-focused .required-asterisk":
                          {
                            color: "red",
                          },
                      }}
                    />
                     {formik.touched.eventEndTime && formik.errors.eventEndTime && (
              <div style={{ color: "red" }} className="error">
                {formik.errors.eventEndTime}
              </div>
            )}
                  </DemoContainer>
                 
                </LocalizationProvider>
                
              </Box>
            </Grid2>
            <Grid2 item size={{ md: 5 }}>
              <Typography
                sx={{
                  fontSize: "18px",
                  marginBottom: "8px",
                  color: "#333333",
                }}
              >
                Upload Event Cover Image
              </Typography>
              <Typography
                sx={{
                  fontSize: "14px",
                  color: "#767676",
                  marginBottom: "22px",
                }}
              >
                Please upload an engaging image that represents your event.
              </Typography>
              <input
                ref={coverFileInputRef}
                type="file"
                accept=".jpg,.jpeg"
                style={{ display: "none" }} 
                onChange={(e) => handleFileChange(e, "cover")}
              />
              <Box sx={{ display: "flex", gap: "10px" }}>
                <Button
                  component="label"
                  sx={{ border: "2px solid #bbbbbb", width: "200px" }}
                  onClick={() => handleClick("cover")}
                >
                  <AddOutlinedIcon
                    style={{ fontSize: 110, color: "#bbbbbb" }}
                  />
                </Button>

                {coverBase64 && (
                  <Box
                    sx={{
                      width: "100%",
                      height: "auto",
                      backgroundImage: `url(${coverBase64})`,
                      backgroundPosition: "center",
                      backgroundSize: "cover",
                      borderRadius: "5px",
                      position :"relative"
                    }}
                  >
                    <Typography component={'span'}
                     sx={{
                      position :"absolute" ,
                      left :"94%" ,
                      top : "-10px",
                      cursor :"pointer"
                     }}
                     onClick={()=>removeImg("cover")}
                    ><CancelIcon className="cancel-btn"/></Typography>
                  </Box>
                )}
              </Box>
              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  alignItems: "center",
                  marginTop: "5px",
                }}
              >
                <InfoOutlinedIcon style={{ color: "#767676" }} />
                <Typography sx={{ fontSize: "14px", color: "#767676" }}>
                Recommended image size: 1080x1080 pixels, in JPG or JPEG format.
                </Typography>
              </Box>
            </Grid2>
            <Grid2 item size={{ md: 5 }}>
              <Typography
                sx={{
                  fontSize: "18px",
                  marginBottom: "8px",
                  color: "#333333",
                }}
              >
                Who's hosting your event?
              </Typography>
              <Typography
                sx={{
                  fontSize: "14px",
                  color: "#767676",
                  marginBottom: "22px",
                }}
              >
             This is the official name of the host that will be displayed across all listings, promotions, and communications, so make sure it’s accurate and recognizable.
              </Typography>
              <TextField
                required
                id="outlined-required"
                label="Host Name"
                value={formik.values.hostName|| ""}
                name={"hostName"}
                onBlur={formik.handleBlur}
                onChange={(e)=>{
                   formik.setFieldValue("hostName" ,e.target.value);
                }}
                fullWidth
                sx={{
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "#3612FF",
                  },
                  "& .MuiOutlinedInput-root": {
                    "&:hover fieldset": {
                      borderColor: "gray",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "gray",
                    },
                  },
                  "& .MuiInputLabel-root.Mui-focused .MuiInputLabel-asterisk": {
                    color: "red",
                  },
                }}
              />
               {formik.touched.hostName && formik.errors.hostName && (
              <div style={{ color: "red" }} className="error">
                {formik.errors.hostName}
              </div>
            )}
            </Grid2>
           
            <Grid2 item size={{ md: 5 }}>
              <Typography
                sx={{
                  fontSize: "18px",
                  marginBottom: "8px",
                  color: "#333333",
                }}
              >
                What is the duration of visibility for your event on
                Starksworld?
              </Typography>
              <Typography
                sx={{
                  fontSize: "14px",
                  color: "#767676",
                  marginBottom: "22px",
                }}
              >
                Select the date and time range during which your event will be
                showcased on our platform.
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "12px",
                  marginTop: "20px",
                }}
              >
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer
                    components={["DatePicker"]}
                    sx={{ width: "100%" }}
                  >
                    <DatePicker
                      label={
                        <>
                          Start Date
                          <span className="required-asterisk"> *</span>
                        </>
                      }
                      format="DD/MM/YYYY"
                      value={formik.values.start_visibility_date || null}
                      onChange={(e)=>{
                        console.log(e);
                        formik.setFieldValue("start_visibility_date" ,e);
                     }}
                      sx={{
                        width: "100%",
                        "& .Mui-focused .required-asterisk": {
                          color: "red",
                        },
                        "& .MuiInputLabel-root.Mui-focused": {
                          color: "#3612FF",
                        },
                        "& .MuiOutlinedInput-root": {
                          "&:hover fieldset": {
                            borderColor: "gray",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "gray",
                          },
                        },
                      }}
                    />
                    {formik.touched.start_visibility_date && formik.errors.start_visibility_date && (
              <div style={{ color: "red" }} className="error">
                {formik.errors.start_visibility_date}
              </div>
            )}
                  </DemoContainer>
                </LocalizationProvider>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={["TimePicker"]}>
                    <TimePicker
                      label={
                        <>
                          Start Time
                          <span className="required-asterisk"> *</span>
                        </>
                      }
                      value={formik.values.start_visibility_time || null}
                      onChange={(e)=>{
                        console.log(e);
                        formik.setFieldValue("start_visibility_time" ,e);
                     }}
                      sx={{
                        "& .MuiInputLabel-root.Mui-focused": {
                          color: "#3612FF",
                        },
                        "& .MuiOutlinedInput-root": {
                          "&:hover fieldset": {
                            borderColor: "gray",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "gray",
                          },
                        },
                        "& .MuiInputLabel-root.Mui-focused .required-asterisk":
                          {
                            color: "red",
                          },
                      }}
                    />
                    {formik.touched.start_visibility_time && formik.errors.start_visibility_time && (
              <div style={{ color: "red" }} className="error">
                {formik.errors.start_visibility_time}
              </div>
            )}
                  </DemoContainer>
                </LocalizationProvider>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "12px",
                  marginTop: "20px",
                }}
              >
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer
                    components={["DatePicker"]}
                    sx={{ width: "100%" }}
                  >
                    <DatePicker
                      label={
                        <>
                          End Date
                          <span className="required-asterisk"> *</span>
                        </>
                      }
                      format="DD/MM/YYYY"
                      value={formik.values.end_visibility_date || null}
                      onChange={(e)=>{
                        console.log(e);
                        formik.setFieldValue("end_visibility_date" ,e);
                     }}
                      sx={{
                        width: "100%",
                        "& .Mui-focused .required-asterisk": {
                          color: "red",
                        },
                        "& .MuiInputLabel-root.Mui-focused": {
                          color: "#3612FF",
                        },
                        "& .MuiOutlinedInput-root": {
                          "&:hover fieldset": {
                            borderColor: "gray",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "gray",
                          },
                        },
                      }}
                    />
                    {formik.touched.end_visibility_date && formik.errors.end_visibility_date && (
              <div style={{ color: "red" }} className="error">
                {formik.errors.end_visibility_date}
              </div>
            )}
                  </DemoContainer>
                </LocalizationProvider>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={["TimePicker"]}>
                    <TimePicker
                      label={
                        <>
                          End Time
                          <span className="required-asterisk"> *</span>
                        </>
                      }
                      value={formik.values.end_visibility_time || null}
                      onChange={(e)=>{
                        console.log(e);
                        formik.setFieldValue("end_visibility_time" ,e);
                     }}
                      sx={{
                        "& .MuiInputLabel-root.Mui-focused": {
                          color: "#3612FF",
                        },
                        "& .MuiOutlinedInput-root": {
                          "&:hover fieldset": {
                            borderColor: "gray",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "gray",
                          },
                        },
                        "& .MuiInputLabel-root.Mui-focused .required-asterisk":
                          {
                            color: "red",
                          },
                      }}
                    />
                    {formik.touched.end_visibility_time && formik.errors.end_visibility_time && (
              <div style={{ color: "red" }} className="error">
                {formik.errors.end_visibility_time}
              </div>
            )}
                  </DemoContainer>
                </LocalizationProvider>
              </Box>
            </Grid2>
            <Grid2 item size={{ md: 5 }}>
              <Typography
                sx={{
                  fontSize: "18px",
                  marginBottom: "8px",
                  color: "#333333",
                }}
              >
                Would you like to accept donations for your event?
              </Typography>
              <Typography
                sx={{
                  fontSize: "14px",
                  color: "#767676",
                  marginBottom: "22px",
                }}
              >
                If yes, please upload your QR code for donations below.
              </Typography>
              <Typography
                sx={{
                  color: "#3612ff",
                  fontSize: "14px",
                  fontWeight: "bold",
                  marginBottom: "5px",
                }}
              >
                Upload QR Code
              </Typography>
              <input
                ref={QRfileInputRef}
                type="file"
                accept=".jpg,.jpeg"
                style={{ display: "none" }} // Hide the file input
                onChange={(e) => handleFileChange(e, "QR")}
              />
              <Box sx={{ display: "flex", gap: "10px" }}>
                <Button
                  component="label"
                  sx={{ border: "2px solid #bbbbbb", width: "200px" }}
                  onClick={() => handleClick("QR")}
                >
                  <AddOutlinedIcon
                    style={{ fontSize: 110, color: "#bbbbbb" }}
                  />
                </Button>

                {QRBase64 && (
                  <Box
                  sx={{
                    width: "100%",
                    height: "auto",
                    backgroundImage: `url(${QRBase64})`,
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                    borderRadius: "5px",
                    position :"relative"
                  }}
                >
                  <Typography component={'span'}
                   sx={{
                    position :"absolute" ,
                    left :"94%" ,
                    top : "-10px",
                    cursor :"pointer"
                   }}
                   onClick={()=>removeImg("qr")}
                  ><CancelIcon className="cancel-btn" 
                  /></Typography>
                </Box>
                )}
              </Box>
              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  alignItems: "center",
                  marginTop: "5px",
                }}
              >
                <InfoOutlinedIcon style={{ color: "#767676" }} />
                <Typography sx={{ fontSize: "14px", color: "#767676" }}>
                Recommended image size: 1080x1080 pixels, in JPG or JPEG format.
                </Typography>
              </Box>
            </Grid2>
            <Grid2 item size={{ md: 5 }}>
              <Typography
                sx={{
                  fontSize: "18px",
                  marginBottom: "8px",
                  color: "#333333",
                }}
              >
                Where will the event be held?
              </Typography>
              <Typography
                sx={{
                  fontSize: "14px",
                  color: "#767676",
                  marginBottom: "22px",
                }}
              >
                Provide the venue or location details. You can also choose a
                location from the map.
              </Typography>
              <TextField
                required
                id="outlined-required"
                label="Location"
                fullWidth
                value={formik.values.location|| ""}
                name={"location"}
                onBlur={formik.handleBlur}
                onChange={(e)=>{
                   formik.setFieldValue("location" ,e.target.value);
                }}
                sx={{
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "#3612FF",
                  },
                  "& .MuiOutlinedInput-root": {
                    "&:hover fieldset": {
                      borderColor: "gray",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "gray",
                    },
                  },
                  "& .MuiInputLabel-root.Mui-focused .MuiInputLabel-asterisk": {
                    color: "red",
                  },
                }}
              />
              {formik.touched.location && formik.errors.location && (
              <div style={{ color: "red" }} className="error">
                {formik.errors.location}
              </div>
            )}
              {/* <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  alignItems: "center",
                  width: "fit-content",
                  padding: "2px 10px",
                  margin: "15px 0",
                  background: "#EBEBEB",
                }}
              >
                <HomeOutlinedIcon style={{ color: "#333333" }} />
                <Typography sx={{ fontSize: "14px", color: "#333333" }}>
                  Add location details{" "}
                </Typography>
              </Box> */}
              {/* <Map></Map> */}
            </Grid2>
            <Grid2 item size={{ md: 12 }}>
              <Box sx={{ display: "flex", alignItems: "center" 
               }}>
                <Box sx={{border : formik.touched.agreeToTerms && formik.errors.agreeToTerms ? '1px solid red' : "none" ,display: "flex", alignItems: "center" , paddingRight : "10px"}}>
                <Checkbox name="agreeToTerms"
                 onChange={(e)=>{
                  formik.setFieldValue("agreeToTerms" ,e.target.checked);
               }}
                />
                <Typography sx={{ fontSize: "14px", 
                  }}>
                  I agree to the terms and conditions of Starkworld and confirm
                  that all provided information is accurate.
                </Typography>
                </Box>
              </Box>
            </Grid2>
            <Grid2 item size={{ md: 12 }} sx={{width : "100%"}}>
              <Box fullWidth sx={{ display: "flex", justifyContent:{ xs:"center" ,md:"end"}}}>
                <Button
                  endIcon={<EastOutlinedIcon />}
                  sx={{
                    background:"linear-gradient(90deg, #4626FD 10%, #7861FF 100%)",
                    color: "white",
                    width: { xs: "100%", md: "300px" },
                    fontSize: { xs: "20px", md: "20px" },
                    textTransform: "none",
                    fontWeight: "100",
                    maxWidth :{xs:"400px" ,md:"300px"},
                    '&.Mui-disabled': {
                          color: '#fff',
                          pointerEvents :'all',
                          cursor :"not-allowed" 
                        },
                  }}
                  onClick={() => {
                    formik.handleSubmit();
                  }}
                  disabled={submiting}
                >
                  {submiting ? submitingBtnText  : btnText } 
                </Button>
              </Box>
            </Grid2>
          </Grid2>
          </form>

        </Grid2>
          </>)
        }
       
      </Container>
    </Box>
  );
};

export default EventForm;


const Map = ({address}) => {
  const defaultProps = {
    center: {
      lat: 10.99835602,
      lng: 77.01502627,
    },
    zoom: 11,
  };

  const [location, setLocation] = useState({ lat: 40.730610, lng: -73.935242 }); // Default location (New York)

  const handleInputChange = async () => {
   
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=AIzaSyBj-j8S4aiEWfQ30NYvcMP-FEUU-UpV9ao`
      );
      const data = await response.json();
 
      if (data.results && data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry.location;
        setLocation({ lat, lng });
      }
    } catch (error) {
      console.error('Error fetching the location:', error);
    }
  };

  const containerStyle = {
    width: '100%',
    height: '167px'
  };

  useEffect(()=>{
    handleInputChange(address);
  }, [address])

  return (
    <div style={{ height: "167px", width: "100%" }}>
      <LoadScript googleMapsApiKey="AIzaSyBj-j8S4aiEWfQ30NYvcMP-FEUU-UpV9ao">
      <GoogleMap mapContainerStyle={containerStyle} center={location} zoom={10}>
      <Marker position={location} />
      </GoogleMap>
      </LoadScript>
    </div>
  );
};
