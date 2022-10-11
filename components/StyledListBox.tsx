import { Listbox, Transition } from "@headlessui/react";
import { Fragment, MouseEventHandler } from "react";
import { HiCheck, HiChevronDown } from "react-icons/hi";
import { IoMdAddCircle } from "react-icons/io";
import { useRecoilValue } from "recoil";
import { apiErrorsAtom } from "../state/atoms";
import ErrorTag from "./ErrorTag";

interface StyledListBoxProps<T> {
  objKey: string;
  options: T[];
  selected: T;
  setSelected: (value: T) => void;
  descriptiveText: string;
  formKeyName: string;
  addable?: boolean;
  addAction?: MouseEventHandler;
  extraLabel?: string;
}

function StyledListBox<T>({
  objKey,
  options,
  selected,
  setSelected,
  descriptiveText,
  formKeyName,
  addable = false,
  addAction,
  extraLabel,
}: StyledListBoxProps<T>): JSX.Element {
  const errors = useRecoilValue(apiErrorsAtom);

  let inputError = "";

  for (const [key, value] of Object.entries(errors)) {
    if (key === formKeyName) {
      inputError = value;
      break;
    }
  }

  const canAdd = addable && addAction;

  return (
    <div className="flex-1 form-control">
      <label className="pb-0 pt-[0.2rem] label">
        <span className={`label-text text-lg`}>{descriptiveText}</span>
        {extraLabel && <span className="label-text">{extraLabel}</span>}
        {canAdd && (
          <IoMdAddCircle
            className="cursor-pointer text-success"
            onClick={addAction}
          />
        )}
      </label>
      <Listbox value={selected} onChange={setSelected}>
        <div className="relative mt-1">
          <Listbox.Button className="relative w-full py-2 pl-3 pr-10 text-left btn btn-accent">
            <span className="block truncate">
              {selected[objKey] ?? "Seleccione una opcion"}
            </span>
            <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <HiChevronDown className="w-5 h-5 " aria-hidden="true" />
            </span>
          </Listbox.Button>
          {inputError && <ErrorTag errorText={inputError} />}
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute z-20 w-full py-1 mt-1 overflow-auto rounded-md shadow-lg bg-stone-200 max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {options.map((option, optionIdx) => (
                <Listbox.Option
                  key={optionIdx}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                      active ? "bg-amber-100 text-amber-900" : "text-gray-900"
                    }`
                  }
                  value={option}
                >
                  {({ selected }) => (
                    <Fragment>
                      <span
                        className={`block truncate ${
                          selected ? "font-medium" : "font-normal"
                        }`}
                      >
                        {option[objKey]}
                      </span>
                      {selected && (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                          <HiCheck className="w-5 h-5" aria-hidden="true" />
                        </span>
                      )}
                    </Fragment>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
}

export default StyledListBox;
