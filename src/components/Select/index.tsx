"use client";

import { FC } from "react";

type IProp = {
  label: string | number;
  value: string | number;
  defaultValue: IProp["value"];
  data: Pick<IProp, "label" | "value">[];
  onChange: (value: IProp["value"]) => void;
};

const Select: FC<Pick<IProp, "data" | "defaultValue" | "onChange">> = ({
  defaultValue,
  data,
  onChange,
}) => {
  return (
    <select
      value={defaultValue}
      id={defaultValue.toString()}
      className="block appearance-none w-full border border-gray-300 py-2 px-3 pr-8 rounded leading-tight focus:outline-none focus:border-gray-500"
      onChange={(e) => {
        onChange(e.target.value);
      }}
    >
      {data.map((d) => (
        <option
          disabled={d.value === defaultValue}
          key={d.value}
          value={d.value}
        >
          {d.label}
        </option>
      ))}
    </select>
  );
};

export default Select;
