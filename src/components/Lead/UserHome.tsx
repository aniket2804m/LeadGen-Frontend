import React from 'react'
import Home from "../pages/Home/Home";
import Slide from "../pages/Home/Slide";
import HowWorks from "../pages/Home/HowWorks";
import Feature from "../pages/Home/Feature";
import Platform from "../pages/Home/Platform";
import Pricing from "../pages/Home/Pricing";

const UserHome = () => {
  return (
    <div className="mt-10">
      
      <section id="home">
      <Home />
      </section>

      <Slide />

<section id="howwork"> 
  <HowWorks />
</section>

<section id="feature"> 
  <Feature />
</section>

<section id="platform"> 
  <Platform />
</section>

<section id="pricing"> 
  <Pricing />
</section>

    </div>
  )
}

export default UserHome
