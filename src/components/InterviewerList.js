import React from "react";
import InterviewerListItem from "./InterviewerListItem";
import "styles/InterviewerList.scss"

export default function InterviewerList(props) {
  const mappedInterviewerItem = props.interviewers.map((oneInterviewer) => {
    return <InterviewerListItem 
      key={oneInterviewer.id} 
      name={oneInterviewer.name} 
      avatar={oneInterviewer.avatar} 
      selected={ oneInterviewer.id === props.value} 
      setInterviewer={(event) => props.onChange(oneInterviewer.id)}/>
    });
    
  return( 
    <section className="interviewers">
      <h4 className="interviewers__header text--light">Interviewer</h4>
      <ul className="interviewers__list"> {mappedInterviewerItem} </ul>
    </section>
  )
}

