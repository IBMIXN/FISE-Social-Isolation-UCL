import { useRouter } from "next/router";
import { mutate } from "swr";
import { Formik, Field } from "formik";

import { useUser } from "../lib/hooks";

import {
  Text,
  Heading,
  FormErrorMessage,
  FormLabel,
  FormControl,
  Input,
  Button,
  Stack,
  useToast,
} from "@chakra-ui/core";

import { Container } from "../components/Container";
import { Nav } from "../components/Nav";
import { Main } from "../components/Main";
import { Footer } from "../components/Footer";

const NameForm = ({ router }) => {
  const toast = useToast();

  function validateEmail(value) {
    let error = "";
    if (!value) {
      error = "Required";
    } else if (value.length > 50) {
      error = "Must be 50 characters or less";
    } else if (
      !/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test(
        value
      )
    ) {
      error = "Please enter a valid email address";
    }
    return error;
  }

  function validatePassword(value) {
    let error = "";
    if (!value) {
      error = "Required";
    } else if (value.length < 8) {
      error = "Must be at least 8 characters";
    }
    return error;
  }

  const handleFormSubmit = async (values, actions) => {
    try {
      values.username = values.email;
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (res.status === 200) {
        mutate("/api/user");
        // router.replace("/dashboard");
      } else {
        throw new Error(await res.text());
      }
    } catch (error) {
      console.error("An unexpected error happened occurred:", error);
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Formik
      initialValues={{ email: "", password: "" }}
      onSubmit={handleFormSubmit}
    >
      {({
        isSubmitting,
        getFieldProps,
        handleChange,
        handleBlur,
        handleSubmit,
        values,
      }) => (
        <form onSubmit={handleSubmit}>
          <Field name="email" validate={validateEmail}>
            {({ field, form }) => (
              <FormControl isInvalid={form.errors.email && form.touched.email}>
                <FormLabel htmlFor="email">Your Email Address</FormLabel>
                <Input {...field} id="email" placeholder="janedoe@mymail.com" />
                <FormErrorMessage>{form.errors.email}</FormErrorMessage>
              </FormControl>
            )}
          </Field>

          <Field name="password" validate={validatePassword}>
            {({ field, form }) => (
              <FormControl
                isInvalid={form.errors.password && form.touched.password}
              >
                <FormLabel htmlFor="password">Your Password</FormLabel>
                <Input
                  {...field}
                  type="password"
                  id="password"
                  placeholder="********"
                />
                <FormErrorMessage>{form.errors.password}</FormErrorMessage>
              </FormControl>
            )}
          </Field>
          <Stack isInline>
            <Button
              mt={4}
              variantColor="blue"
              isLoading={isSubmitting}
              type="submit"
            >
              Sign In
            </Button>
            <Button
              as="a"
              href="/signup"
              mt={4}
              variant="outline"
              variantColor="blue"
            >
              Sign Up
            </Button>
          </Stack>
        </form>
      )}
    </Formik>
  );
};

const LoginPage = () => {
  const router = useRouter();
  useUser({ redirectTo: "/dashboard", redirectIfFound: true });

  return (
    <Container>
      <Nav />
      <Main>
        <Heading>Please Sign In</Heading>
        <Text>If you're new to FISE Lounge, press Sign Up.</Text>
        <NameForm router={router} />
      </Main>
      <Footer />
    </Container>
  );
};

export default LoginPage;
