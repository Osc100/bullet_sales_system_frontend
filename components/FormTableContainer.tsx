import { FC } from "react";

interface FormTableContainerProps {
  children: [JSX.Element, JSX.Element];
}

const FormTableContainer: FC<FormTableContainerProps> = (props) => {
  return (
    <div className="flex flex-col mx-[8%] h-screen pt-10">
      <div className="flex-1 w-full h-full">{props.children[0]}</div>
      <div className=" flex-[4] w-full h-full">{props.children[1]}</div>
    </div>
  );
};

export default FormTableContainer;
