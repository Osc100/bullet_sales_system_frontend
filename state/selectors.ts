import { AxiosError } from "axios";
import { selector } from "recoil";
import { cleanErrorData } from "../utils/functions";
import { apiErrorsAtom, successStringAtom } from "./atoms";

export const apiErrorsSelector = selector<any>({
  key: "apiErrorsSelector",
  get: ({ get }) => get(apiErrorsAtom),
  set: ({ set }, err: AxiosError) => {
    if (err.response?.status === 400) {
      let cleanError = {};
      const responseData: any = err.response?.data;
      cleanError = cleanErrorData(responseData);
      console.log(cleanError);
      set(apiErrorsAtom, cleanError);
      //
    } else if (err.response?.status === 401) {
      set(apiErrorsAtom, {
        non_field_errors:
          "No tienes permiso para realizar esta acción, logueate en caso de ser necesario.",
      });
    } else {
      throw err;
    }
  },
});

export const successStringSelector = selector<string>({
  key: "successStringSelector",
  get: ({ get }) => get(successStringAtom),
  set: ({ set }, successString) => {
    set(successStringAtom, (prev) => {
      if (prev === successString) {
        successString += " ";
      }
      return successString;
    });
  },
});
