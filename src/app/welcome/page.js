"use client";
import React, { useState } from "react";
import { 
  Button,
  Typography,
  Grid2,
  Divider,
  Box,
  useTheme,
  useMediaQuery,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import { useRouter } from "next/navigation";
import Image from "next/image";

const Welcome = () => {
  const router = useRouter();
  const theme = useTheme();
  const [loading , setLoading ] = useState(false);
  const isMd = useMediaQuery(theme.breakpoints.down('md'));

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
          margin :"50px 0px",
          position : 'relative'
        }}
      >
        <Grid2 item xs={12} md={6} lg={4} sx={{display :"grid", placeContent :"center",}}>
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
              <Box sx={{width :"100%" ,textAlign : 'center' ,marginBottom : "54px"}}>
               <Image width={isMd?266 : 146} height={isMd? 49 :27} src={"/Img/StarksWorld.svg"} alt="StarksWorld"/>
              </Box>
               <Box sx={{ marginBottom : '70px'  , textAlign :"center",alignItems :'center' , display :"flex" , flexDirection :'column' , gap : "18px"}}>
                   <Typography sx={{fontSize :"32px" , color : "#2604E8" , fontWeight :"400"}}>Welcome to StarksWorld</Typography>
                   <Typography sx={{fontSize :{xs :"18px" , md:"16px"} ,color :"#333333"}}>Post your events effortlessly. <br/> Let’s get started!</Typography>
               </Box>
               <Box sx={{width :"100%" , alignItems :'center' , display :"flex" , flexDirection :'column' , gap : "11px"}}>
               <Button
                  onClick={()=>{router.push("/signup") ,setLoading(true)}}
                  sx={{
                    background:
                      "linear-gradient(90deg, #4626FD 10%, #7861FF 100%)",
                    color: "white",
                    width: { xs: "90%", md: "90%" },
                    fontSize: { xs: "20px", md: "20px" },
                    textTransform: "none",
                    fontWeight: "100",
                  }}
                >
                 Sign Up
                </Button>
                    <Divider sx={{width : '100%' ,padding : " 0px 20px"}}>or</Divider>
                    <Button
                  
                  sx={{
                    background:
                      "linear-gradient(90deg, #4626FD 10%, #7861FF 100%)",
                    color: "white",
                    border :"2px solid",
                    width: { xs: "90%", md: "90%" },
                    fontSize: { xs: "20px", md: "20px" },
                    textTransform: "none",
                    fontWeight: "100",
                  }}
                  onClick={()=>{router.push("/signin") , setLoading(true)}}
                >
                  Login
                </Button>
               </Box>
          </Box>
        </Grid2>
      </Grid2>
    </>
  );
};

export default Welcome;
