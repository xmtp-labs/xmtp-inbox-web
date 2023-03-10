import React from "react";
import { format } from "date-fns";

export const DateDivider = ({ date }: { date: Date }): JSX.Element => (
  <div className="flex align-items-center items-center pb-8 pt-4">
    <div className="grow h-0.5 bg-gray-300/25" />
    <span className="mx-2 flex-none text-gray-300 text-sm font-bold">
      {format(date, "PPP")}
    </span>
    <div className="grow h-0.5 bg-gray-300/25" />
  </div>
);
