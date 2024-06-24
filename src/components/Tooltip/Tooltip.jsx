import { parseISO, format } from "date-fns";

import './Tooltip.css';

function Tooltip({ meeting, children }) {

  let startDateTime = parseISO(meeting.startDatetime);
  let endDateTime = parseISO(meeting.endDatetime);

  return (
    <li className="flex items-center space-x-4 group rounded-xl focus-within:bg-gray-100 hover:bg-gray-100">
      {children}
      <div className="flex-auto">
        <p className="font-bold text-black">{meeting.title}</p>
        <p className="text-gray-900">{meeting.desc}</p>
        <p>
          <time dateTime={meeting.startDatetime}>
            {format(startDateTime, 'H:mm')}
          </time>{' '}
          -{' '}
          <time dateTime={meeting.endDatetime}>
            {format(endDateTime, 'H:mm')}
          </time>
        </p>
      </div>
    </li>
  );
}
export default Tooltip;