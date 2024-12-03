"use client";

import React, { useEffect, useState } from "react";
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
import Image from "next/image";
import Link from "next/link";

import { useParams, useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import { updatePassword } from "@/services/apiServices";

const validationSchema = Yup.object().shape({
    password: Yup.string()
    .required("Password is required")
    .matches(/[0-9]/, "Password must contain at least one number")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .min(8, "Password must be at least 8 characters long"),

    confirmPassword : Yup.string()
    .required("Confirm Password is required")
});

const NewPassword = () => {
  const router = useRouter();
  const theme = useTheme();
  const params = useParams();
  const id = params?.id && params.id[0];
  const [submiting , setSubmiting] = useState(false);


const isMd = useMediaQuery(theme.breakpoints.down('md'));

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setSubmiting(true);
    if(values.password !== values.confirmPassword){
            enqueueSnackbar("The password and confirm password fields must be the same." ,{variant :"warning"})
            setSubmiting(false);
            return;
        }

        const data = {
                     newPassword : values.password,
                     userId : id
                    }
    
    try {
      const response = await updatePassword(data);
      console.log("res from reset pass" , response);
      if (response.status == "200") {
        router.push(`/signin`);
        enqueueSnackbar("Password reset successfully" ,{variant :"success"});
      }
    } catch (error) {
      resetForm();
      enqueueSnackbar("Password reset failed" ,{variant :"error"});
      console.error("reset pass error", error);
    }
    setSubmitting(false);
    
  };

  

  return (
    <>
      <Box
        sx={{
          height: "100vh",
          width: "100vw",
          backgroundImage: {xs:"url(/Img/bgImg.png) ,url(/Img/bgBottom.png)" , md:"url(/Img/bgImg.png)"},
          backgroundRepeat: "no-repeat , no-repeat",
          backgroundPosition: "top , bottom",
          backgroundSize: "contain , contain",
          position: "absolute",
        }}
      >
      </Box>
      <Grid
        container
        justifyContent="center"
        sx={{
          margin : "50px 0px" ,
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
              <Typography variant="h5" >Create New Password</Typography>
              <Typography variant="body2" color="textSecondary" >
              Enter a new password to ensure your account remains secure
              </Typography>
            </Box>

            <Formik
              initialValues={{
                password : "",
                confirmPassword : ""
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ errors, touched, isSubmitting , isValid , dirty}) => (
                <Form>
                  <Grid container spacing={2}>
                    

                    <Grid item xs={12}>
                      <Field
                        as={TextField}
                        fullWidth
                        label="New Password"
                        name="password"
                        variant="outlined"
                        type="text"
                        error={touched.password && Boolean(errors.password)}
                        helperText={touched.password && errors.password}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Field
                        as={TextField}
                        fullWidth
                        label="Confirm Password"
                        name="confirmPassword"
                        variant="outlined"
                        type="password"
                        error={touched.confirmPassword && Boolean(errors.confirmPassword)}
                        helperText={touched.confirmPassword && errors.confirmPassword}
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
                          // filter : "brightness(50%)"
                        },
                  }}
                  disabled={!isValid || !dirty || isSubmitting}
                >
                 {submiting ? "Submitting..." : "Submit"}
                </Button>
                    </Grid>
                  </Grid>
                </Form>
              )}
            </Formik>

            
          </Box>
        </Grid>
      </Grid>

    </>
  );
};

export default NewPassword;
