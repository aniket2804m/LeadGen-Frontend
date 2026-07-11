import React from 'react'
import Home from "../pages/Home/Home";
import Slide from "../pages/Home/Slide";
import HowWorks from "../pages/Home/HowWorks";

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

    </div>
  )
}

export default UserHome
