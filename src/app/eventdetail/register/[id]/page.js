'use client'
import Header from '@/component/Home/Header/page';
import React from 'react'
import EventRegisterform from './form/page';
import { useParams } from 'next/navigation';

const EventRegister = () => {
  const params = useParams();
  const {id} = params; 
  return (
         <>
         <Header/>
         <EventRegisterform eventId={id}/>
         </>
  )
}

export default EventRegister;