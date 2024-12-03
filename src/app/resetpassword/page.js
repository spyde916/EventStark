"use client";

import React, { useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { EmailVerificationforPassword } from "@/services/apiServices";

import Image from "next/image";
import Link from "next/link";
import { useSnackbar } from "notistack";

import { useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
});

const ResetPassword = () => {
  const router = useRouter();
  const theme = useTheme();
  const {enqueueSnackbar , closeSnackbar} = useSnackbar();

const isMd = useMediaQuery(theme.breakpoints.down('md'));

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const response = await EmailVerificationforPassword(values);

      if (response.status == "200") {
        resetForm();
        router.push(`/emailVerify/resetpassword/${response.data.userId}`);
        enqueueSnackbar("Please check your email to verify your account" ,{variant :'success'})
      }
      if(response.status == "400"){
        enqueueSnackbar("invalid email , please enter an valid email" ,{variant :'error'})
        resetForm();
      }
    } catch (error) {
      console.error("Registration failed", error);
      enqueueSnackbar("Please check your email to verify your account" ,{variant :'error'})
    }
    setSubmitting(false);
  };

  

  return (
    <>
      <Box
        sx={{
          height: "100vh",
          width: "100vw",
          backgroundImage: isMd ? "url(/Img/bgImg.png) ,url(/Img/bgBottom.png)" : "url(/Img/bgImg.png)",
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
          margin : "50px 0px",
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
          

            <Box sx={{ textAlign: "left", margin: "35px 0px 20px" , gap : "10px" }}>
              <Typography variant="h5" >Reset Password</Typography>
              <Typography variant="body2" color="textSecondary" >
              Forgot your password? Let's help you securely regain access.
              </Typography>
            </Box>

            <Formik
              initialValues={{
                email: ""
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ errors, touched, isSubmitting , isValid, dirty }) => (
                <Form>
                  <Grid container spacing={2}>
                    

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
                        },
                  }}
                  disabled={!isValid || !dirty || isSubmitting}
                >
                 {isSubmitting ? "Submitting..." : "Submit"}
                </Button>
                    </Grid>
                  </Grid>
                </Form>
              )}
            </Formik>

            <Box sx={{ textAlign: "center", mt: 1 }}>
              <Typography variant="body2" sx={{fontSize :"16px"}}>
              Remember your password?{""}
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

export default ResetPassword;
