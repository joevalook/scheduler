import React from "react";
import DayListItem from "./DayListItem";

export default function DayList(props) {
  const mappedDayListItem = props.days.map((oneDay) => {
    return <DayListItem
      key={oneDay.id}
      name={oneDay.name}
      spots={oneDay.spots}
      selected={oneDay.name === props.value}
      setDay={props.onChange} />;
  });

  return (
    <ul>{mappedDayListItem}</ul>
  );
}
