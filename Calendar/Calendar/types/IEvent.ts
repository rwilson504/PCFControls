import { Event } from "react-big-calendar";

//extend the event interface to include additional properties we wil use.
export interface IEvent extends Event {
  id?: string;
  color?: string;
}
