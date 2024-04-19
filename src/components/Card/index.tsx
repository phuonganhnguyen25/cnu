import { FC } from "react";

const Card: FC<any> = (props) => {
  return (
    <div className="w-full rounded overflow-hidden shadow-lg bg-slate-50 py-4">
      <div className="px-6 py-4">{props.children}</div>
    </div>
  );
};

export default Card;
