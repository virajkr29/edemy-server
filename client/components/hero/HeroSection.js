import React from 'react'
import Link from 'next/link'
import { Context } from '../../context'
import { useContext } from "react";


const HeroSection = () => {
  const {state,dispatch} = useContext(Context)
  const {user} = state;
  return (
    <section id="hero" className="d-flex justify-content-center align-items-center">
    <div className="container position-relative" data-aos="zoom-in" data-aos-delay="100">

      <h1>We Offer free education to All,<br />Leading Tomorrow</h1>
      <h2>We offer courses from various expert instructors and open source as well</h2>
        <br />
      <Link href={user ? "/user":"/register"} ><a className="btn btn-primary btn-lg">Get Started</a></Link>
    </div>
  </section>
  )
}

export default HeroSection