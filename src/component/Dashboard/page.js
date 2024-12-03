import { Avatar, Backdrop, Box, Button, Chip, CircularProgress, Container, Grid2, IconButton, Stack, Switch, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, useMediaQuery, useTheme} from "@mui/material";
import "./dashboard.css";
import Image from "next/image";
import AddSharpIcon from '@mui/icons-material/AddSharp';
import { useEffect, useState } from "react";
import { deleteEvent, getMyEvents, updateEventStatus } from "@/services/apiServices";
import { useRouter } from "next/navigation";
import {ConfirmDialog} from "./Popup";
import { enqueueSnackbar } from "notistack";
import { signOut } from "next-auth/react";
import { LogoutDialog } from "./Popup";
import { GoChevronUp } from "react-icons/go";
import { LoadingButton } from "@mui/lab";



const DashboardCom = ()=>{
    const router = useRouter();
    const theme = useTheme();
    const isMd = useMediaQuery(theme.breakpoints.down('md'));
    const [viewDetails , setViewDetails] = useState(-1);

    const [myEvents , setMyEvents] = useState([]);
    const [user , setUser] = useState([]);
    const [inProcess , setInProcess] = useState(true);
    const [showDialog , setShowDialog] = useState(false);
    const [selectedEventId , setSelectedEventId] = useState("");
    const [showPopUpToLogout , setshowPopUpToLogout] = useState(false);
    

     const [loading , setLoading] = useState({ edit : "none" , status : false ,delete :"none", event :false, allEventLoading :"none" , createEvent : false});

    const tableColumn =  ["Name" , "Date" ,"Start Time" ,"End Time", "Draft/Publish" ,""];
    
    const fetchMyEvents = async()=>{
        try{
            setInProcess(true);
          const res = await getMyEvents();
          setMyEvents(res.eventDetail);
          setUser(res.userDetail[0]);
          setInProcess(false);
          console.log("res from fetchMyEvents" , res)
        }catch(error){
            console.log("error from fetchMyEvents" , error)
            setInProcess(false);
           return error;
        }
    }

    const handleDelete = (id)=>{
        setSelectedEventId(id);
        setShowDialog(true);
     }

     const deleteHelper =(id)=>{
        console.log("deleteHelper" , id);
        const updateEventData = myEvents.filter((event)=>{
            return event.id != id;
        });
        
        console.log("deleteHelper-updated event afrer dlt" , updateEventData);
            setMyEvents(updateEventData);
     }

    const delete_Event = async(id)=>{

        try{
            setLoading({...loading , delete : id});
          const res = await deleteEvent(id);
          if(res.status == "200"){
            setLoading({...loading , delete : "none"});
            deleteHelper(id);
          }
          enqueueSnackbar("Event deleted Successfully!" , {variant :"success"});
          console.log("res from deletevent" , res);
        }catch(error){
            setLoading({...loading , delete : "none"});
            console.log("error from deletevent" , error);
            enqueueSnackbar("Someting went wrong!" ,{variant :'error'});
           return error;
        }
    }

    const getConfirmation = (response , id)=>{
            setShowDialog(false);
            if(response == 'yes'){
                console.log("yes delete");
                delete_Event(id);
            }else{
                console.log("not delete");
            }
    }

    useEffect(()=>{
        fetchMyEvents();
    }, []);

    console.log("myEvents" , myEvents);
    
   
  const handleLogOut = ()=>{
     setshowPopUpToLogout(true);
   }



   const getConfirmationForLogout = (response)=>{
    setshowPopUpToLogout(false)
    if(response == 'yes'){
        signOut({callbackUrl  : '/'})
    }else{
        console.log("did not logOut")
    }
    }

    const statusChange = (id ,)=>{
        setMyEvents(prevEvents =>
            prevEvents.map(event =>
              event.id === id ? { ...event, status : event.status == "draft" ? "published" : "draft" } : event
            )
          );
    }

    const handleStatusChange = async(id , status)=>{
        console.log("statusID" ,id );
        console.log("status-status" ,status );

        const data = {
             id,
             status : status== true ? "published" : "draft"
        }
        try{
            setLoading({...loading , status : true});
            const res =  await updateEventStatus(data);
            if(res.status == 200){
                statusChange(id);
                setLoading({...loading , status : false});
            }  
            console.log("Status res" , res);
        }catch(error){
            enqueueSnackbar("Someting went wrong" , {variant :"error"});
            setLoading({...loading , status : false});
            console.log("Status error" , error);
        }
    }

    const eventStatus=(givenDate, inputTime , eventname)=>{
         // Get the current date and time
  const now = new Date();

  // Convert "9:00 PM" or similar time format to 24-hour time
  let [time, modifier] = inputTime.split(" ");
  let [hours, minutes] = time.split(":");

  // Ensure hours is a string before using padStart
  hours = parseInt(hours, 10);

  if (modifier === "PM" && hours !== 12) {
    hours += 12; // Convert to 24-hour time if PM
  }
  if (modifier === "AM" && hours === 12) {
    hours = 0; // Convert midnight to 00:00 in 24-hour format
  }

  // Create a new Date object from the input date, setting the time
  const dateTime = new Date(givenDate);
  dateTime.setHours(hours, minutes, 0, 0);

  
//   console.log("eventname" , eventname);
//   console.log("date" , givenDate);
//   console.log("time" ,inputTime);
//   console.log("dateTime" , dateTime);


        if (dateTime <= now) {
            // console.log("ended" );
            return "ended";
        } else {
            // console.log("not ended");
            return "notEnded";
        }
    }

    const navigateTo = (path , type ,value)=>{
        if(type == "edit"){
            setLoading({...loading , edit : value});
        }else if(type == "createEvent"){
            setLoading({...loading , createEvent : value});
        }else if(type == "event"){
            setLoading({...loading , event : true});
        }
        router.push(path);
   }

   const convertTime =(InputTime)=>{
    const [hours, minutes, seconds] =  InputTime.split(':');
    const time = new Date();
    time.setHours(hours, minutes, seconds);
    const formattedTime = time.toLocaleTimeString('en-US', {
    hour: 'numeric',   
    minute: 'numeric', 
    hour12: true       
    });

    return formattedTime;
    }


    

    return(
        <>
        <Backdrop
        sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
        open={loading.event || loading.status}
      >
        <CircularProgress  sx={{color : "#fff"}} />
      </Backdrop>
        <ConfirmDialog open={showDialog}  eventId={selectedEventId} giveConfirmation={getConfirmation}/>
        <LogoutDialog open={showPopUpToLogout} giveConfirmationForLogout = {getConfirmationForLogout} />
          <Box>
            <Container disableGutters maxWidth="xl">  
                <Grid2  container sx={{ height :{xs:"fit-content", md:'100vh'}, padding : 0 }}>
                    <Grid2 item size={{xs:12 , md:4.5 , lg : 3}} sx={{ background:"linear-gradient(to bottom, #4626FD 10%, #7861FF 100%)" , borderRadius :{xs:"0px 0px 24px 24px" , md:"0px 24px 24px 0px"},boxShadow : "1px 0px 5px 0px rgba(0,0,0,0.3)",height :{xs:"297px" , md:'100vh'},padding : {xs:"0px 20px", md:"0 28px"}}}>
                        <Grid2 sx={{marginBottom :{xs:"10px",md:"57px"}}}>
                            <Box sx={{display : 'flex' , alignItems :'center' , justifyContent :'space-between' , marginTop : {xs:"34px" , md:"74px"}}}>
                                <Typography onClick={()=>router.push("/")} sx={{color :'white' ,fontSize :'23.14px' , fontWeight : 800 , '&:hover' :{cursor :"pointer"}}}>StarksWorld</Typography>
                                <Box sx={{display : 'flex' , alignItems :'center' , justifyContent :'space-between' , gap: "10.62px"}}>
                                    <Avatar alt="profileImg" src="/Img/profile.png" sx={{width : {xs:"50px" , md:"54px"},height : {xs:"50px" , md:"54px"}}}/>
                                    <Image style={{cursor  : "pointer"}} onClick={handleLogOut} width="33" height="33" src={"/Img/logout.svg"} alt="logoutimg" />
                                </Box>
                            </Box>
                        </Grid2>
                        <Grid2>
                            <Typography sx={{fontSize : "25px" , marginBottom :"12.50px" , color :'white'}}>Hi {user?.full_name},</Typography>
                            <Typography sx={{fontSize : "17.50px" , color :'white' , fontWeight :100}} >Create, manage, and track all your events effortlessly.</Typography>
                            <Box sx={{display :"grid" ,marginTop :{ xs:"30px",md:'39px' , },placeContent:{xs:'center' , md:"start"}}}>
                            <LoadingButton 
                            loading={ loading.createEvent}
                            loadingPosition={'end'}
                            variant="contained" endIcon={<AddSharpIcon />}
                            sx={{background : "white" ,width :"226px", color : "#200B99" , textTransform :'none' , fontSize : "16px"}}
                            onClick={()=>navigateTo("/eventForm" , "createEvent" , true)}
                            >
                                Create New Event
                            </LoadingButton>
                                </Box>
                        </Grid2>
                        
                    </Grid2>
                    <Grid2  item  size={{ xs: 12 ,md:7.5 ,lg:9}} sx={{paddingTop  : {xs:"20px" ,md:"85px"} , height:{xs:'auto', md:"100vh"}}}>
                        <Typography sx={{padding : {xs:"0px 0px 17px 20px" ,md:'0px 0px 17px 43px '} , borderBottom:"1px solid #C7C7C7",fontSize : { xs:"20px" ,md:'24px'} , fontWeight : '600'}}>All Events</Typography>
                        
                    
                    {
                        inProcess ? (
                            <>
                            <Box sx={{width : "100%" , height : {xs:"30vh" ,md:"90%"} , display :"grid" , placeContent : 'center'}}>
                            <CircularProgress size={30}/>
                            </Box>
                            </>
                        ):(
                              <>
                                 {
                                      myEvents?.length < 1 ?
                                      (<Typography textAlign={'center'} sx={{marginTop :"60px" , fontSize :"14px" , lineHeight :"25px" , color : "#333333"}}>It looks like you haven't created any events yet. <br/>Start by creating your first event now!</Typography>)
                                      :(
              
                                      !isMd ? 
                                      (
                                      <TableContainer sx={{ flex: "1",  maxHeight: "78vh"}}>
                                      <Table stickyHeader aria-label="sticky table">
                                          <TableHead>
                                          <TableRow sx={{height:"48px", backgroundColor:"#F0F0F0" , color:"#000"}}>     
                                              {
                                                  // table column 
                                                  tableColumn.map((colName , index)=>{
                                                      return(
                                                          <TableCell key={index} sx={{ padding : `0px 16px 0px  ${index == 0 ? "43px" :"0px"}`, fontSize:"16px" ,  minWidth:"110px" ,backgroundColor:"#F0F0F0" }}>{colName}</TableCell>
                                                      )
                                                  })
                                              }
                                          </TableRow>
                                          </TableHead>                          
                                          {inProcess ? (
                                                  <>
                                                          <Box sx={{width :"100vw" , height :"100vh" ,  display :"grid" , placeContent : "center"}}>
                                                          <CircularProgress sx={{color :"#4626fd"}} />
                                                          </Box>
                                                  </>
                                          ):(                                    
                                          <TableBody >
              
                                              {  myEvents?.length > 0 && myEvents.map((event, index)=>{
                                                              
                                                              const date = new Date(event?.event_date);
                                                              const formattedDate = date.toLocaleDateString('en-US', {
                                                              weekday: 'short',   
                                                              month: 'short',     
                                                              day: 'numeric',
                                                              });
                                                              const startTime = convertTime(event.start_time);
                                                              const endTime = convertTime(event.end_time);
              
                                                              return(
                                                                  <TableRow key={index} sx={{'&:hover':{background:"rgba(240,240,240,0.3)"}}}>
                                                                      <TableCell sx={{fontSize :"15px" ,maxWidth :'250px',minWidth :"250px", lineHeight :'24px' ,  textWrap :"balance" , paddingLeft :"43px"}} ><Typography component={'span'} onClick={()=>navigateTo(`/eventdetail/${event.id}` ,"event" , event.id)} sx={{fontWeight :'600' , color : "#333",marginRight :"5px" ,'&:hover':{color : "#4626fd" , cursor : "pointer"} , display: '-webkit-box',WebkitLineClamp: 2,WebkitBoxOrient: 'vertical',overflow: 'hidden',textOverflow: 'ellipsis' }}>{event.event_name}</Typography></TableCell>
                                                                      <TableCell sx={{fontSize :"15px" ,maxWidth :'250px', lineHeight :'50px' , paddingLeft :"0px" }} >{formattedDate}</TableCell>
                                                                      <TableCell sx={{fontSize :"15px" ,maxWidth :'250px', lineHeight :'50px' , paddingLeft :"0px" }} >{startTime}</TableCell>
                                                                      <TableCell sx={{fontSize :"15px" ,maxWidth :'250px', lineHeight :'50px' , paddingLeft :"0px" }} >{endTime}</TableCell>
                                                                      <TableCell sx={{fontSize :"15px" ,maxWidth :'250px', lineHeight :'50px' , paddingLeft :"0px"  }} >
                                                                      {   
                                                                       loading.status == event.id ?
                                                                          ( <CircularProgress size="10px" /> ) : 
                                                                           (
                                                                        <>
                                                                        <Switch
                                                                         disabled={eventStatus(date ,endTime ,event.event_name) == "ended" ?true :false}  
                                                                         {...(eventStatus(date ,endTime ,event.event_name) != "ended"  &&  { checked:event.status == "draft" ? false :true} )}
                                                                          onChange={(e)=>handleStatusChange(  event.id ,e.target.checked)}
                                                                          inputProps={{ 'aria-label': 'controlled' }}
                                                                          />
                                                                          {/* { loading.status == event.id && <CircularProgress size="10px" />}  */}
                                                                          </>
                                                                           )
                                                                       }
              
                                                                  
                                                                      </TableCell>
                                                                      
                                                                      <TableCell sx={{paddingLeft :"43px"}}>   
                                                                      <Stack direction={'row'} gap={'0px 5px'} alignItems={'center'}>
                                                                      {
                                                                      
                                                                      eventStatus(date ,endTime ,event.event_name) == "ended" ?  
                                                                  ( <Chip label="Ended" sx={{color :"#C2C2C2" , borderColor :"#C2C2C2" , width : "92px"}} variant="outlined" />)
                                                                      : 
                                                                      (
                                                                              event?.status == "draft" ? <Chip label="Draft" sx={{color :"#FF9A26" , borderColor :"#FF9A26" ,width : "92px"}}variant="outlined" /> : <Chip label="Published" sx={{color : "#06BE68"  , borderColor:"#06BE68" ,width : "92px"}} variant="outlined" />
                                                                          )
                                                                          }
                                                                          <IconButton onClick={()=>handleDelete(event.id)}>{loading.delete == event.id ? <CircularProgress size="20px" sx={{color :"#4626fd"}} /> :<Image width={22} height={25} src={"/Img/Delete.svg"} alt="delete"/>}</IconButton>
                                                                          <IconButton onClick={()=>navigateTo(`/eventForm/${event.id}` , "edit" , event.id)}>{loading.edit == event.id ? <CircularProgress size="20px" sx={{color :"#4626fd"}} /> : <Image width={26} height={26} src={"/Img/Edit.svg"} alt="edit"/>}</IconButton>
                                                                          </Stack>
                                                                      </TableCell>
                                                                  </TableRow>
                                                              )
                                                              })
                                              }
                                                  
                                          </TableBody>
                                          )
                                          }
                                          </Table>
                                      </TableContainer>
                                      )
                                      :
                                      (
                                        <>
                                        <Box sx={{overflowY :"scroll"  , maxHeight :"90vh"}}>                                        {
                                          myEvents.map((event, index)=>{
                                              const date = new Date(event?.event_date);
                                                              const formattedDate = date.toLocaleDateString('en-US', {
                                                              weekday: 'short',   
                                                              month: 'short',     
                                                              day: 'numeric',
                                                              });    
              
              
                                                              const startTime = convertTime(event.start_time);
                                                              const endTime = convertTime(event.end_time);
                                                              
                                                  
                                              return (         
                                          <Grid2 key={index} item sx={{ paddingBottom : "6px" ,background : "#FCFCFC"}}>
                                                  <Stack direction={'column'} sx={{height : "100%" , transition :'height 1s ease-in-out', padding :"15px 5px 15px 20px" , marginTop :'5px', boxShadow :"0px 0px 5px 0px rgba(0,0,0,0.2)" ,maxHeight :"60vh" ,width : "100%"}}>
                                              
                                                  <Box width="100%" sx={{display : 'flex' ,gap :"5px" ,justifyContent :"space-between"}}>
                                                 
                                                  <Box sx={{width :"55%" ,paddingRight :"5px"}}>
                                                          <Typography ><Typography component={'span'} sx={{fontSize:"16px" , fontWeight :'600' ,color : "#333333" , paddingRight : "5px" , '&:hover':{color : "#4626fd" , cursor : "pointer"} ,display: '-webkit-box',WebkitLineClamp: 2,WebkitBoxOrient: 'vertical',overflow: 'hidden',textOverflow: 'ellipsis'  }} onClick={()=>navigateTo(`/eventdetail/${event.id}` ,"event" , event.id)}>{event.event_name}</Typography>{loading.event == event.id && <CircularProgress size={"14px"} sx={{color :"#4626fd" }}/> }</Typography>
              
                                                      { viewDetails == index &&
                                                          <Typography sx={{fontSize : "12px"}}>Hosted by: {event.host_name}</Typography>
                                                      } 
              
                                                          {viewDetails != index && <Button variant="text" sx={{padding :'6px 0' , textTransform  :'none'}}>
                                                          <Typography sx={{color : "#163DC7" , fontWeight :'600' , fontSize :'14px' }} onClick={()=>setViewDetails(index)}>View Details</Typography>
                                                          </Button>}
                                                  </Box>

                                                  <Box >
                                                      {
              
                                                          eventStatus(date ,endTime ,event.event_name) == "ended" ?  
                                                      ( <Chip label="Ended" sx={{color :"#C2C2C2" , borderColor :"#C2C2C2" ,width : "74px",height :"24px",fontSize : "10px" ,padding : 0}} variant="outlined" />)
                                                          : 
                                                          (
                                                                  event?.status == "draft" ? <Chip label="Draft" sx={{color :"#FF9A26" , borderColor :"#FF9A26" ,width : "74px",height :"24px",fontSize : "10px" ,padding : 0}}  variant="outlined" /> : <Chip label="Published" sx={{color : "#06BE68" , borderColor : "#06BE68" ,width : "74px",height :"24px",fontSize : "10px" ,padding : 0}}  variant="outlined" />
                                                              )
                                                      }
                                                  
                                                      <IconButton onClick={()=>handleDelete(event.id)}>
                                                      {loading.delete == event.id ? <CircularProgress size="20px" sx={{color :"#4626fd"}} /> :<Image width={22} height={25} src={"/Img/Delete.svg"} alt="delete"/>}
                                                      </IconButton>
                                                      <IconButton onClick={()=>navigateTo(`/eventForm/${event.id}` , "edit" , event.id)}>
                                                      {loading.edit == event.id ? <CircularProgress size="20px" sx={{color :"#4626fd"}} /> : <Image width={26} height={26} src={"/Img/Edit.svg"} alt="edit"/>}
                                                      </IconButton>
                                                  </Box>

                                                  </Box>
                                          
                                          { viewDetails == index &&
                                                  <Box sx={{display :'flex' ,  justifyContent :'space-between' ,alignItems: "center"  ,width :"95%"}}>       
                                                  <Box sx={{ display: "flex", alignItems: "center" ,gap:"5px"  }}>
                                                          <Image  width={22} height={22} src={"/Img/calender.svg"} alt="calenderLogo" />
                                                          <Typography sx={{ fontSize: {xs:"14px" ,md:"12px"} }}>{formattedDate}</Typography>
                                                          <Typography sx={{ fontSize: "14px" }}>|</Typography>
                                                          <Typography sx={{ fontSize: {xs:"14px" ,md:"12px"} }}>{startTime}</Typography>
                                                      </Box>
                                                      <Box>
                                                      
                                                      {
                                                          eventStatus(date ,endTime ,event.event_name) != "ended" && <Switch
                                                          checked={event.status == "draft" ? false :true}
                                                      onChange={(e)=>handleStatusChange(  event.id ,e.target.checked)}
                                                      size="small"
                                                      inputProps={{ 'aria-label': 'controlled' }}
                                                      />
                                                      }
                                                      
              
                                                      </Box>
                                                      <IconButton onClick={()=>setViewDetails(-1)}>
                                                          <GoChevronUp style={{fontSize : "30px" ,color : "#163dc7"}}/>
                                                      </IconButton>
                                                  </Box>
                                                  }
                                                  </Stack>
                                          </Grid2>
                                          )
                                          }
                                      )
                                        }
                                        </Box>
                                        </>
                                      )
                                  )
                                 }
                              </>  
                        )
                      }
                    

                    
                
                    </Grid2>
                </Grid2>
            </Container>
          </Box>
          </>
    );
}

export default DashboardCom;

