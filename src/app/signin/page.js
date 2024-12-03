"use client";
import { signIn } from "next-auth/react";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  TextField,
  Button,
  Typography,
  Grid2,
  Divider,
  Paper,
  Box,
  useTheme,
  useMediaQuery,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  CircularProgress,
  Backdrop,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import Image from "next/image";
import { useSnackbar } from "notistack";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const Login = () => {
  const router = useRouter();
  const {enqueueSnackbar ,closeSnackbar} = useSnackbar();
  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.down('md'));
  const [ AllFieldsFilled ,setAllFieldsFilled] = useState(false);
  const [loading , setLoading ] = useState(false);

  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event) => {
    event.preventDefault();
  }; 

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      password: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .required("Password is required"),
    }),
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      const result = await signIn("credentials", {
        redirect: false,
        identifier: values.email,
        password: values.password,
      });

      if (result.error) {
        if(result.error.includes("User not found")){
          setErrors({general : "User not found"})
          enqueueSnackbar("User not found" , {variant :"error"});
        }
        if(result.error.includes("Email is not verified")){
          setErrors({general : "Email is not verified."})
          enqueueSnackbar("Email is not verified" , {variant :"error"});
        }
        if(result.error.includes("Invalid Password!")){
          setErrors({general : "Invalid Password!"})
          enqueueSnackbar("Invalid Password!" , {variant :"error"});
        }
      } 
      else {
        enqueueSnackbar("Login Successful.." , {variant :"success"});
        setLoading(true);
        router.push("/dashboard");
      }

      setSubmitting(false);
    },
  });

  const handleGoogleSignIn = () => {
    signIn("google" , {callbackUrl : '/dashboard'});
    setLoading(true);
  };

  const handlefacebookSignIn = ()=>{
    signIn("facebook" ,{callbackUrl : '/dashboard'} );
    setLoading(true);
  }

  useEffect(() => {
    const formikData = formik.values;
    const allFilled = Object.values(formikData).every((value) =>  typeof value == 'boolean' ?  value === true : value !== "" );
    setAllFieldsFilled(allFilled);
  }, [formik.values]);

  return (
    <>

      
       <Backdrop
        sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
        open={loading}
      >
        <CircularProgress  sx={{color : "#7861FF"}} />
      </Backdrop>
     

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
      ></Box>
      <Grid2
          container
          justifyContent="center"
          sx={{
            margin : {xs:"50px 0px" , md : "15px 0px"},
            position : 'relative'
          }}
      >
        <Grid2 item  size={{xs:12 , md:6 , lg:4}} sx={{display :"grid", placeContent :"center",}}>
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
            <Box sx={{width : "100%" , marginTop :"20px" ,}} >
              <Typography
                variant="h4"
                sx={{
                  textAlign: "left",
                  fontSize:"26px"
                }}
                component="h1"
                
              >
                Welcome Back!
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  textAlign: "left",
                }}
                color="textSecondary"
              >
                Please log in to continue.
              </Typography>
            </Box>
  
            <form
              onSubmit={formik.handleSubmit}
              style={{  marginTop: "10px" }}
            >
              <TextField
                label="Email"
                type="email"
                margin="normal"
                fullWidth
                {...formik.getFieldProps("email")}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
              />
              {/* <TextField
                label="Password"
                type="password"
                margin="normal"
                fullWidth
                {...formik.getFieldProps("password")}
                error={
                  formik.touched.password && Boolean(formik.errors.password)
                }
                helperText={formik.touched.password && formik.errors.password}
              /> */}

<FormControl sx={{ mt:"16px" , mb :"8px"  ,width: '100%' }} variant="outlined">
          <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
          <OutlinedInput
            id="outlined-adornment-password"
            type={showPassword ? 'text' : 'password'}
            {...formik.getFieldProps("password")}
            error={
              formik.touched.password && Boolean(formik.errors.password)
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
             {formik.touched.password && formik.errors.password && (
              <div style={{ color: "red" , marginLeft :"14px" , marginTop : "6px" , fontSize :"12px" }} >
                {formik.errors.password}
              </div>
            )}
        </FormControl>

              <Typography onClick={()=> router.push("/resetpassword")} sx={{textAlign : 'right' ,color : "#FE182F" ,cursor :'pointer'}}>Forgot Password?</Typography>
              
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
                    mt :2,
                    '&.Mui-disabled': {
                          color: '#fff',
                          pointerEvents :'all',
                          cursor :"not-allowed" 
                        },
                    filter :  AllFieldsFilled ? "brightness(100%)" : "brightness(100%)",
                    cursor : AllFieldsFilled ? "pointer" :"not-allowed"
                  }}
                  disabled={!AllFieldsFilled}
                >
                 {formik.isSubmitting ? "Logging in..." : "Login"}
                </Button>
            </form>

            <Divider sx={{ mt: 3 , width :"100%"}} >Or Login with</Divider>

            <Grid2 container justifyContent="space-around"  sx={{margin :"18px 0px 27px" , width : "100%"}} >
              
            <Grid2 item sx={{padding :"10px" , boxShadow :"0px 1px 12px 0px rgba(0,0,0,0.09)" ,filter :"brightness(80%)" , '&:hover':{filter :"brightness(100%)"} }}>
                <Image
                  onClick={handleGoogleSignIn}
                  src="/Img/google.svg"
                  alt="Google"
                  style={{ cursor: "pointer" }}
                  width={44}
                  height={44}
                />
              </Grid2>
              <Grid2 item sx={{display : 'none', padding :"10px" ,boxShadow :"0px 1px 12px 0px rgba(0,0,0,0.09)" ,filter :"brightness(80%)" , '&:hover':{filter :"brightness(100%)"}}}>
                <Image
                  src="/Img/apple.svg"
                  alt="Apple"
                  style={{ cursor: "pointer" }}
                  width={44}
                  height={44}
                />
              </Grid2>
              <Grid2 item sx={{padding :"10px" , boxShadow :"0px 1px 12px 0px rgba(0,0,0,0.09)" ,filter :"brightness(80%)" , '&:hover':{filter :"brightness(100%)"}}}>
                <Image
                  onClick={handlefacebookSignIn}
                  src="/Img/fb.svg"
                  alt="Facebook"
                  style={{ cursor: "pointer" }}
                  width={44}
                  height={44}
                />
              </Grid2>
            </Grid2>

            <Typography sx={{display  :"flex" , alignItems : "center" , justifyContent : "center"}} variant="body2">
              Don’t have an account?{" "}
              <Link style={{color : "blue"}} href="/signup" passHref>
                Sign Up
              </Link>
            </Typography>
          </Box>
        </Grid2>
      </Grid2>
      </>

    </>
  );
};

export default Login;
