import React from 'react'
import { MenuFoldOutlined } from '@ant-design/icons'

const FeatureSection = () => {
  return (
    <>
       <section id="about" className="about">
      <div className="container" data-aos="fade-up">

        <div className="row">
          <div className="col-lg-6 order-1 order-lg-2" data-aos="fade-left" data-aos-delay="100">
              <img src="../../img/about.jpg" layout="fill" className="img-fluid" alt="no image found" />
          </div>
          <div className="col-lg-6 pt-4 pt-lg-0">
            <h1>Why You Should Choose Us</h1>

            <p className=" lead">
              We provide best resources to learn the latest Technologies and Core Computer Science fundamentals for free 
            </p>
            <p className=" lead">
              Or we charge a nominal fee for the premium services we offer.Following are the reasons why you should follow us :
            </p>

            <ul className=''>
              <li className=''>We offer concise courses with easy to understand content with animations and visualisations</li>
              <li className=''>Pocket friendly price. As little as you daily meal</li>
              <li className=''>Courses with interactive quizes,tests and assignments with many projects to build</li>
              <li className=''>Focus more on hands-on content rather than theoritical stuff</li>
            </ul>

            

          </div>
        </div>

      </div>
    </section>
    </>
  )
}

export default FeatureSection