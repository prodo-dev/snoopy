export function fakeState<State>(
  initialState: State,
): [() => State, React.Dispatch<React.SetStateAction<State>>] {
  let state = initialState;
  const getState = () => state;
  const setState: React.Dispatch<React.SetStateAction<State>> = arg => {
    state = typeof arg === "function" ? (arg as any)(state) : arg;
  };
  return [getState, setState];
}
