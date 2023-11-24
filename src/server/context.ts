import { User } from "next-auth";

export type Context = {
  user?: User;
};
// export async function createContext(opts: CreateNextContextOptions) {
//   return {
//     ,
//   };
// }
