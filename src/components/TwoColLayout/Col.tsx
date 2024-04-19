import { FC } from "react";

const TCL_Col: FC<{ side: "left" | "right"; children: React.ReactNode }> = (
  props
) => {
  return props.side === "left" ? (
    <div className="w-full md:w-1/2 pr-0 md:pr-2 mb-4 md:mb-0">
      {props.children}
    </div>
  ) : (
    <div className="w-full md:w-1/2 pl-0 md:pl-2">{props.children}</div>
  );
};

export default TCL_Col;
