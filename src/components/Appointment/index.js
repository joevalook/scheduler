import React from 'react';
import 'components/Appointment/styles.scss';
import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
import Form from './Form';
import Status from './Status';
import useVisualMode from 'hooks/useVisualMode';
import Error from './Error';
import Confirm from './Confirm';

// import { tsPropertySignature } from '@babel/types';

export default function Appointment (props) {
  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";
  const SAVING = "SAVING";
  const DELETING = "DELETING";
  const EDIT = "EDIT";
  const ERROR_SAVE = "ERROR_SAVE";
  const ERROR_DELETE = "ERROR_DELETE";
  const ERROR_INVALID = "ERROR_INVALID";
  const CONFIRM = "CONFIRM"
  //call mode hook to keep track of what kind of visual should be displayed
  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );
  function save(name, interviewer) {
    if (interviewer) {
    const interview = {
      student: name,
      interviewer
    };
    console.log(interview)
    transition(SAVING)
    console.log(props.id)
    props.bookInterview(props.id, interview)
      .then(() => {transition(SHOW)})
      .catch((err) => transition(ERROR_SAVE, true))
    }
    //stretch -- added a mode where the user will be shown an error if an interviewer is not chosen
    else{
      transition(ERROR_INVALID)
    }
  }
  function deleted() {
    console.log(props.id)
    transition(DELETING, true)
    props.deleteInterview(props.id)
      .then(() => {transition(EMPTY)})
      .catch((err) => transition(ERROR_DELETE, true))
  }
  function edit() {
    transition(EDIT)
  }
  function deleting() {
    transition(CONFIRM)
  }
  return(
    <article className="appointment">
      <Header time={props.time} />
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SHOW && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
          onDelete = {deleting}
          onEdit = {edit}
        />
      )}
      {mode === CREATE && (
        <Form
        onCancel={back}
        interviewers = {props.interviewers}
        onSave = {save}
      />
      )}
      {mode === SAVING && <Status  message="Saving"/>}
      {mode === CONFIRM && (
        <Confirm  
        message="Are you sure you would like to delete?"
        onConfirm={deleted}
        onCancel={back}
      />
      )}
      {mode === DELETING && <Status  message="Deleting"/>}
      {mode === EDIT && (
        <Form
        student={props.interview.student}
        interviewer={props.interview.interviewer.id}
        onCancel={back}
        interviewers = {props.interviewers}
        onSave = {save}
      />
      )}
      {mode === ERROR_DELETE && <Error 
                          message="Could not delete appointment."
                          onClose={back}/>}
      {mode === ERROR_SAVE && <Error 
                          message="Could not save appointment."
                          onClose={back}/>}
      {mode === ERROR_INVALID && <Error 
                          message="Invalid, you must select an interviewer to proceed"
                          onClose={back}/>}

    </article>
  )
}
