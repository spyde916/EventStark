"use client";

import React, { useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Divider,
  Grid,
  useTheme,
  useMediaQuery,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { registerUser } from "@/services/apiServices";
import Image from "next/image";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const validationSchema = Yup.object().shape({
  fullName: Yup.string()
    .matches(/^[A-Za-z\s]+$/, "Full Name can only contain letters and spaces")
    .required("Full Name is required"),
  phoneNumber: Yup.string()
    .required("Phone Number is required")
    .matches(/^[0-9]{10}$/, "Phone number must be exactly 10 digits"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .required("Password is required")
    .matches(/[0-9]/, "Password must contain at least one number")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .min(8, "Password must be at least 8 characters long"),
});

const SignUp = () => {
  const router = useRouter();
  const theme = useTheme();
  const {enqueueSnackbar ,closeSnackbar} = useSnackbar();
  const [showPassword, setShowPassword] = React.useState(false);
  const [loading , setLoading ] = React.useState(false);

 
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event) => {
    event.preventDefault();
  };


const isMd = useMediaQuery(theme.breakpoints.down('md'));

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const response = await registerUser(values);

      if (response.status == "200") {
        resetForm();
        router.push(`/emailVerify/account/${response.data.userId}`);
        setLoading(true);
        enqueueSnackbar("Registration successful! Please check your email to verify your account" ,{variant :'success'})
      }
    }catch(error) {
      enqueueSnackbar(error.data.message,{variant :'error'})
      console.log("Registration failed", error);
    }
    setSubmitting(false);
  };

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/dashboard" });
    setLoading(true);
  };

  const handlefacebookSignIn = () => {
    signIn("facebook", { callbackUrl: "/dashboard" });
    setLoading(true);
  };
  

  return (
    <>
    <Backdrop
        sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
        open={loading}
      >
        <CircularProgress  sx={{color : "#7861FF"}} />
      </Backdrop>

      <Box
        sx={{
          height: "100vh",
          width: "100vw",
          backgroundImage: {xs:"url(/Img/bgImg.png) ,url(/Img/bgBottom.png)" , md : "url(/Img/bgImg.png)"},
          backgroundRepeat: "no-repeat , no-repeat",
          backgroundPosition: "top , bottom",
          backgroundSize: "contain , contain",
          position: "absolute",
        }}
      ></Box>

      <Grid
        container
        justifyContent="center"
        sx={{
          margin : {xs:"50px 0px" , md : "15px 0px"},
          position : 'relative'
        }}
      >
        <Grid item xs={12} sm={8} md={6} lg={4} sx={{display :"grid", placeContent :"center",}}>
          <Box
            sx={{
              padding: 4,
              borderRadius: "6px",
              background: { xs: "none", md: "#FDFDFD" },
              boxShadow: { sx: "none", md: "0px 2px 6px 0px rgba(0,0,0,0.12)" },
              textAlign :'center',
              maxWidth :"400px"
            }}
          >
           <Typography component={'span'} sx={{display :{xs:"none" , md :"block"}}}>
              <Image width={isMd?266 : 146} height={isMd? 49 :27} src={"/Img/StarksWorld.svg"} style={{display : {xs:"none" , md : "block"}}} alt="StarksWorldLogo"/>
              </Typography>

            <Box sx={{ textAlign: "left", marginBottom: "20px" }}>
              <Typography variant="h5">Hello!</Typography>
              <Typography variant="body2" color="textSecondary">
                We’re excited to have you here.
              </Typography>
            </Box>

            <Formik
              initialValues={{
                fullName: "",
                phoneNumber: "",
                email: "",
                password: "",
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({  getFieldProps,errors, touched, isSubmitting  ,isValid, dirty}) => (
                <Form>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Field
                        as={TextField}
                        fullWidth
                        label="Enter Full Name"
                        name="fullName"
                        variant="outlined"
                        error={touched.fullName && Boolean(errors.fullName)}
                        helperText={touched.fullName && errors.fullName}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Field
                        as={TextField}
                        fullWidth
                        label="Enter Phone Number"
                        name="phoneNumber"
                        variant="outlined"
                        error={
                          touched.phoneNumber && Boolean(errors.phoneNumber)
                        }
                        helperText={touched.phoneNumber && errors.phoneNumber}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Field
                        as={TextField}
                        fullWidth
                        label="Enter Email Address"
                        name="email"
                        variant="outlined"
                        type="email"
                        error={touched.email && Boolean(errors.email)}
                        helperText={touched.email && errors.email}
                      />
                    </Grid>

                    <Grid item xs={12}>
                    <FormControl sx={{ mt:"4px" , mb :"8px"  ,width: '100%' }} variant="outlined">
                    <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                    <OutlinedInput
                      id="outlined-adornment-password"
                      type={showPassword ? 'text' : 'password'}
                      {...getFieldProps("password")}
                      error={
                        touched.password && Boolean(errors.password)
                      } 
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label={
                              showPassword ? 'hide the password' : 'display the password'
                            }
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            onMouseUp={handleMouseUpPassword}
                            edge="end"
                          >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="Password"
          />
             {touched.password && Boolean(errors.password) && (
              <div style={{ color: "red" , marginLeft :"14px" , textAlign :"left",marginTop : "6px" , fontSize :"12px" }} >
                {errors.password}
              </div>
            )}
        </FormControl>
                    </Grid>

                    <Grid item xs={12}>
                    <Button
                    fullWidth
                    type="submit"
                  sx={{
                    background:
                      "linear-gradient(90deg, #4626FD 10%, #7861FF 100%)",
                    color: "white",
                    fontSize: { xs: "20px", md: "20px" },
                    textTransform: "none",
                    fontWeight: "100",
                    '&.Mui-disabled': {
                          color: '#fff',
                          pointerEvents :'all',
                          cursor :"not-allowed" ,
                          // filter : "brightness(50%)"
                        },
                  }}
                  disabled={!isValid || !dirty || isSubmitting}
                >
                 {isSubmitting ? "Submitting..." : "Sign Up"}
                </Button>
                    </Grid>
                  </Grid>
                </Form>
              )}
            </Formik>

            <Divider sx={{ mt: 3 }}>Or Sign Up with</Divider>

            <Grid
              container
              justifyContent="space-around" 
              sx={{margin :"18px 0px 27px"}} 
            >
              <Grid item sx={{padding :"10px" , boxShadow :"0px 1px 12px 0px rgba(0,0,0,0.09)"}}>
                <Image
                  onClick={handleGoogleSignIn}
                  src="/Img/google.svg"
                  alt="Google"
                  style={{ cursor: "pointer" }}
                  width={44}
                  height={44}
                />
              </Grid>
              <Grid item sx={{display : 'none' ,padding :"10px" ,boxShadow :"0px 1px 12px 0px rgba(0,0,0,0.09)"}}>
                <Image
                  src="/Img/apple.svg"
                  alt="Apple"
                  style={{ cursor: "pointer" }}
                  width={44}
                  height={44}
                />
              </Grid>
              <Grid item sx={{padding :"10px" , boxShadow :"0px 1px 12px 0px rgba(0,0,0,0.09)"}}>
                <Image
                  onClick={handlefacebookSignIn}
                  src="/Img/fb.svg"
                  alt="Facebook"
                  style={{ cursor: "pointer" }}
                  width={44}
                  height={44}
                />
              </Grid>
            </Grid>

            <Box sx={{ textAlign: "center", mt: 1 }}>
              <Typography variant="body2" sx={{fontSize :"16px"}}>
                Already have an account?{""}
                <Link style={{ color: "blue" }} href="/signin" passHref>
                  Login
                </Link>
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default SignUp;
