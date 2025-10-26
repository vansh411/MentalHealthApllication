import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
// select tag
import { useState } from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import {useForm} from 'react-hook-form';
// textfield

import TextField from '@mui/material/TextField';
//icons

import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import FavoriteIcon from '@mui/icons-material/Favorite';
import NavigationIcon from '@mui/icons-material/Navigation';
//toastify
import { ToastContainer, toast } from 'react-toastify';

const MaterialUIDesign=()=>{
    const{
        register,
        handleSubmit,
        
    }=useForm()
   function onSubmit(controls){

   }
  function ShowToast(){
    toast('🦄 Wow so easy!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
        });


  }
     return(
        <div className='container'>
            <button type='button ' onClick={ShowToast}>show notification</button>
            <Box sx={{ '& > :not(style)': { m: 1 } }}>
      <Fab color="primary" aria-label="add">
        <AddIcon />
      </Fab>
      <Fab color="secondary" aria-label="edit">
        <EditIcon />
      </Fab>
      <Fab variant="extended">
        <NavigationIcon sx={{ mr: 1 }} />
        Navigate
      </Fab>
      <Fab disabled aria-label="like">
        <FavoriteIcon />
      </Fab>
    </Box>


     <h2>MatereialUI</h2>
     <hr/>

     <form onSubmit={handleSubmit(onSubmit)}>
    
      <Button type="submit"variant="contained">submit</Button>
      
    <hr/>

  {/*<Box sx={{ minWidth: 120 }}>*/}
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Age</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          
          label="Age"
         // onChange={handleChange}
         {...register('age')}
        >
          <MenuItem value={10}>Ten</MenuItem>
          <MenuItem value={20}>Twenty</MenuItem>
          <MenuItem value={30}>Thirty</MenuItem>
        </Select>
      </FormControl>
   { /*</Box>*/}
   <hr/>



    <div className='mb-3'>
    <TextField   {...register('firstname')}id="outlined-basic" label="First Name" variant="outlined" fullWidth/>
    </div>
      <div className='mb-3'>
      <TextField   {...register('lastname')} id="filled-basic" label="Last Name" variant="filled" fullWidth/>
      </div>
      <div className='mb-3'>
      <TextField   {...register('fullname')}id="standard-basic" label="Full Name" variant="standard"fullWidth />
      </div>
     </form>
     <ToastContainer
position="top-right"
autoClose={5000}
hideProgressBar={false}
newestOnTop={false}
closeOnClick
rtl={false}
pauseOnFocusLoss
draggable
pauseOnHover
theme="light"
transition: Bounce
/>
{/* Same as */}
<ToastContainer />
        </div>
    )
}
export default MaterialUIDesign;