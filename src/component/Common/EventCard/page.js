import { LoadingButton } from "@mui/lab";
import { Box, Button, Typography, useMediaQuery, useTheme } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { BsArrowRight } from "react-icons/bs";
import "./eventCard.css";

const EventCard = ({eventData}) => {
  const router = useRouter();

  const [event , setEvent] = useState(eventData);
  const [isRedirecting,setIsRedirecting] = useState(false);
 

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

const navigateTo = (path)=>{
  setIsRedirecting(true);
  router.push(path);
}

const theme = useTheme();

  // Define responsive width based on theme breakpoints
  const getResponsiveWidth = () => {
    if (theme.breakpoints.values.xs) return 22;
    if (theme.breakpoints.values.md) return 18;
    if (theme.breakpoints.values.lg) return 22;
    return 22; // default width
  };






  return (
    <Box
      sx={{
        width: {xs:"100%", md:"auto"},
        maxWidth :{xs:"100%" , md:"336px"},
        padding :{xs:"0px 20px" , md : 0},
        gap: { xs: "0px", md: 0 },
        height: { xs: "182px", md: "fit-content" },
        backgroundColor: { xs: "none", md: "#F9F9F9" },
        borderRadius: "6px",
        overflow: "hidden",
        display: { xs: "flex", md: "block" },
        flexDirection: "row-reverse",
        boxShadow: "rgba(0, 0, 0, 0.15) 0px 2px 6px 0px",
        alignItems :{xs:'center' , md:'none'},
        transition :"all 0.3s ease-in-out",
        '&:hover':{
          cursor :"pointer",
          scale : 1.02
        }
      }}
      onClick={()=>navigateTo(`/eventdetail/${event?.id}`)}
    >
      <Box
        sx={{
          width: { xs: "40%", md: "100%" },
          height: { xs: "120px", md: "230px" },
          background: `url(${event?.cover_image ? event.cover_image : "/Img/default2.jpg"})`,
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          borderRadius :{xs: "6px" , md:"none"}
        }}
      ></Box>
      <Box
        sx={{
          padding: { xs: 0, md: "15px" },
          width: { xs: "60%", md: "auto" },
        }}
      >
        <Box sx={{marginBottom :{xs:'5px' , md:"4px" ,  lg:0}}}>
          <Typography
            sx={{ fontSize: {xs:"18px" , md:"14px" , lg : "18px"}, fontWeight: "600", paddingBottom: "5px" , whiteSpace: "nowrap", overflow: "hidden"  ,textOverflow: "ellipsis" , maxWidth : "90%" , width : "90%"}}
          >
            {event?.event_name? event?.event_name : "Not found"}
          </Typography>
          <Typography sx={{ fontSize: {xs:"14px" , md:"12px",lg :"14px"}, fontWeight: "600" ,whiteSpace: "nowrap", overflow: "hidden"  ,textOverflow: "ellipsis" , maxWidth : "90%" , width : "90%" }}>
            Hosted by: {event.host_name}
          </Typography>
        </Box>
        <Box
          sx={{
            display: {xs:"block", md:"flex"},
            alignItems: "center",
            justifyContent: "space-between",
            gap :{xs:"30px" , md:"5px",lg:"30px"}
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" , gap:'5px' }}>
            <Image  width={getResponsiveWidth()} height={getResponsiveWidth()} src={"/Img/calender.svg"} alt="calenderLogo" />
            <Typography sx={{ fontSize: {xs:"14px" ,md:"10px" , lg:"12px"} }}>{formattedDate}</Typography>
            <Typography sx={{ fontSize: "14px" }}>|</Typography>
            <Typography sx={{ fontSize:{xs:"14px" ,md:"10px" , lg:"12px"} }}>{formattedTime}</Typography>
          </Box>
          <LoadingButton
            loading={isRedirecting ? true : false}
            loadingPosition="end"
            endIcon={<BsArrowRight />}
            sx={{
              fontSize: {xs:"16px" ,md:"10px" ,lg:"14px"},
              textAlign: "center",
              textTransform: "none",
              padding : "5px 0px ",
              color : "#3612FF",
              fontWeight :"600",
              '& .css-pyt3b0-MuiButton-endIcon' :{
                marginLeft : {xs:"8px" , md : "2px" , lg :"8px"}
              },
              '& .css-pyt3b0-MuiButton-endIcon>*:nth-of-type(1)':{
                fontSize :{xs:"18px" , md:"14px",lg : "18px"}
              },
              '& .css-gxw4l9-MuiCircularProgress-root':{
                width : {xs:"16px !important" , md:"10px !important" , lg :"16px !important"},
              height : {xs:"16px !important" , md:"10px !important" , lg :"16px !important"},
              },
              
            }}
            onClick={()=>navigateTo(`/eventdetail/${event?.id}`)}
          >
            View More
          </LoadingButton>
        </Box>
      </Box>
    </Box>
  );
};

export default EventCard;
