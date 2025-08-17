import { Menu, School } from "lucide-react";
import React, { useEffect } from "react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import DarkMode from "@/DarkMode";
import { Separator } from "@/components/ui/separator";
import { Link, useNavigate } from "react-router-dom";
import {
  useLoadUserQuery,
  useLogOutuserMutation,
} from "@/features/api/authApi";
import { toast } from "sonner";
import { useSelector } from "react-redux";

const Navbar = () => {
  // const {userData} = useLoadUserQuery();
  // console.log(data);
  const { user } = useSelector((store) => store.auth);

  const [logOutuser, { data, isSuccess }] = useLogOutuserMutation();
  const navigate = useNavigate();

  const logoutHandler = async () => {
    await logOutuser();
  };
  useEffect(() => {
    //once the user is logged out redirect to the login page
    if (isSuccess) {
      toast.success(data?.message || "Logged out successfully");
      navigate("/login");
    }
  }, [isSuccess]);

  return (
    <div className="h-16 dark:bg-[#020817] bg-white border-b dark:border-b-gray-800 border-b-gray-200 fixed top-0 left-0 right-0 duration-300 z-10">
      {/* Desktop */}
      <div className="max-w-7xl mx-auto hidden md:flex justify-between items-center gap-10 h-full">
        {/* logo div */}
        <Link to="/">
          <div className="flex items-center gap-2">
            <School size={"30"} />
            <h1 className="hidden md:block font-extrabold text-2xl ml-2">
              E-learning
            </h1>
          </div>
        </Link>

        {/* User icon and dark mode icon */}
        {/* if there is an user show the drop down button or show login and signup buttons */}
        <div className="flex items-center gap-8">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                {/* Avatar or profile pic */}
                <Avatar>
                  <AvatarImage
                    src={
                      user.photoUrl ||
                      "https://i.pinimg.com/736x/15/0f/a8/150fa8800b0a0d5633abc1d1c4db3d87.jpg"
                    }
                  />
                  <AvatarFallback></AvatarFallback>
                </Avatar>

                {/* Dark and light mode button */}
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="start">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <Link to="my-learning">My Learning</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link to="profile">My Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logoutHandler}>
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuGroup>

                {user.role === "Instructor" && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => navigate("/admin/dashboard")}
                    >
                      Dashboard
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => navigate("/login")}>
                Login
              </Button>
              <Button onClick={() => navigate("/login")}>Signup</Button>
            </div>
          )}
          <DarkMode />
        </div>
      </div>

      {/* Mobile */}

      <div className="flex md:hidden items-center justify-between px-4 h-full">
        <h1 className="font-extrabold text-2xl"><Link to="/">E-learning</Link></h1>
        <MobileNavbar />
      </div>
    </div>
  );
};

//UI For mobile devices
const MobileNavbar = () => {
  const navigate = useNavigate();
  const [logOutuser, { data, isSuccess }] = useLogOutuserMutation();
  useEffect(() => {
    //once the user is logged out redirect to the login page
    if (isSuccess) {
      toast.success(data.message || "Logged out successfully");
      navigate("/login");
    }
  }, [isSuccess]);

  const role = "Instructor";
  const logoutHandler = async () => {
    await logOutuser();
  };
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          size="icon"
          className="rounded-full bg-gray-200"
          variant="outline"
        >
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent className=" flex flex-col">
        <SheetHeader className="flex flex-row items-center justify-between mt-6">
          <SheetTitle><Link to="/">E-learning</Link></SheetTitle>
          <DarkMode />
        </SheetHeader>

        <Separator className="mr-2" />
        <nav className="flex flex-col space-y-4">
          <span className="ml-4">
            <Link to="my-learning">My Learning</Link>{" "}
          </span>
          <span className="ml-4">
            <Link to="profile">My profile</Link>
          </span>
          <button className="ml-4" onClick={logoutHandler}>
            Log Out
          </button>
        </nav>
        {role === "Instructor" && (
          <SheetFooter>
            <SheetClose asChild>
              <Button
                type="submit"
                onClick={() => navigate("/admin/dashboard")}
              >
                Dashboard
              </Button>
            </SheetClose>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
};
export default Navbar;
