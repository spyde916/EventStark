'use client'

import { Box, Grid2, Typography } from "@mui/material";
import Image from "next/image";
import React from "react";
import "./footer.css";
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

const Footer = () => {
  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.down('md'));
  return (
    <Box
      sx={{
        height: "auto",
        background: "linear-gradient(to bottom, #7861FF, #4626FD)",
        borderRadius: "24px 24px 0 0",
        marginTop: { xs: "41px", md: "165px" },
        padding:   {xs:"20px" ,  md:"98px 70px 10px"},
        position: "relative",
        boxShadow: "0px -2px 5px -1px rgba(0,0,0,0.4)",
      }}
    >
      <Grid2 container>
        <Grid2 container size={{ xs: 12, md: 12 }} gap={{xs:"15px 48px" , md:"0"}}>
          <Grid2
            item
            size={{ xs: 12, md: 4 }}
            sx={{
              display: "flex",
              alignItems: "center",
              paddingBottom: "10px",
              placeContent :{xs:'center' ,md:"auto"}
            }}
          >
            <Image width={!isMd ?225 :160} height={!isMd ? 41 :29} src={"/Img/footerlogo.png"} alt="starksworld" />
          </Grid2>
          <Grid2 item size={{ xs: 5, md: 4 }} sx={{ color: "#fff" }}>
            <Typography sx={{ marginBottom: "23px" }}>
              <Typography
                className="hover-underline"
                sx={{ display: "inline-block", fontSize :{sx:'12px' , md:'18px'} }}
                component={"span"}
              >
                Upcoming Events
              </Typography>
            </Typography>

            <Typography sx={{ marginBottom: "23px" }}>
              <Typography
                className="hover-underline"
                sx={{ display: "inline-block", fontSize :{sx:'12px' , md:'18px'} }}
                component={"span"}
              >
                About Us
              </Typography>
            </Typography>

            <Typography sx={{ marginBottom: "23px" }}>
              <Typography
                className="hover-underline"
                component={"span"}
                sx={{ display: "inline-block", fontSize :{sx:'12px' , md:'18px'} }}
              >
                Privacy Policy
              </Typography>
            </Typography>

            <Typography sx={{ marginBottom: "23px" }}>
              <Typography
                component={"span"}
                className="hover-underline"
                sx={{ display: "inline-block", fontSize :{sx:'12px' , md:'18px'} }}
              >
                T&C
              </Typography>
            </Typography>
          </Grid2>
          <Grid2 item size={{ xs: 5, md: 4 }} sx={{ color: "#fff" }}>
            <Typography sx={{ fontSize :{sx:'12px' , md:'18px'}, marginBottom: "23px" }}>
              Contact Us
            </Typography>
            <Typography sx={{ marginBottom: "23px" }}>
              {" "}
              <Image width={30} height={30} src={"/Img/address.png"} alt="locationlogo" />{" "}
            </Typography>
            <Typography sx={{ marginBottom: "23px" }}>
              {" "}
              <Image width={30} height={30} src={"/Img/call.png"} alt="phonelog" />{" "}
            </Typography>
          </Grid2>
        </Grid2>
        <Grid2
          item
          size={{ xs: 12, md: 12 }}
          sx={{
            textAlign: "center",
            color: "#fff",
            fontSize :{sx:'12px' , md:'18px'},
            marginTop: { xs:"20px" , md:"100px"},
          }}
        >
          © 2024 Starkworld. All rights reserved.
        </Grid2>
      </Grid2>
    </Box>
  );
};

export default Footer;
