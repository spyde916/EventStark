import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import { Box, Container, Divider, Grid2, Typography, useMediaQuery, useTheme } from "@mui/material";
import {useState} from 'react';
import Image from "next/image";
import CancelIcon from '@mui/icons-material/Cancel';

const Popup = ({openPopup ,setOpenPopup})=> {
  
  const handleClose = () => {
    setOpenPopup(false);
  };

  return (
    <>
      <Dialog
        open={openPopup}
        // onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
       <Container maxWidth="xl">
        <Grid2 container  gap={"30px"} sx={{padding : "30px"}}>
                <Grid2 size={12} sx={{display :"grid" , placeContent:"center" , position:"relative"}}>
                    <CancelIcon onClick={handleClose} sx={{position : "absolute" ,'&:hover':{transform : "rotate(90deg)"}, transition :"all 0.3s ease-in-out", color : "#8a8a8a" ,cursor :'pointer',  left :"103%" , top :"-20px" , width : "30px" , height :"30px"}} />
                    <Box sx={{display :'flex' , flexDirection : 'column' , alignItems :'center' , gap:"24px"}}>
                    <Image width={95} height={95} src="/Img/tick.png" alt="tick"/>  
                    <Typography sx={{fontSize :"19px"}}>Thankyou for registering!</Typography>
                    </Box>
                 
                </Grid2>
                <Grid2>
                  <Typography sx={{fontSize :"19px" ,color :"#333", lineHeight :"32px" , textAlign :'center'}}>You have successfully registered and secured your spot. We look forward to seeing you there!</Typography>
                </Grid2>
        </Grid2> 
       </Container>
      </Dialog>
    </>
  );
};

export default Popup;