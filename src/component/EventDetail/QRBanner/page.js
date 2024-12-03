'use client'
import { Backdrop, Box, Button, CircularProgress, Container, Divider, Grid2, Typography, useMediaQuery, useTheme } from "@mui/material";
import Image from "next/image";
import EastOutlinedIcon from "@mui/icons-material/EastOutlined";
import { useRouter } from "next/navigation";
import { useState } from "react";

const QRBanner =({eventdata ,id})=>{
    const [loading , setLoading ]= useState(false);
    const theme = useTheme();
    const router = useRouter();
    console.log("eventdata" , eventdata);

  const isMd = useMediaQuery(theme.breakpoints.down('md'));
    return (
        <Box>
              <Backdrop
                sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                open={loading}
            >
                <CircularProgress  sx={{color : "#7861FF"}} />
            </Backdrop>

            <Container disableGutters maxWidth="xl"  sx={{padding :{xs:"20px 20px" , md:"52px 70px"}}}>
                
                { eventdata.donations_qr_code && 
                    <Grid2 container sx={{padding : "25px" , background :"#F3F3F3" , marginBottom :"50px"}} gap={{xs:"16px" ,md:"0px 30px"}}>
                            <Grid2 size={{xs:12, md:8}} sx={{placeContent :'center' , textAlign :'center' }}>
                                <Typography sx={{fontSize:{xs:"16px" , md:"24px"} , color : "#333" , fontWeight:"500" , marginBottom :{xs:"5px" , md:'none'}}}>Support our mission to promote cultural arts by donating today!</Typography>
                                <Typography sx={{fontSize:{xs:"16px" , md:"20px"} , fontStyle:"italic" , color : "#333"}}>Scan the QR code to contribute.</Typography>
                            </Grid2>
                            <Grid2 size={{xs:12, md:3}} sx={{textAlign:{xs:'center' , md:'none'}}}>
                                        <Image width={220} height={220} src={`${eventdata?.donations_qr_code ? eventdata.donations_qr_code :"/Img/qr.png"}`} alt="qrImg" />
                            </Grid2>
                    </Grid2>
                }

                {
                            isMd && 
                            <Grid2 container size={12} sx={{display:'grid' , placeContent:"center"}}>
                                <Box sx={{display:'grid' , placeContent:"center"}}>
                                        <Button
                                                endIcon={<EastOutlinedIcon />}
                                                onClick={()=>{router.push(`/eventdetail/register/${id}`) ; setLoading(true)}}
                                                sx={{
                                                    background:
                                                    "linear-gradient(90deg, #4626FD 10%, #7861FF 100%)",
                                                    color: "white",
                                                    width: { xs: "270px", md: "300px" },
                                                    fontSize: { xs: "20px", md: "20px" },
                                                    textTransform: "none",
                                                    fontWeight: "100",
                                                }}
                                                >
                                                Register for free
                                        </Button>
                                        </Box>
                                    </Grid2>
                        }
            </Container>
        </Box>
    )
}

export default QRBanner;