'use client'
import { Box, Container, Divider, Grid2, Typography, useMediaQuery, useTheme } from "@mui/material";
import RoomIcon from '@mui/icons-material/Room';
import WatchLaterIcon from '@mui/icons-material/WatchLater';
import Image from "next/image";
import { useState } from "react";

const EventDetailBanner =({eventdata})=>{
    const [event , setEvent] = useState(eventdata);

  const theme = useTheme();  
  const isMd = useMediaQuery(theme.breakpoints.down('md'));

  const date = new Date(event?.event_date);
const formattedDate = date.toLocaleDateString('en-US', {
  weekday: 'short',   
  month: 'short',     
  day: 'numeric',
  timeZone: 'UTC'
});


const [hours, minutes, seconds] =  event.start_time.split(':');
const time = new Date();
time.setHours(hours, minutes, seconds);
const formattedTime = time.toLocaleTimeString('en-US', {
  hour: 'numeric',   
  minute: 'numeric', 
  hour12: true       
});

    return (
        <Box>
            <Container disableGutters maxWidth="xl">
                <Grid2 container>
                        <Grid2 items size={12}>
                            <Box sx={{display :"flex" , flexDirection :"column" , alignItems :"center",justifyContent :"center", gap:"10px", width :"100%" , height :{xs:"230px"  ,md:"490px"} , backgroundImage:`linear-gradient(rgba(0, 0, 0, 0.30), rgba(0, 0, 0, 0.30)) , url(${event?.cover_image ? event.cover_image : "/Img/default2.jpg"})` ,backgroundSize :"cover" , backgroundRepeat :'no-repeat',backgroundPosition :'center', borderRadius :"6px" }}>

                                <Box sx={{textAlign :'center'}}> 
                                <Box sx={{padding :"0px 10px"}}>
                                <Typography sx={{color :"#fff" ,fontSize :{ xs:"28px" ,md:'60px'} ,fontWeight :"600" , textWrap :"balance"}}>{event.event_name}</Typography>
                                </Box>
                                <Box sx={{padding :"0px 10px" , borderTop :"0.2px solid white"}}>
                                <Typography sx={{color :"#fff" , fontSize :{xs:"14px" , md:"26px"} , fontWeight :'100'}}>Hosted by- {event?.host_name ? event.host_name : "Not Found" }</Typography>
                                </Box>
                                </Box>
                               </Box>
                        </Grid2>
                        <Grid2 item size={12}>
                                <Box sx={{display :'flex' , flexDirection :{xs:"column" , md:"row"},padding:"10px 10px" , justifyContent :"center" , alignItems : 'center' , gap:{ xs:"6px",md:"15px"} , borderBottom : "0.3px solid #00000023"}}>
                                    <Box>
                                    <Box  sx={{display :'flex' , alignItems :'center', gap:'8px'}}>
                                        <Typography component={'span'}><RoomIcon sx={{width:{xs:"26px" , md:'40px'} , height:{xs:"26px" ,md:'40px'} ,color : "#4626FD"}}/></Typography>
                                        <Typography component={'span'} sx={{fontSize:{xs:"16px", md:"20px"} , color: "#4626FD"}}>{event.location}</Typography>
                                    </Box>
                                    </Box>
                                    <Box sx={{display :"flex" , gap:"0px 15px" ,alignItems :"center"}}>
                                    <Box  sx={{display :'flex' , alignItems :'center' ,gap:'8px', borderLeft :{xs:"none" , md:"1px solid #1E02C0"} , borderRight :"1px solid #1E02C0" ,padding : "0px 20px"}}>
                                        <Image alt="calenderLogo" width={ isMd ? 26 : 40} height={ isMd ?26 : 40} src={"/Img/calendar.svg"}/>
                                        <Typography component={'span'} sx={{fontSize:{xs:"16px", md:"20px"} , color : "#4626FD"}}>{formattedDate}</Typography>
                                    </Box>
                                    <Box  sx={{display :'flex' , alignItems :'center', gap:"8px"}}>
                                        <Typography component={'span'}><WatchLaterIcon  sx={{width:{xs:"26px" , md:"40px"} , height:{xs:"26px" , md:"40px"}, color : "#4626FD"}}/></Typography>
                                        <Typography component={'span'} sx={{fontSize:{xs:"16px", md:"20px"},color : "#4626FD"}}>{formattedTime}</Typography>
                                    </Box>
                                    </Box>
                                </Box>
                        </Grid2>
                </Grid2>
            </Container>
        </Box>
    )
}

export default EventDetailBanner;