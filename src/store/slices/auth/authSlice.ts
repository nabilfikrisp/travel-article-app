import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthResponse, AuthState, LoginRequestDTO, RegisterRequestDTO, User } from "./types";
import apiClient from "@/configs/axios-interceptor";
import { AxiosError } from "axios";
import Cookies from "js-cookie";

function generateInitialState(): AuthState {
  const credentialsCookie = Cookies.get("credentials");
  const credentialsObject = credentialsCookie
    ? (JSON.parse(credentialsCookie) as AuthResponse)
    : null;

  if (!credentialsObject) {
    return {
      user: null,
      status: "idle",
      error: null,
      jwt: null,
    };
  }

  return {
    user: credentialsObject.user,
    status: "idle",
    error: null,
    jwt: credentialsObject.jwt,
  };
}

const initialState: AuthState = generateInitialState();

export const mutateLogin = createAsyncThunk(
  "auth/mutateLogin",
  async (dto: LoginRequestDTO, { rejectWithValue }) => {
    try {
      const response = await apiClient.post<AuthResponse>("/auth/local", dto, {
        params: {
          populate: "*",
        },
      });
      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data?.error?.message || error.message);
      }
      return rejectWithValue("An unexpected error occurred");
    }
  }
);

export const mutateRegister = createAsyncThunk(
  "auth/mutateRegister",
  async (dto: RegisterRequestDTO, { rejectWithValue }) => {
    try {
      const response = await apiClient.post<AuthResponse>("/auth/local/register", dto, {
        params: {
          populate: "*",
        },
      });
      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data?.error?.message || error.message);
      }
      return rejectWithValue("An unexpected error occurred");
    }
  }
);

export const fetchGetMe = createAsyncThunk("auth/fetchGetMe", async (_, { rejectWithValue }) => {
  try {
    const response = await apiClient.get<User>("/users/me", {
      params: {
        "populate[articles][populate][user]": "*",
        "populate[comments]": "*",
      },
    });
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      return rejectWithValue(error.response?.data?.error?.message || error.message);
    }
    return rejectWithValue("An unexpected error occurred");
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    storeCredentialsCookie: (_, action: PayloadAction<AuthResponse>) => {
      const credentials = {
        user: action.payload.user,
        jwt: action.payload.jwt,
      };
      Cookies.set("credentials", JSON.stringify(credentials), { expires: 7, sameSite: "Strict" });
    },
    logout: (state) => {
      state.user = null;
      state.jwt = null;
      state.status = "idle";
      state.error = null;
      Cookies.remove("credentials");
      window.location.reload();
    },
  },
  extraReducers: (builder) => {
    builder
      // REGISTER
      .addCase(mutateRegister.pending, (state) => {
        state.status = "loading";
      })
      .addCase(mutateRegister.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.jwt = action.payload.jwt;
        authSlice.caseReducers.storeCredentialsCookie(state, action);
      })
      .addCase(mutateRegister.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })

      // LOGIN
      .addCase(mutateLogin.pending, (state) => {
        state.status = "loading";
      })
      .addCase(mutateLogin.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.jwt = action.payload.jwt;
        authSlice.caseReducers.storeCredentialsCookie(state, action);
      })
      .addCase(mutateLogin.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })

      // GET ME
      .addCase(fetchGetMe.pending, (state) => {
        state.error = null;
        state.status = "loading";
      })
      .addCase(fetchGetMe.fulfilled, (state, action) => {
        state.user = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchGetMe.rejected, (state, action) => {
        state.error = action.payload as string;
        state.status = "failed";
      });
  },
});

export const authSliceActions = authSlice.actions;
const authReducer = authSlice.reducer;
export default authReducer;
