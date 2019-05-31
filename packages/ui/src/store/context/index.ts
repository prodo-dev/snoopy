import {Context, emptyContext} from "../../models";

export type State = Context;

export const initialState = (context: Context): State => context;

export default (state: State = emptyContext): State => state;
