'use client'
import EventCard from '@/component/Common/EventCard/page';
import { getUpcomingEvents } from '@/services/apiServices';
import { Box, Container, Grid2, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'

const UpcomingEvents = ({upcomingEvents}) => {

    

  return (
    <Box>
        <Container maxWidth="xl" sx={{
            padding : {xs:"0px", md:"56px 76px 0px"}
        }}>
            <Typography variant='h5' sx={{fontSize :{ xs:'20px' ,md:"30px"} ,marginBottom : {xs:"0px" , md:"16px"}, fontWeight :'700' ,textAlign :{ xs:"none" , md:'center'} , padding : {xs:"20px" ,md:"0"}  }}>Upcoming Events</Typography>
            <Typography sx={{fontSize :"22px" ,textAlign :'center' , marginBottom :'66px' , display :{xs:"none" , md:"block"}}}>Mark your calendar for these can't-miss upcoming events.</Typography>
           
           {
             upcomingEvents?.length > 0 ? (
              <Grid2 container rowGap={{xs:"10px" , md:"66px"}}   >
              {
                 upcomingEvents.length > 0 &&  upcomingEvents.map((event, index)=>{
                      return(<Grid2 key={index} item size={{xs :12 , md :4}}  sx={{ display :'grid',placeContent : {xs:"normal", md:'center'} , overflow:'hidden' , padding :{xs:'0px' , md :"10px"} ,height:{xs :'182px' , md:'auto'} ,  boxShadow :{ xs:"0px 0px 12px 1px rgba(173,163,163,0.75)" , md:"none"} }} >
                              <EventCard eventData={event}/>
                          </Grid2>
              )
              })
               }
              
               </Grid2>
             ):(
                <>
                  <Typography sx={{textAlign :'center' , fontSize :"18px"}}>No Featured Events Available</Typography>

                </>
             )
           }
            

        </Container>
    </Box>
  )
}

export default UpcomingEvents;
