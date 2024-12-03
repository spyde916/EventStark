'use client'

import { Box, Button, Container, TextField, Typography , Backdrop ,CircularProgress } from '@mui/material';
import React, { useEffect, useState } from 'react'
import EastOutlinedIcon from "@mui/icons-material/EastOutlined";
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { resisterIntoEvent } from '@/services/apiServices';

const EventRegisterform = ({eventId}) => {
    const router = useRouter();
    
    const [isSubmiting , setIsSubmiting] = useState(false);
    const [ AllFieldsFilled ,setAllFieldsFilled] = useState(false);
    const [loading , setLoading ]= useState(false);


    const validationSchema = Yup.object().shape({
        fullName: Yup.string().matches(/^[A-Za-z\s]+$/, "Full Name can only contain letters and spaces").required("Full Name is required"),
        phoneNumber: Yup.string().required("Phone Number is required").matches(/^[0-9]{10}$/, "Phone number must be exactly 10 digits"),
        email: Yup.string().email("Invalid email address").required("Email required"), 
    });

  const formik = useFormik({
    initialValues: {
        fullName: "",
        phoneNumber:"",
        email: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {

      const data = {
        fullName : values.fullName || "",
        email : values.email || "",
        phoneNumber :  values.phoneNumber || "",
        id : eventId
      }

      console.log("data of resister user into events" , data);

       const saveData= async()=>{
          try{
            setIsSubmiting(true);
            const res = await resisterIntoEvent(data);
            if(res.status == "200"){
                setLoading(true);
                router.push("/eventdetail/registerd");
            }
            setIsSubmiting(false);
            console.log("response from reg_In_event" , res); 
          }catch(error){
            console.log("error in reg_In_event" , error);
            enqueueSnackbar(error , {variant :'error'})
            setIsSubmiting(false);
          }
          
       }

       saveData();
    }
  });

  useEffect(() => {
    const formikData = formik.values;
    const allFilled = Object.values(formikData).every((value) =>  typeof value == 'boolean' ?  value === true : value !== "" );
    setAllFieldsFilled(allFilled);
  }, [formik.values]);

  return (
         <>
         <Box>
         <Backdrop
                sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                open={loading}
            >
                <CircularProgress  sx={{color : "#7861FF"}} />
            </Backdrop>
            <Container maxWidth="sm">
            <form onSubmit={formik.handleSubmit}> 
                <Box sx={{background :"#FBFBFB",padding :{xs:"30px" ,md:"42px 56px"} ,display : "flex", flexDirection :"column" ,borderRadius :"4px", gap:{ xs:"26px",md:"39px"} ,margin :"20px 0px", boxShadow :"0px 0px 10px 0px rgba(0,0,0,0.10)"}}>
                                        <Box>
                                            <Typography sx={{color :"#200B99" ,textAlign :'center' , fontWeight :"500" }}>Register below to secure your spot at the event!</Typography>
                                        </Box>
                                        <Box sx={{display :'flex' , flexDirection :"column" , gap:{ xs:"20px" , md:"30px"}}}>
                                            <Box>
                                                <Typography sx={{marginBottom :"12px"}}>Enter Your Full Name</Typography>
                                                <TextField
                                                            id="outlined-required"
                                                            label="Name"
                                                            value={formik.values.fullName|| ""}
                                                            name="fullName"
                                                            onBlur={formik.handleBlur}
                                                            onChange={(e)=>{
                                                            formik.setFieldValue("fullName" ,e.target.value);
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
                                                            }}
                                                        />
                                                         {formik.touched.fullName && formik.errors.fullName && (
                                                            <div style={{ color: "red" }} className="error">
                                                                {formik.errors.fullName}
                                                            </div>
                                                            )}
                                            </Box>
                                            <Box>
                                                <Typography sx={{marginBottom :"12px"}}>Enter Your Contact Number </Typography>
                                                <TextField
                                                            id="outlined-required"
                                                            type='number'
                                                            label="Phone Number"
                                                            name="phoneNumber"
                                                            onBlur={formik.handleBlur}
                                                            value={formik.values.phoneNumber|| ""}
                                                            onChange={(e)=>{
                                                            formik.setFieldValue("phoneNumber" ,e.target.value);
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
                                                            }}
                                                        />
                                                        {formik.touched.phoneNumber && formik.errors.phoneNumber && (
                                                        <div style={{ color: "red" }} className="error">
                                                            {formik.errors.phoneNumber}
                                                        </div>
                                                        )}
                                            </Box>
                                            <Box>
                                                <Typography sx={{marginBottom :"12px"}}>Enter Your Email Address</Typography>
                                                <TextField
                                                            id="outlined-required"
                                                            label="Email Address"
                                                            value={formik.values.email|| ""}
                                                            name="email"
                                                            onBlur={formik.handleBlur}
                                                            onChange={(e)=>{
                                                            formik.setFieldValue("email" ,e.target.value);
                                                            }}
                                                            type='email'
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
                                                            }}
                                                        />
                                                        {formik.touched.email && formik.errors.email && (
                                                        <div style={{ color: "red" }} className="error">
                                                            {formik.errors.email}
                                                        </div>
                                                        )}
                                            </Box>
                                        </Box>
                                        <Box sx={{display:'grid' , placeContent:"center"}}>
                                        <Button
                                                endIcon={<EastOutlinedIcon />}
                                                type="submit"
                                                sx={{
                                                    background:
                                                    "linear-gradient(90deg, #4626FD 10%, #7861FF 100%)",
                                                    color: "white",
                                                    width: "268px",
                                                    fontSize: { xs: "20px", md: "20px" },
                                                    textTransform: "none",
                                                    fontWeight: "100",
                                                    '&.Mui-disabled': {
                                                    color: '#fff',
                                                    pointerEvents :'all',
                                                    cursor :"not-allowed" 
                                                    },
                                                }}
                                                disabled={formik.isSubmitting}
                                                >
                                                {isSubmiting ? "Submiting" :"Register for free"}
                                        </Button>
                                        </Box>
                </Box>
                </form>
            </Container>
         </Box>
         
         </>
  )
}

export default EventRegisterform;