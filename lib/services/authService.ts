import { SignupFormData } from "@/components/auth/SignupForm";
import axios from "@/lib/axios";
import { User } from "@/lib/context/AuthContext";

export const loginAPI = async (email: string, password: string): Promise<User> => {
  const res = await axios.post("/auth/login", { email, password });
  return res.data; 
};

export const signupAPI = async (data: SignupFormData): Promise<User> => {
  const res = await axios.post("/auth/signup", data);
  return res.data;
};