import { useState, useEffect } from "react";
import axios from "axios";

export default function useApplicationData(props) {
  //setup state hook
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });
  //create a function to change the day of the state
  const setDay = day => setState({ ...state, day });

  //fill the state with api data so changes will save in psql database
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

  //spot updater function called whenever an appointment is booked of cancelled
  function spotUpdater(state, appointments) {    
    let totalSpots = 0
    const foundDay = state.days.filter(d => d.name === state.day)[0]
    console.log("this is foundDay", foundDay)
    foundDay.appointments.forEach(appointmentId => {
      const appointment = appointments[appointmentId]
      if (!appointment.interview) {
        totalSpots++
      }
    })
    return totalSpots
  }

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
    //update spots only for whichever day bookInterview is called
    const days = state.days.map(day => { 
      if (day.name === state.day) {
        return {...day, spots: spotUpdater(state, appointments)}
      }
      return day
    })
    return (axios.put(`/api/appointments/${id}`,{interview})
    .then((response) => {
      setState({...state,appointments, days})
    })
    )
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
    //update spots only for whichever day deleteInterview is called
    const days = state.days.map(day => { 
      if (day.name === state.day) {
        return {...day, spots: spotUpdater(state, appointments)}
      }
      return day
    })
    return axios.delete(`/api/appointments/${id}`)
    .then((response) => {
      setState({...state, appointments, days})
    })
  }

  return {state, setDay, bookInterview, deleteInterview}
};
