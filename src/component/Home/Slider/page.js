"use client";
import { Box, Button, Container, Divider, Grid2, Typography } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Navigation , Pagination , Autoplay} from "swiper/modules";
import { BsArrowRightCircleFill } from "react-icons/bs";
import LoadingButton from '@mui/lab/LoadingButton';

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-coverflow";

import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import './slider.css';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
const Slider = ({events}) => {
  const theme = useTheme();
  const [ isRedirecting, setIsRedirecting] = useState(false);
  const router = useRouter();

  const isXs = useMediaQuery(theme.breakpoints.down('xs'));
  const isSm = useMediaQuery(theme.breakpoints.down('sm'));
  const isMd = useMediaQuery(theme.breakpoints.down('md'));
  const isLg = useMediaQuery(theme.breakpoints.down('lg'));
  const isXl = useMediaQuery(theme.breakpoints.down('xl'));

  const navigateTo = (path)=>{
       setIsRedirecting(true);
       router.push(path);
  }

  console.log("redirecting start");
  return (
    <>
      <Box className="gallary">
        <Container maxWidth="xl" sx={{backgroundColor: "#F8F8F8" , padding : {xs:"0",sm:"0 56px", md:"0 56px"}}}>
          <Grid2 container>
            <Grid2
              xs={12}
              sx={{ marginTop: "10px" }}
              className="swiper-container"
            >
              <Swiper
                
                autoplay={{delay :   isRedirecting ? 10000 : 5000 }}
                effect={"coverflow"}
                grabCursor={true}
                centeredSlides={true}
                slidesPerView={isMd ? 1 :2}
                speed={600}
                pagination={{clickable : true}}
                coverflowEffect={{
                  rotate: 0,
                  stretch: 0,
                  depth: isMd ? 0:200,
                  modifier: 1,
                  slideShadows: true,
                }}
                loop={true}
                modules={[EffectCoverflow, Pagination ,!isRedirecting && Autoplay]}
                className="mySwiper"
              >
                { events?.length > 0 && events.map((event,index) => {
                  return (
                    <>
                      <SwiperSlide 
                      key={index}
                      style={{backgroundImage : `url("${event?.cover_image ? event.cover_image : "/Img/default2.jpg"}")`,
                        backgroundPosition :'center' , 
                        backgroundSize :'cover',
                        backgroundRepeat :'no-repeat',
                        width: "666px",
                        height: isMd ? "230px" :"433px",
                        borderRadius :"6px",
                        overflow:'hidden'
                      }}
                      >
                        <Box sx={{
                          width :"100%" , 
                          height : "100%",
                          padding :{xs:'32px 20px' , md:'50px'},
                          backgroundColor :"#0003"
                        }}>
                          <Typography sx={{
                            fontSize :{xs:"26px" ,md:"40px"} ,
                            fontWeight :"800",
                            paddingLeft :'20px',
                            color : "white",
                            marginBottom : { xs:"30px",md:"34px"},
                            borderLeft: '6px solid transparent', 
                            borderImage: 'linear-gradient(to bottom, #7861FF 50% , #FFFFFF) 1',
                          }}>{event.event_name}</Typography>
                          <LoadingButton 
                           loading={isRedirecting ? true :false}
                          loadingPosition="end"
                          endIcon={<BsArrowRightCircleFill/>}
                          sx={{
                            color : 'white',
                            marginLeft :{ xs:0 ,md:'25px'},
                            padding : "11px 17px",
                            fontSize :{xs:"14px" , md:'20.68px'},
                            textTransform :'none',
                            width :{ xs:"165px" , md:"226px"},
                            height :{ xs:'34px',md:'50px'},
                            background:
                            "linear-gradient(90deg, #4626FD 10%, #7861FF 100%)",
                          }}
                          onClick={()=>navigateTo(`/eventdetail/${event.id}`)}
                          >Explore Event</LoadingButton>
                        </Box>
                        
                      </SwiperSlide>
                    </>
                  );
                })}
              </Swiper>
            </Grid2>
          </Grid2>
        </Container>
      </Box>
    </>
  );
};

export default Slider;
