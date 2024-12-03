"use client"
import { SnackbarProvider } from "notistack"
const SnackBarProvider = ({children})=>{
    return(
        <SnackbarProvider maxSnack={1} autoHideDuration={5000} anchorOrigin={{vertical: 'top',horizontal: 'right'}}>
            {children}
        </SnackbarProvider>
    )
}
export default SnackBarProvider; 