import React from "react";
import DayList from "./DayList";
import "styles/Application.scss";
import Appointment from "./Appointment";
import useApplicationData from "hooks/useApplicationData";
import { getAppointmentsForDay, getInterviewersForDay, getInterview } from "helpers/selectors";



export default function Application(props) {
  // call useApplicationData hook 

  const {
    state,
    setDay,
    bookInterview,
    deleteInterview
  } = useApplicationData();

  //filter functions to get all appointments/interviewers for day
  const dailyAppointments = getAppointmentsForDay(state, state.day);
  const dailyInterviewers = getInterviewersForDay(state, state.day);
  //create an array of appointments using props from both dailyAppointments and dailyInterviewers
  const mappedAppointments = dailyAppointments.map((appointment) => {
    return (
      <Appointment
        key={appointment.id}
        id={appointment.id}
        time={appointment.time}
        interview={getInterview(state, appointment.interview)}
        interviewers={dailyInterviewers}
        bookInterview={bookInterview}
        deleteInterview={deleteInterview}
      />
    );
  });
  //format the appointments page and called mappedAppointments to generate appointment slots
  return (
    <main className="layout">
      <section className="sidebar">
        <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
          <DayList
            days={state.days}
            value={state.day}
            onChange={setDay}
          />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">
        {mappedAppointments}
        <Appointment key="last" time="5pm" />
      </section>
    </main>

  );
}
