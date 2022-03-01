import React, { useState, useEffect } from "react";
import DayList from "./DayList";
import "styles/Application.scss";
import Appointment from "./Appointment";
import axios from "axios";
import { getAppointmentsForDay, getInterviewersForDay, getInterview } from "helpers/selectors";



export default function Application(props) {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });
  
  const setDay = day => setState({ ...state, day });


  useEffect(() => {Promise.all([
    axios.get('http://localhost:8001/api/days'),
    axios.get('http://localhost:8001/api/appointments'),
    axios.get('http://localhost:8001/api/interviewers')
  ]).then((all) => {
    const days = all[0].data
    const appointments = all[1].data
    const interviewers = all[2].data
    setState(prev => ({...prev, days, appointments, interviewers}));
  })}, [])
  const dailyAppointments = getAppointmentsForDay(state, state.day)
  const dailyInterviewers = getInterviewersForDay(state, state.day)
  function bookInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    console.log(appointment)
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    
    return (axios.put(`/api/appointments/${id}`,{interview})
    .then((response) => setState({
      ...state,
      appointments
    })))
  }

  function deleteInterview(id) {
    const appointment = {
      ...state.appointments[id],
      interview: null
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    console.log(id)
    return axios.delete(`/api/appointments/${id}`)
    .then((response) => {
      setState({
      ...state,
      appointments
      })
      console.log(state.appointments)
    })
  }

  const mappedAppointments= dailyAppointments.map((appointment) => {
    const interview = getInterview(state, appointment.interview);
    
  
    return (
      <Appointment
        key={appointment.id}
        id={appointment.id}
        time={appointment.time}
        interview={interview}
        interviewers={dailyInterviewers}
        bookInterview={bookInterview}
        deleteInterview={deleteInterview}
      />
    );
  });
  console.log(state.appointments);
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
