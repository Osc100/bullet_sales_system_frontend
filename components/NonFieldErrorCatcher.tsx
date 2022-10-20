import { FC, useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { apiErrorsAtom } from "../state/atoms";
import ModalText from "./ModalText";

const NonFieldErrorCatcher: FC = () => {
  const errors = useRecoilValue(apiErrorsAtom);
  console.log(errors);

  let errorText = "";
  for (const [key, value] of Object.entries(errors)) {
    console.log(key);
    console.log(key === "non_field_errors");
    if (key === "non_field_errors") {
      errorText = value;
      break;
    }
  }

  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setChecked(!!errorText);
  }, [errorText, errors]);

  return (
    <ModalText
      text={errorText}
      containerClasses="bg-error z-50"
      checked={checked}
      setChecked={setChecked}
      modalID="non-field-error-modal"
    />
  );
};

export default NonFieldErrorCatcher;
