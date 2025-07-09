import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Course from "./Course";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { useLoadUserQuery, useUpdateUserMutation } from "@/features/api/authApi";
import { toast } from "sonner";

const Profile = () => {
  const { data, isLoading , refetch} = useLoadUserQuery(); // rtk query to load logged in user data 
  
  const [name, setName] = useState(""); //initially name is set empty
  const [profilePhoto, setProfilePhoto] = useState(""); //profile photo is empty initially

  const [
    updateUser,
    { data: updateUserData, isLoading: updateUserIsLoading, error, isSuccess, isError },
  ] = useUpdateUserMutation();    //the rtk mutation hooks provide certain parameters like isLoading, error, isSuccess ,etc.

  const onChangeHandler = (e) => {
    const file = e.target.files?.[0];
    if (file) setProfilePhoto(file);
  };

  useEffect(() => {
    if (data?.user?.name) setName(data.user.name);
  }, [data]);

//refetch the user profile each time the page is mounted
  useEffect(()=>{
    refetch();
  },[])
  
  useEffect(() => {
    if (isSuccess) {
      refetch();  // when the profile is updated refetch the data from useLoadUserQuery so that the updated name and images are displayd.

      toast.success(updateUserData?.message || "Profile updated successfully");
    }
    if (isError) {
      toast.error(error?.data?.message || "Cannot update profile");
    }
  }, [isSuccess, isError, updateUserData, error]); // runs when the profile is updated

  const updateUserHandler = async () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("profilePhoto", profilePhoto);
    await updateUser(formData); //formData is sent ot updateuser end point of rtk query and it updates the profile by making api calls with the backend
  };

  if (isLoading) return <ProfileSkeleton />;

  const myCourses = data?.user?.enrolledCourses || []; // the courses student is enrolled in

  
  
  return (
    <div className="max-w-4xl mx-auto px-4 mt-5">
      <h1 className="font-bold text-2xl text-center md:text-left ml-3">PROFILE</h1>
      <div className="flex flex-row">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 my-5">
          <div className="flex flex-col items-center">
            <Avatar className="h-24 w-24 md:h-32 md:w-32">
              <AvatarImage src={data?.user?.photoUrl || "https://i.pinimg.com/736x/15/0f/a8/150fa8800b0a0d5633abc1d1c4db3d87.jpg"} />
              <AvatarFallback>Profile photo</AvatarFallback>
            </Avatar>
          </div>
        </div>
        <div className="ml-10">
          <div className="mb-2">
            <h2 className="font-semibold text-gray-900 dark:text-gray-100">
              Name:{" "}
              <span className="font-normal text-gray-700 dark:text-gray-300">
                {data?.user?.name}
              </span>
            </h2>
          </div>
          <div className="mb-2">
            <h2 className="font-semibold text-gray-900 dark:text-gray-100">
              Email:{" "}
              <span className="font-normal text-gray-700 dark:text-gray-300">
                {data?.user?.email}
              </span>
            </h2>
          </div>
          <div className="mb-2">
            <h2 className="font-semibold text-gray-900 dark:text-gray-100">
              Role:{" "}
              <span className="font-normal text-gray-700 dark:text-gray-300">
                {data?.user?.role}
              </span>
            </h2>
          </div>

          <Dialog>
            <form>
              <DialogTrigger asChild>
                <Button>Edit Profile</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Edit profile</DialogTitle>
                  <DialogDescription>
                    Make changes to your profile here. Click save when you are done.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-3">
                    <Label htmlFor="name-1">Name</Label>
                    <Input
                      className="col-span-3"
                      type="text"
                      id="name-1"
                      name="name"
                      onChange={(e) => setName(e.target.value)}  //whenever input is changed set the name as the input value
                      value={name}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label>Profile Pic</Label>
                    <Input
                      type="file"
                      accept="image/*"
                      className="col-span-3"
                      onChange={onChangeHandler}          // on uploading the image set image as the uploades image using useState
                    />
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>

                  <Button disabled={updateUserIsLoading} onClick={updateUserHandler} type="submit">
                    {updateUserIsLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" /> Please Wait
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </form>
          </Dialog>
        </div>
      </div>

      <div>
        <h1 className="font-semibold text-lg">Courses you're enrolled in</h1>
        <div className="my-5">
          {myCourses.length === 0 ? (
            <p>You are not enrolled in any course.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {myCourses.map((course, index) => (
                <Course key={index} course={course} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ProfileSkeleton = () => (
  <div className="px-8 py-6 mt-25 ml-50 mr-50">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <Skeleton className="h-20 w-20 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-4 w-64" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
      <Skeleton className="h-10 w-32 rounded-md" />
    </div>

    <div className="mt-10">
      <Skeleton className="h-6 w-60 mb-6" />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((item) => (
          <div key={item} className="space-y-3">
            <Skeleton className="h-40 w-full rounded-md" />
            <Skeleton className="h-5 w-48" />
            <div className="flex items-center space-x-2">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-5 w-16 rounded-md" />
            </div>
            <Skeleton className="h-5 w-16" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default Profile;
