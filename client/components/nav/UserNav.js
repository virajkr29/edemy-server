import React from 'react'
import Link from 'next/link'


const UserNav = () => {
  return (
      <div className="nav flex-column nav-pills mt-2">
          <Link href="/user">
              <a className='nav-link active '>Dashboard</a>
          </Link>

          <Link href="/profile">
              <a className='nav-link active mt-1'>View Profile</a>
          </Link>
          <Link href="/instructor/course/create">
              <a className='nav-link active mt-1'>Create Courses</a>
          </Link>
          <Link href="/instructor/course/viewcourses">
              <a className='nav-link active mt-1'>View Courses</a>
          </Link>
          <Link href="/create-tutorials">
              <a className='nav-link active mt-1'>Create Tutorials</a>
          </Link>
          <Link href="/tutorials">
              <a className='nav-link active mt-1'>View Tutorials</a>
          </Link>
          <Link href="/create-blog">
              <a className='nav-link active mt-1'>Create Blogposts</a>
          </Link>
      </div>
  )
}

export default UserNav