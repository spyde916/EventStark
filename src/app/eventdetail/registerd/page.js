'use client'
import Header from '@/component/Home/Header/page';
import { Box, Button, Container, Grid2, TextField, Typography } from '@mui/material';
import React from 'react'
import WestOutlinedIcon from '@mui/icons-material/WestOutlined';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const EventRegisterDone = () => {
    const router = useRouter();
  return (
         <>
         <Header/>
         <Box>
            <Container maxWidth="sm">
                <Box sx={{background :"#FBFBFB",padding :{xs:"50px 26px" ,md:"42px 56px"} ,display : "flex", flexDirection :"column" ,borderRadius :"4px", gap:{ xs:"26px",md:"39px"} ,margin :"20px 0px", boxShadow :"0px 0px 10px 0px rgba(0,0,0,0.10)"}}>
                <Container maxWidth="xl">
        <Grid2 container  gap={ { xs:"10px" , md:"30px"}} >
                <Grid2 size={12} sx={{display :"grid" , placeContent:"center" , position:"relative"}}>
                    <Box sx={{display :'flex' , flexDirection : 'column' , alignItems :'center' , gap:"24px"}}>
                    <Image width={95} height={95} src="/Img/tick.png" alt="tickImg"/>  
                    <Typography sx={{fontSize :"19px"}}>Thankyou for registering!</Typography>
                    </Box>
                </Grid2>
                <Grid2>
                  <Typography sx={{fontSize :{xs:"12px",  md:"19px"} ,color :"#333", lineHeight :{xs:"20px" ,md:"32px"} , textAlign :'center'}}>You have successfully registered and secured your spot. We look forward to seeing you there!</Typography>
                </Grid2>
        </Grid2> 
       </Container>
                </Box>
                <Box sx={{display : "grid" , placeItems : 'center'}}>
                    <Button onClick={()=>router.push("/")} startIcon={<WestOutlinedIcon sx={{color :"#4626FD"}}/>} sx={{color :"#4626FD"}}>Back to Home</Button>
                </Box>
         </Container>
         </Box>
         </>
  )
}

export default EventRegisterDone;