import { FC } from "react";
import { FiAlertCircle } from "react-icons/fi";

interface ErrorTagProps {
  errorText: string;
}

const ErrorTag: FC<ErrorTagProps> = ({ errorText }) => {
  return (
    <label className="relative flex items-center gap-1 pt-1">
      <FiAlertCircle className=" text-error" />
      <span className="text-sm label-text text-error">{errorText}</span>
    </label>
  );
};

export default ErrorTag;
