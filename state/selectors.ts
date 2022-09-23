import axios, { AxiosError } from "axios";
import { selector } from "recoil";
import { apiErrorsAtom } from "./atoms";

export const apiErrorsSelector = selector<any>({
  key: "apiErrorsSelector",
  get: ({ get }) => get(apiErrorsAtom),
  set: ({ set }, err: AxiosError) => {
    if (err.response?.status === 400) {
      let cleanError = {};

      if (axios.isAxiosError(err)) {
        const responseData: any = err.response?.data;

        for (const [key, value] of Object.entries(responseData)) {
          cleanError[key] = value[0];
        }
      }
      set(apiErrorsAtom, cleanError);
    } else if (err.response?.status === 401) {
      set(apiErrorsAtom, {
        non_fields_error:
          "No tienes permiso para realizar esta acción, logueate en caso de ser necesario.",
      });
    } else {
      throw err;
    }
  },
});
