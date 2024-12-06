import React from 'react'

const Header = () => {
  return (
    <section class="header">
    <nav>
      <a href="index.html"></a>
      <img src="images/logo.png" alt="" />
      <div class="nav-links" id="navLinks">
        <i class="fa fa-times" onclick="hideMenu()"></i>
        <ul>
          <li><a href="index.html">HOME</a></li>
          <li><a href="about.html" onclick="changeToAbout()">ABOUT</a></li>
          <li><a href="">COURSE</a></li>
          <li><a href="">BLOG</a></li>
          <li><a href="">CONTACT</a></li>
        </ul>
      </div>
      <i class="fa fa-bars" onclick="showMenu()"></i>
    </nav>
    <div class="text-box">
      <h1>World's Biggest University</h1>
      <p>
        Making website is now one of the easiest thing in the world. You just need
        to learn HTML, CSS,<br />Javascript and you are good to go.
      </p>
      <a class="hero-btn" href="">Visit Us To Know More</a>
    </div>
  </section>
  )
}

export default Header