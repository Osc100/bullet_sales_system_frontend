import { FC, useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { successStringAtom } from "../state/atoms";
import ModalText from "./ModalText";

const SuccessStringCatcher: FC = () => {
  const successText = useRecoilValue(successStringAtom);

  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setChecked(!!successText);
  }, [successText]);

  return (
    <ModalText
      text={successText}
      containerClasses="bg-accent text-center"
      checked={checked}
      setChecked={setChecked}
      modalID="success-modal"
    />
  );
};

export default SuccessStringCatcher;
