import { User } from "@/types";
import axios from "axios";
import { createContext, useContext, useEffect, useReducer } from "react";

interface State {
  authenticated: boolean;
  user: User | undefined;
  loading: boolean;
}
// 하나의 페이지에서 같은 component를 쓸 때 부모자식 거치지 않고 context에서 왔다갔다~
const StateContext = createContext<State>({
  authenticated: false,
  user: undefined,
  loading: true,
});

// 유저 정보를 업데이트하거나 인증유무 업데이트 구현
const DispatchContext = createContext<any>(null);

interface Action {
  type: string;
  payload: any;
}

const reducer = (state: State, { type, payload }: Action) => {
  switch (type) {
    case "LOGIN":
      return {
        ...state,
        authenticated: true,
        user: payload,
      };
    case "LOGOUT":
      return {
        ...state,
        authenticated: false,
        user: null,
      };
    case "STOP_LOADING":
      return {
        ...state,
        loading: false,
      };
    default:
      throw new Error(`Unknown action type: ${type}`);
  }
};

// provider로 페이지내 component들을 감싸줘야 context를 사용할 수 있음.
// children이 _app.tsx의 <Component {...pageProps} />를 의미함
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, defaultDispatch] = useReducer(reducer, {
    user: null,
    authenticated: false,
    loading: true,
  });

  console.log("state", state);

  const dispatch = (type: string, payload?: any) => {
    defaultDispatch({ type, payload });
  };

  useEffect(() => {
    async function loadUser() {
      try {
        const res = await axios.get("/auth/me");
        dispatch("LOGIN", res.data);
      } catch (error) {
        console.log(error);
      } finally {
        dispatch("STOP_LOADING");
      }
    }
    loadUser();
  }, []);

  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state}>{children}</StateContext.Provider>
    </DispatchContext.Provider>
  );
};

export const useAuthState = () => useContext(StateContext);
export const useAuthDispatch = () => useContext(DispatchContext);
