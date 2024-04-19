import { FC } from "react";

const TCL_Row: FC<any> = (props) => {
  return <div className="flex flex-col md:flex-row my-5">{props.children}</div>;
};

export default TCL_Row;
