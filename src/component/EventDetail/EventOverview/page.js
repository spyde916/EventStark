'use client'
import { Box, Button, Container, Divider, Grid2, TextField, Typography, useMediaQuery, useTheme } from "@mui/material";
import Image from "next/image";
import EastOutlinedIcon from "@mui/icons-material/EastOutlined";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import { resisterIntoEvent } from "@/services/apiServices";
import { enqueueSnackbar } from "notistack";
const EventOverview =({eventdata,setOpenPopup})=>{

    const theme = useTheme();
    const isMd = useMediaQuery(theme.breakpoints.down('md'));
    const [isSubmiting , setIsSubmiting] = useState(false);
    const [ AllFieldsFilled ,setAllFieldsFilled] = useState(false) 

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
        id : eventdata.id
      }

      console.log("data of resister user into events" , data);

       const saveData= async()=>{
          try{
            setIsSubmiting(true);
            const res = await resisterIntoEvent(data);
            res.status == "200" && setOpenPopup(true);
            setIsSubmiting(false);
            formik.resetForm();
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
        <Box>
            <Container disableGutters  maxWidth="xl" sx={{padding :{xs:"50px 20px 0px" , md:"70px 40px 0px" ,lg:"70px 70px 0px"}}}>
                <Grid2 container justifyContent={'space-between'} gap={"0px 10px"} sx={{ paddingBottom :"70px",borderBottom :"1px solid #C9C9C9"}}>
                        <Grid2 size={{xs:12 , md:6}}>
                            <Box>
                                <Typography sx={{fontSize:{xs:"20px" , md:'28px'} , color :"#200B99" , borderLeft :"6px solid #200B99" ,paddingLeft:"15px" , marginBottom : {xs:"12px",md:"18px"} ,fontWeight :"600"}}>Event Overview</Typography>
                                    <Typography sx={{fontSize:{xs:"16px" , md:'18px'} ,padding :"15px" , color :"#333333" , textWrap :"balance" ,lineHeight :{xs:"24px" ,md:"32px"}}}>{eventdata?.description ? eventdata.description : "No discription found" }</Typography>
                            </Box>
                        </Grid2>
                        <Grid2 size={{xs:12 , md:5}}>
                            
                            { !isMd &&
                                <form onSubmit={formik.handleSubmit}>
                                <Box sx={{background :"#FBFBFB",padding :"42px 56px" ,display : "flex", flexDirection :"column" ,borderRadius :"4px", gap:"39px" , boxShadow :"0px 0px 10px 0px rgba(0,0,0,0.10)" ,maxWidth :"400px"}}>
                                <Box>
                                    <Typography sx={{color :"#200B99" ,textAlign :'center'}}>Register below to secure your spot at the event!</Typography>
                                </Box>
                                <Box sx={{display :'flex' , flexDirection :"column" , gap:"30px"}}>
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
                                                    label="Phone Number"
                                                    value={formik.values.phoneNumber|| ""}
                                                    name="phoneNumber"
                                                    onBlur={formik.handleBlur}
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
                                                    fullWidth
                                                    type="email"
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
                                            width: { xs: "400px", md: "300px" },
                                            fontSize: { xs: "20px", md: "20px" },
                                            textTransform: "none",
                                            fontWeight: "100",
                                            '&.Mui-disabled': {
                                                color: '#fff',
                                                pointerEvents :'all',
                                                cursor :"not-allowed" 
                                              },
                                        //   filter :  AllFieldsFilled ? "brightness(100%)" : "brightness(50%)",
                                          cursor : AllFieldsFilled ? "pointer" :"not-allowed"
                                        }}
                                        disabled={!AllFieldsFilled}
                                        >
                                        { isSubmiting ?"Registering..." :"Register for free"}
                                </Button>
                                </Box>
                                </Box>
                                </form>
                            }
                        </Grid2>
                </Grid2>
            </Container>
        </Box>
    )
}

export default EventOverview;