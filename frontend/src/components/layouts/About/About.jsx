import React from "react";
import "./About.css";
import { Button, Typography, Avatar } from "@material-ui/core";
import LinkedInIcon from "@material-ui/icons/LinkedIn";
import InstagramIcon from "@material-ui/icons/Instagram";
const About = () => {
  const visitInstagram = () => {
    window.location = "https://www.instagram.com/shubh.siroliya";
  };
  return (
    <div className="aboutSection">
      <div></div>
      <div className="aboutSectionGradient"></div>
      <div className="aboutSectionContainer">
        <Typography component="h1">About Us</Typography>

        <div>
          <div>
            <Avatar
              style={{ width: "10vmax", height: "10vmax", margin: "2vmax 0" }}
              src="https://res.cloudinary.com/dnjlkbxyf/image/upload/v1687533703/Profile/profile_w6dcx6.jpg"
              alt="Founder"
            />
            <Typography>Shubh Siroliya</Typography>
            <Button onClick={visitInstagram} color="primary">
              Visit Instagram
            </Button>
            <span>
              This is a sample wesbite made by Shubh Siroliya.
            </span>
          </div>
          <div className="aboutSectionContainer2">
            <Typography component="h2">Visit Us</Typography>
            <a
              href="https://www.linkedin.com/in/shubhsiroliya"
              target="blank"
            >
              <LinkedInIcon className="youtubeSvgIcon" />
            </a>

            <a href="https://www.instagram.com/shubh.siroliya" target="blank">
              <InstagramIcon className="instagramSvgIcon" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;