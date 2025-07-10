//page for both login and signup
import { AppWindowIcon, CodeIcon, Loader, Loader2, Text } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import {
  useLoginUserMutation,
  useRegisterUserMutation,
} from "@/features/api/authApi";
import { toast } from "sonner";
import { Navigate, useNavigate } from "react-router-dom";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const Login = () => {
  //useState to set the signup and login variables
  //signUpInput and loginInput is an object
  const [signUpInput, setSignUpInput] = useState({
    name: "",
    email: "",
    password: "",
    role:""
  });

  const [loginInput, setLoginInput] = useState({
    email: "",
    password: "",
  });

  //user state

  //register state(gives the value returned by useRegisterUserMutation hook)

  //here registerUser and loginUser are functions imported through these hooks from authApi
  const [
    registerUser,
    {
      data: registerData,
      error: registerError,
      isLoading: registerIsLoading,
      isSuccess: registerIsSuccess,
    },
  ] = useRegisterUserMutation();

  //login state
  const [
    loginUser,
    {
      data: loginData,
      error: loginError,
      isLoading: loginIsLoading,
      isSuccess: loginIsSuccess,
    },
  ] = useLoginUserMutation();

  const navigate = useNavigate();
  // function to set the state of login and signup variables.
  const changeInputHandler = (e, type) => {
    e.preventDefault();
    const { name, value } = e.target;
    if (type === "signup") {
      setSignUpInput({ ...signUpInput, [name]: value }); // Copies the previous state (signUpInput) and updates the field corresponding to name with the new value.
    }
    if (type === "login") {
      setLoginInput({ ...loginInput, [name]: value });
    }
  };
  
  //get the input data and perform signup and login
  const handleRegistration = async (type) => {
    const inputData = type === "signup" ? signUpInput : loginInput;
    const action = type === "signup" ? registerUser : loginUser;
    await action(inputData); 
  };

  useEffect(()=>{
    if(registerIsSuccess && registerData){
      toast.success(registerData.message || "Sign up successful")
    }
    
    if(registerError){
      toast.error(registerError.data.message || "Sign up failed")
    }

    if(loginIsSuccess && loginData){
      toast.success(loginData.message || "Sign up successful")
      navigate("/"); //if login successful navigate to home page.
    }

    if(loginError){
      toast.error(loginError.data.message || "Login failed")
    }

  },[loginIsLoading,registerIsLoading,loginData,registerData,loginError,registerError])


  return (
    <div className="flex items-center w-full justify-center mt-20">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Tabs defaultValue="login">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signup">SignUp</TabsTrigger>
            <TabsTrigger value="login">Login</TabsTrigger>
          </TabsList>

          <TabsContent value="signup">
            <Card>
              <CardHeader>
                <CardTitle>SignUp</CardTitle>
                <CardDescription>Create a new account</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    type="text"
                    name="name"
                    value={signUpInput.name}
                    onChange={(e) => changeInputHandler(e, "signup")}
                    placeholder="Enter your name"
                    required={true}
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="tabs-demo-username">Username</Label>
                  <Input
                    type="email"
                    name="email"
                    value={signUpInput.email} // this is setting the value of signupinput object's name field as the value entered by the user
                    onChange={(e) => changeInputHandler(e, "signup")}
                    placeholder="abc@gmail.com"
                    required={true}
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="tabs-demo-username">Password</Label>
                  <Input
                    type="password"
                    name="password"
                    value={signUpInput.password}
                    onChange={(e) => changeInputHandler(e, "signup")}
                    placeholder="Password"
                    required={true}
                  />
                </div>
                <div>
                  <RadioGroup className="flex gap-10"
                  value={signUpInput.role}
                  onValueChange={(value) =>
                    setSignUpInput((prev) => ({ ...prev, role: value }))
                  }
                >
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value="Student" id="student" />
                    <Label htmlFor="student">Student</Label>
                  </div>
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value="Instructor" id="instructor" />
                    <Label htmlFor="instructor">Instructor</Label>
                  </div>
                </RadioGroup>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  disabled={registerIsLoading}
                  onClick={() => handleRegistration("signup")}
                >
                  {registerIsLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please
                      Wait
                    </>
                  ) : (
                    "Register"
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>Login</CardTitle>
                <CardDescription>Log in to your account.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="tabs-demo-current">Email</Label>
                  <Input
                    type="email"
                    name="email"
                    value={loginInput.email}
                    onChange={(e) => changeInputHandler(e, "login")}
                    placeholder="abc@gmail.com"
                    required={true}
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="tabs-demo-new">Password</Label>
                  <Input
                    type="password"
                    name="password"
                    value={loginInput.password}
                    onChange={(e) => changeInputHandler(e, "login")}
                    placeholder="Password"
                    required={true}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  disabled={loginIsLoading}
                  onClick={() => handleRegistration("login")}
                >
                  {loginIsLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please
                      Wait
                    </>
                  ) : (
                    "Login"
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Login;
