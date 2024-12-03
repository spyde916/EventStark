import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import { Box, Container, Grid2, Typography } from '@mui/material';

 export const ConfirmDialog=({open , eventId , giveConfirmation})=>{
  
    const handleAction = (action)=>{
        giveConfirmation(action , eventId);
    }

  return (
    <>
      <Dialog
        open={open}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
       <Container maxWidth="xl">
        <Grid2 container gap="25px" sx={{padding : "40px"}}>
                <Grid2 size={12} sx={{ display : "flex" , justifyContent :"space-between" ,alignItems :'center'}}>
                    <Box sx={{ width :"100%",display :'flex' , flexDirection : 'column' , alignItems :'center' ,justifyContent :"center"}}>  
                    <Typography sx={{fontSize :"16px" , textAlign :'center' , fontWeight :"500"}}>Are you sure you want to delete this event ?</Typography>
                    <Typography sx={{fontSize :"14px"}}>You can't undo this event</Typography>
                    </Box>
                </Grid2>
                <Grid2 size={12}>
                  <Box sx={{display : "flex" , justifyContent :"space-evenly" ,alignItems :'center' ,gap: "10px"}}>
                  <Button
                    fullWidth
                    type="submit"
                  sx={{
                    background:
                      "linear-gradient(90deg, #4626FD 10%, #7861FF 100%)",
                    color: "white",
                    fontSize: { xs: "16px", md: "16px" },
                    textTransform: "none",
                    fontWeight: "100",
                    width : "100px"
                  }}
                  onClick={()=>handleAction("yes")}
                >
                Yes
                </Button>
                <Button
                    fullWidth
                    type="submit"
                  sx={{
                    background:
                      "linear-gradient(90deg, #4626FD 10%, #7861FF 100%)",
                    color: "white",
                    fontSize: { xs: "16px", md: "16px" },
                    textTransform: "none",
                    fontWeight: "100",
                    width : "100px"
                  }}
                  onClick={()=>handleAction("no")}
                >
                 No
                </Button>
                  </Box>
                </Grid2>
        </Grid2> 
       </Container>
      </Dialog>
    </>
  );
}

export const LogoutDialog = ({ open, giveConfirmationForLogout }) => {
  const handleAction = (action) => {
    giveConfirmationForLogout(action);
  };

  return (
    <>
      <Dialog
        open={open}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <Container maxWidth="xl">
          <Grid2 container gap="25px" sx={{ padding: "40px" }}>
            <Grid2 size={12} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography sx={{ fontSize: "16px", textAlign: "center", fontWeight: "500" }}>
                  Are you sure you want to log out?
                </Typography>
                <Typography sx={{ fontSize: "14px" }}>
                  You will need to sign back in to access your account.
                </Typography>
              </Box>
            </Grid2>
            <Grid2 size={12}>
              <Box sx={{ display: "flex", justifyContent: "space-evenly", alignItems: "center", gap: "10px" }}>
                <Button
                  fullWidth
                  type="submit"
                  sx={{
                    background: "linear-gradient(90deg, #4626FD 10%, #7861FF 100%)",
                    color: "white",
                    fontSize: { xs: "16px", md: "16px" },
                    textTransform: "none",
                    fontWeight: "100",
                    width: "100px",
                  }}
                  onClick={() => handleAction("yes")}
                >
                  Yes
                </Button>
                <Button
                  fullWidth
                  type="submit"
                  sx={{
                    background: "linear-gradient(90deg, #4626FD 10%, #7861FF 100%)",
                    color: "white",
                    fontSize: { xs: "16px", md: "16px" },
                    textTransform: "none",
                    fontWeight: "100",
                    width: "100px",
                  }}
                  onClick={() => handleAction("no")}
                >
                  No
                </Button>
              </Box>
            </Grid2>
          </Grid2>
        </Container>
      </Dialog>
    </>
  );
};



