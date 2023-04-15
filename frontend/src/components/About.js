import React, { Component } from 'react';
export default class About extends Component {
  render() {
    let resumeData = this.props.resumeData;
    return (
      <section id="about">
         <div className="row">

            <div className="three columns"></div>

            <div className="nine columns main-col">

               <h2>About Me</h2>
               <ul>
                 <li>
                   Expertise in developing Python automation scripts for ADAS AUTOSAR stack C/C++ code generation , ARXML parsing and Validation of ADAS Functional Requirements.
                 </li>
                 <li>
                   Development of Web Application for Mapping tool of AUTOSAR ports and ADAS Software Components (SwC) using Django RESTAPI and React JS and PostgreSQL Database.
                 </li>
                 <li>
                 Hands on Experience in development of Python automation testing framework for various ADAS Functional modules like sensor fusion, lane fusion, decision making.
                </li>
                <li>
                 Hands-on Experience with dSPACE Simulator-based Hardware in Loop Testing of Engine and Transmission ECU.
                 </li>
                 <li>
                   Hands-on Experience in Requirements Analysis, Test Cases Development and Automation XIL API and CAPL Scripting.
                 </li>
               </ul>

               <div className="row">

                  <div className="columns contact-details">

                  <h2>Contact Details</h2>
                  <p className="address">
       						<span>{resumeData.name}</span>
                     <br></br>
       						   <span>
                     {resumeData.address}
                    </span>
                    <br></br>
                    <span>{resumeData.website}</span>
       					   </p>
                  </div>
               </div>
            </div>
         </div>
      </section>
    );
  }
}