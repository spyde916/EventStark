
"use client";
import { axiosInstance } from "@/services";
import { verifyOtp } from "@/services/apiServices";
import { resendOtpForVerification } from "@/services/apiServices";
import { Box, Typography, Button, TextField, Link, Grid, useTheme, useMediaQuery, Backdrop, CircularProgress } from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import { useSnackbar } from "notistack";
import { useState , useRef, useEffect } from "react";

const EmailVerification = () => {
  const [otp, setOtp] = useState(new Array(4).fill(""));
  const inputsRef = useRef([])
  const [otpResult , setOptResult] = useState('')
  const [isSubmitting , setIsSubmitting]  = useState(false);
  const router = useRouter();
 
  const params = useParams();
  const id = params?.data && params.data[1];
  const type = params?.data && params.data[0];
  const theme = useTheme();
  const {enqueueSnackbar , closeSnackbar} = useSnackbar();
  const isMd = useMediaQuery(theme.breakpoints.down('md'));
  const [ showMsg,setShowMSg] = useState(false);
  const [loading , setLoading ] = useState(false);

  console.log("params in verification" , params);


  
const isOtpFilled = otp.every((value) => value.trim() !== "");

  
  

  const handleChange = (element, index) => {
    const value = element.value;
    if (value.match(/^[0-9]$/)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (index < inputsRef.current.length - 1) {
        inputsRef.current[index + 1].focus();
      }
    }
  };



  const handleKeyDown = (event, index) => {
    if (event.key === "Backspace") {
      const newOtp = [...otp];

      newOtp[index] = "";
      setOtp(newOtp);

      if (index > 0 && !otp[index]) {
        inputsRef.current[index - 1].focus();
      }
    }
  };

  useEffect(()=>{
    const otpString = otp.join("");
    setOptResult(otpString); 
  } , [otp])

  const resetOtp = () => {
    setOtp(new Array(4).fill("")); 
    inputsRef.current[0]?.focus(); 
  };
  
  const handleSubmit = async()=>{
    try{
      setIsSubmitting(true);
      const res = await  verifyOtp(otpResult ,id);

      if(res.status == '200'){
        if(type == "account" ){
          setShowMSg(true);
          enqueueSnackbar("OTP verified successfully" , {variant :'success'});
        }else{
          enqueueSnackbar("OTP verified successfully" , {variant :'success'});
          router.push(`/newpassword/${id}`);
          setLoading(true);
        }
        setIsSubmitting(false);
      }
    }catch(error){
        enqueueSnackbar("OTP is expired or Invalid" ,{variant :'error'});
        setIsSubmitting(false);
        console.log(" otp verification failed");
        console.log("error" , error);
    }
    
  }
  const handleResendOtp = async()=>{

    try {
   
    const res = await resendOtpForVerification(id)
    if(res){
      enqueueSnackbar("Otp is sent to your email" ,{variant :'success'})
    }
    resetOtp()
    } catch (error) {
      console.log(error , "error from emailverification")
    }
    
  }
//   console.log(otpResult , "this is otp")

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
          backgroundImage: isMd ? "url(/Img/bgImg.png) ,url(/Img/bgBottom.png)" : "url(/Img/bgImg.png)",
          backgroundRepeat: "no-repeat , no-repeat",
          backgroundPosition: "top , bottom",
          backgroundSize: "contain , contain",
          position: "absolute",
        }}
      ></Box>
    <Box
       sx={{
        display:"grid", 
        placeContent :'center',
         margin : "50px 0px",
         position : 'relative'
       }}
    >
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
        
              <Typography
              variant="h5"
              sx={{ fontWeight: "bold", fontSize : "1.3rem" ,marginBottom: "1rem", color: "#6200ea" , display :{xs:"none" , md :"block"} }}
            >
              StarksWorld
            </Typography>
       
       

        <Box sx={{ textAlign: "left" }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", marginBottom: "10px" , color : "#333333" }}
          >
            Verify Your Email
          </Typography>
          <Typography variant="body2" sx={{ marginBottom: "20px" }}>
            We've sent an OTP to your email.
            <br></br>
            Please enter it below to verify your account.
          </Typography>
        </Box>
        <Grid container   justifyContent="center">
          {otp.map((value, index) => (
            <Grid item  key={index} sx={{direction : "row"}} xs={3}>
              <TextField
                autoComplete="off"
                inputRef={(el) => (inputsRef.current[index] = el)}
                variant="outlined"
                inputProps={{
                  maxLength: 1,
                  style: {
                    textAlign: "center",
                    fontSize: "20px",
                    padding: "10px",
                    height: "50px",
                  },
                }}
                value={value}
                onKeyDown={(e) => handleKeyDown(e, index)} 
                onChange={(e) => handleChange(e.target, index)}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "0px", // Customize border radius here
                    borderTopLeftRadius: index === 0 ? "4px" : "0px",
                    border: "1px solid #333333",
                    borderBottomLeftRadius: index === 0 ? "4px" : "0px",
                    borderRightWidth: index != otp?.length-1 ? "0px" : "1px",
                    borderTopRightRadius: index === otp?.length-1 ? "4px" : "0px",
                    borderBottomRightRadius: index === otp?.length-1 ? "4px" : "0px",
                    color : "#333"
                  },
                }}
              />
            </Grid>
          ))}
        </Grid>

        <Typography
          variant="body2"
          sx={{ marginTop: "10px", color: "#757575", cursor: "pointer" , textAlign : "left"}}
        >
          Didn't receive an OTP? <Link onClick={handleResendOtp} href="#" sx={{textDecoration: "none"}}>Resend it</Link>
        </Typography>
        <Button
                        fullWidth
                        variant="contained"
                        type="submit"
                        disabled={isSubmitting || !isOtpFilled }
                        onClick={handleSubmit}
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
                          // filter :  AllFieldsFilled ? "brightness(100%)" : "brightness(100%)",
                          // cursor : AllFieldsFilled ? "pointer" :"not-allowed"
                        }}
                      >
                        {isSubmitting ? 'Verifing...' : 'Verify'}
                      </Button>

                      {
        showMsg && <Box sx={{width: { xs: "100%", sm: "400px" ,md : "100%" },mt:"30px"}}> 
        <Box sx={{display :'flex', gap  :"5px"}}>
       <Box><CheckCircleIcon sx={{color :"#00ba00"}}/> </Box>
       <Box sx={{textAlign :'left'}}>
       <Typography sx={{fontSize  : {xs:"14px", md:"14px"}}}>Great! Your email is successfully verified. </Typography>
       <Typography sx={{fontWeight :"600" ,fontSize  : {xs:"14px" ,md:"14px"}}}>You’re all set!</Typography>
       </Box>
        </Box>
        <Box>
        <Button
               fullWidth
               sx={{
               background:
                 "linear-gradient(90deg, #4626FD 10%, #7861FF 100%)",
               color: "white",
               fontSize: { xs: "20px", md: "20px" },
               textTransform: "none",
               fontWeight: "100",
               mt :2,
             }}
             onClick={()=>{router.push("/signin") , setLoading(true)}}
           >
            Go to Login
           </Button>
        </Box>
                </Box>
      }


      </Box>

     
      
    </Box>
    </>
  );
};

export default EmailVerification;
