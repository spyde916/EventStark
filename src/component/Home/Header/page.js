"use client";

import React, { useEffect, useState } from "react";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  InputBase,
  Grid2,
} from "@mui/material";
import { alpha, styled } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import "./header.css";
import Image from "next/image";

import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import WestOutlinedIcon from '@mui/icons-material/WestOutlined';
import { useRouter } from "next/navigation";
import { search } from "@/services/apiServices";


const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: "0px 5px 5px",
  height: "100%",
  position: "absolute",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#7861FF",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  paddingLeft: `calc(1em + ${theme.spacing(4)})`,
  width: "100%",
}));

const Header = () => {
  const theme = useTheme();
  const router = useRouter();
  const [showMobSearch, setShowMobSearch] = useState(false);

  const isMd = useMediaQuery(theme.breakpoints.down("md"));
  const [searchResult , setSearchResult] = useState([]);

  const Search = styled("div")(({ theme }) => ({
    position: "relative",
    borderRadius: "6px",
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },

    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(1),
      width: "307px",
      border: "2px solid #7861FF",
    },

    [theme.breakpoints.down("md")]: {
      width: showMobSearch ? "85%" : "0%",
      border: "none",
      position: showMobSearch ? "absolute" : "relative",
      background: "#f0eaea",
      marginLeft: 15,
      "&:hover": {
        background: "#f0eaea !important",
      },
    },
  }));

  const searchAPI = async (searchTerm) => {
    try{
          const res = await search(searchTerm);
           setSearchResult(res.data.data);
          console.log("response of search result" , res.data.data);
    }catch(error){
         console.log(error);
    }
  };

  console.log("searchresult" , searchResult.data);

  let timer;
    const setSearchTerm = (searchTerm)=>{
      console.log("seatch" , searchTerm);
        clearTimeout(timer);
        timer = setTimeout(()=>{
          searchAPI(searchTerm);
        }, [5000]);
    };

  

  
   

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box
        sx={{
          borderRadius: { xs: "none", md: "0px 0px 12px 12px" },
          boxShadow: "0px -2px 8px 0px rgba(0,0,0,0.2)",
          padding: { xs: "10px 20px", md: "10px 70px" },
          marginBottom :"5px"
        }}
      >
        <Toolbar>
          <Box sx={{ flexGrow: 1 }}>
          
            {isMd ? (
                !showMobSearch && <Image onClick={()=>router.push("/")} style={{cursor :"pointer"}} width="160" height="29" alt="logo" src="/Img/StarksWorld.svg" />
            ) : (
              <Image onClick={()=>router.push("/")} style={{cursor :"pointer"}} width="210" height="30" alt="logo" src="/Img/StarksWorld.svg" />
            )}

          </Box>
          {isMd && showMobSearch && (
            <Search sx={{ padding: "5px", boxShadow: "none" }}>
             <IconButton onClick={()=>setShowMobSearch(false)} sx={{position :"absolute",color : "#7861FF" ,left :"-50px" ,top :"0px" ,}}> <WestOutlinedIcon sx={{width : "33px" ,height :"33px"}}/></IconButton>
              <SearchIconWrapper>
                <SearchIcon sx={{ width: "40px", height: "40px" }} />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search…"
                inputProps={{ "aria-label": "search" }}
                sx={{ paddingTop: "3px" }}
              />
            </Search>
          )}
          {isMd ? (
            //mobile search
            <Search
              sx={{
                padding: { xs: "0px 30px", md: "none" },
                display: showMobSearch ? "none" : "flex",
              }}
            >
              <SearchIconWrapper onClick={() => setShowMobSearch(true)}>
                <SearchIcon sx={{ width: "35px", height: "35px" }} />
              </SearchIconWrapper>
            </Search>
          ) : (
            //desktop search
            <Search
              sx={{
                padding: "5px",
                boxShadow: {
                  xs: "none",
                  md: "0px 1px 4px 2px rgba(120,97,255,0.2)",
                },
              }}
            >
              <SearchIconWrapper>
                <SearchIcon sx={{ width: "40px", height: "40px" }} />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search…"
                inputProps={{ "aria-label": "search" }}
                onChange={(e) =>{setSearchTerm(e.target.value)}}
                sx={{ paddingTop: "3px" }}
              />
            </Search>
          )}
        </Toolbar>
      </Box>
      {/* search star */}

      {/* {    searchResult?.length > 0 && 
      <Box sx={{
        width :"100%",
        display :"flex",
         justifyContent :"end",
         alignItems :"end",
         paddingRight : "94px",
         position :"absolute",
         zIndex :"1000",
         
      }}>
         <Box sx={{width :"307px" , background : "white" ,borderRadius :"6px",  border: "2px solid #7861ff" , overflowY :'scroll' , maxHeight :"300px"}}>
               
               { 
                 searchResult.length > 0 &&  searchResult.map((event)=>{
                return(
                  <>
                  <Grid2 container sx={{width : "100%" ,height : "60px" ,gap : "10px" , borderBottom :"1px solid #7861ff"  }}>
                        <Grid2 item >
                            <Image height="60" width="80" src={event?.cover_image ? event.cover_image : "/Img/detailbanner.png"}/>
                        </Grid2>
                        <Grid2 item alignContent={'center'} >
                             <Typography sx={{fontSize :"16px" , fontWeight :"600"}}> {event?.event_name ? event.event_name : "No Name" }</Typography>
                             <Typography sx={{fontSize :"14px"}}>{event?.location ? event.location : "No Place"}</Typography>
                        </Grid2>
               </Grid2>
                  </>
                )
               })
              }
               

         </Box>
      </Box>
       } */}

    </Box>
  );
};

export default Header;
