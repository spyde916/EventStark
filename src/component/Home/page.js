'use client'
import { Box, CircularProgress } from "@mui/material";
import Header from "./Header/page";
import Slider from "./Slider/page";
import UpcomingEvents from "./UpcomingEvents/page";
import FeaturedEvents from "./FeaturedEvents/page";
import Footer from "./Footer/page";
import { getFeaturedEvents, getUpcomingEvents } from "@/services/apiServices";
import { useEffect, useState } from "react";
import ShowEventCards from "../Common/ShowEventCards/page";

const HomeCom = () => {

  const [upcomingEvents , setUpcomingEvents] = useState([]);
  const [featuredEvents , setFeaturedEvents] = useState([]);
  const [sliderEvents , setSliderEvents] = useState([]);
  const [res1 , setRes1] = useState(false);
  const [res2 , setRes2] = useState(false);


    const fetchUpcomingEvents=async()=>{
        try{
           const res = await getUpcomingEvents();
           setRes1(true);
           setUpcomingEvents(res.data);
           setSliderEvents(res.Events);
           console.log("res from get upcommig " , res);
        }catch(error){
            console.log("error in get upcoming" , error);
        }
    }

    const fetchFeaturedEvents=async()=>{
        try{
           const res = await getFeaturedEvents();
           setRes2(true);
           setFeaturedEvents(res.data);
           console.log("res from  getFeaturedEvents " , res);
        }catch(error){
            console.log("error in getFeaturedEvents" , error);
        }
    }

    useEffect(()=>{
        fetchUpcomingEvents();
        fetchFeaturedEvents();
    }, []);

    console.log("upcoming events" , upcomingEvents);
    console.log("getFeaturedEvets" , featuredEvents);
    console.log("sliderEvets" , sliderEvents);

    

  return (
    <>
    <Header/>
    { res1 && res2 ?
    (
        <>

        {
          sliderEvents?.length > 4 &&  <Slider events={sliderEvents}/>
        }       
       <ShowEventCards events={upcomingEvents} heading={"Upcoming Events"} subHeading={"Mark your calendar for these can't-miss upcoming events."}/>
       <ShowEventCards events={featuredEvents} heading={"Featured Events"} subHeading={"Exclusive events selected just for you."}/>
       <Footer/>
       </>
       )
       :
       (
          <>
           
                        <Box sx={{width :"100vw" , height :"80vh" ,   display :"grid" , placeContent : "center"}}>
                        <CircularProgress sx={{color :"#4626fd"}} />
                        </Box>
                      
          </>
       )
      
    }
    
    </>
  )
}

export default HomeCom;
