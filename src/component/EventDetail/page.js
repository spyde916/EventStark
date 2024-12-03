'use client'
import React, { useEffect, useState } from 'react'
import Header from '../Home/Header/page';
import EventDetailBanner from './Banner/page';
import EventOverview from './EventOverview/page';
import QRBanner from './QRBanner/page';
import MoreEvents from './MoreEvent/page';
import Footer from '../Home/Footer/page';
import { Box, CircularProgress, Typography, useMediaQuery, useTheme } from '@mui/material';
import Popup from './Popup/page';
import { useParams } from 'next/navigation';
import { getEventDetail, getFeaturedEvents } from '@/services/apiServices';
import ShowEventCards from '../Common/ShowEventCards/page';

const EventDetailComponent = () => {
  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.down('md'));
  const [openPopup, setOpenPopup] = useState(false);
  const [moreEvents , setMoreEvents] = useState([]);
  const [event , setEvents] = useState();
  const params =  useParams();
  const [res1 , setres1] = useState(false);
  const [res2 , setres2] = useState(false);
  const {id} = params;

  const getMoreEvents=async()=>{
    try{
       const res = await getFeaturedEvents();
       setres1(true);
       setMoreEvents(res.data);
       console.log("res from  getFeaturedEvents " , res);
    }catch(error){
      setres1(true);
        console.log("error in getFeaturedEvents" , error);
    }
}

  const getEvent=async()=>{
    try{
       const res = await getEventDetail(id);
       setres2(true);
       setEvents(res.data[0]);
       console.log("res from  getEvent " , res.data[0]);
    }catch(error){
      setres2(true);
        console.log("error in getEvent" , error);
    }
}


console.log("event" , event);
console.log("moreEvents" , moreEvents);

useEffect(()=>{
  getMoreEvents();
  getEvent();
}, []);



  return (
    <>
    { !isMd && <Popup openPopup={openPopup} setOpenPopup={setOpenPopup} /> }
    <Header/>
   
    
    {
      res1 && res2 ?(
          
        event  && moreEvents?.length > 0 ?(
          <>
           <EventDetailBanner eventdata={event} />
          <EventOverview eventdata={event}  setOpenPopup={setOpenPopup} />
          <QRBanner id={id} eventdata={event}/>
          { !isMd  && <ShowEventCards events={moreEvents} heading={"Find More Events"} subHeading={"Exclusive events selected just for you."}/>}
          <Footer/>
          </>
      ):(
          <Typography sx={{fontSize :"16px" ,textAlign :'center', marginTop :"50px"}}>Event Not Found</Typography>
      )

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

export default EventDetailComponent;
