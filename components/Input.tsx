import { FC } from "react";
import { useRecoilValue } from "recoil";
import { apiErrorsAtom } from "../state/atoms";
import { popFromDict } from "../utils/functions";
import ErrorTag from "./ErrorTag";

interface InputProps
  extends React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  descriptiveText: string;
  extraLabel?: string;
}

const Input: FC<InputProps> = (props) => {
  const errors = useRecoilValue(apiErrorsAtom);
  let inputError: string | false = false;

  for (const [key, value] of Object.entries(errors)) {
    if (key === props.name) {
      inputError = value;
      break;
    }
  }
  let extraLabel: string;

  let [cleanedProps, descriptiveText] = popFromDict(props, "descriptiveText");
  [cleanedProps, extraLabel] = popFromDict(cleanedProps, "extraLabel");

  return (
    <div className="w-full form-control">
      <label className="pb-0 label">
        <span className={`label-text text-lg`}>{descriptiveText}</span>
        {extraLabel && (
          <label className="label-text text-warning">{extraLabel}</label>
        )}
      </label>

      <input
        {...cleanedProps}
        className={`w-full input input-bordered ${
          inputError && "border-error"
        }`}
      />
      {inputError && <ErrorTag errorText={inputError} />}
    </div>
  );
};

export default Input;
