import { FC, useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { successStringSelector } from "../state/selectors";
import ModalText from "./ModalText";

const SuccessStringCatcher: FC = () => {
  const successText = useRecoilValue(successStringSelector);

  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setChecked(!!successText);
  }, [successText]);

  return (
    <ModalText
      text={successText}
      containerClasses="bg-accent text-center z-50"
      checked={checked}
      setChecked={setChecked}
      modalID="success-modal"
    />
  );
};

export default SuccessStringCatcher;
