"use client";

import useLoginModel from "@/hook/useLoginModal";
import useRegisterModal from "@/hook/useRegisterModal";
import axios from "axios";
import { useCallback, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import { toast } from "react-toastify";
import { AiFillGithub } from "react-icons/ai";
import { signIn } from "next-auth/react";
import Button from "../Button";
import Heading from "../Heading";
import Input from "../inputs/Input";
import Modal from "./Modal";

type Props = {};

function RegisterModal({}: Props) {
  const registerModel = useRegisterModal();
  const loginModel = useLoginModel();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);

    axios
      .post("/api/register", data)
      .then(() => {
        toast.success("Register Successfully!");
        loginModel.onOpen();
        registerModel.onClose();
      })
      .catch((error) => {
        if (axios.isAxiosError(error) && error.response) {
          const status = error.response.status;
          switch (status) {
            case 400:
              toast.error("Email already registered");
              break;
            case 500:
              toast.error("Internal server error");
              break;
            default:
              toast.error("An unexpected error occurred");
          }
        } else {
          toast.error("Network error");
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const toggle = useCallback(() => {
    loginModel.onOpen();
    registerModel.onClose();
  }, [loginModel, registerModel]);

  const bodyContent = (
    <div className='flex flex-col gap-4'>
      <Heading title='Welcome to Cabin Fantasy' subtitle='Create an Account!' center />
      <Input
        id='email'
        label='Email Address'
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      <Input
        id='name'
        label='User Name'
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      <Input
        id='password'
        label='Password'
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
    </div>
  );

  const footerContent = (
    <div className='flex flex-col gap-4 mt-3'>
      <hr />
      <Button
        outline
        label='Continue with Google'
        icon={FcGoogle}
        onClick={() => signIn("google", { callbackUrl: process.env.NEXTAUTH_URL as string })}
      />
      <Button
        outline
        label='Continue with Github'
        icon={AiFillGithub}
        onClick={() => signIn("github", { callbackUrl: process.env.NEXTAUTH_URL as string })}
      />
      <div className='text-neutral-500 text-center mt-4 font-light'>
        <div>
          Already have an account?{" "}
          <span onClick={toggle} className='text-neutral-800 cursor-pointer hover:underline'>
            Log in
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <Modal
      disabled={isLoading}
      isOpen={registerModel.isOpen}
      title='Register'
      actionLabel='Continue'
      onClose={registerModel.onClose}
      onSubmit={handleSubmit(onSubmit)}
      body={bodyContent}
      footer={footerContent}
    />
  );
}

export default RegisterModal;
