import React from "react";
import classNames from "classnames";
import "styles/InterviewerListItem.scss";

export default function InterviewerListItem(props) {


  const interviewerButtonClass = classNames("interviewers__item", {
    "interviewers__item--selected": props.selected
  });
  return (
    <li className={interviewerButtonClass} onClick={props.setInterviewer}>

      <img
        className="interviewers__item-image"
        src={props.avatar}
        alt={props.name}
      />
      {props.selected && props.name}
    </li>
  );
}