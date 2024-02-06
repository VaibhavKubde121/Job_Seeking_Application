
import React, { useContext } from 'react'
import { Context } from '../../main';
import { Navigate } from 'react-router-dom';
import HeroSection from './HeroSection'
import HowItWork from './HowItWork'
import PopularCategory from './PopularCategories'
import PopularCompany from './PopularCompany'

const Home = () => {
  const {isAuthorized}=useContext(Context);
  if(!isAuthorized){
    return <Navigate to={"/login"}/>
  }
  return (
    <section className='homePage page'>
      <HeroSection/>
      <HowItWork/>
      <PopularCategory/>
      <PopularCompany/>
    </section>
  );
}

export default Home