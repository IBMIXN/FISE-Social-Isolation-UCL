import { useSession } from "next-auth/client";
import { useRouter } from "next/router";
import { Formik, Field } from "formik";
import {
  Text,
  Heading,
  FormErrorMessage,
  FormLabel,
  FormControl,
  Input,
  Button,
} from "@chakra-ui/core";

import { Container } from "../components/Container";
import { Nav } from "../components/Nav";
import { Main } from "../components/Main";
import { Footer } from "../components/Footer.js";
import Loading from "../components/Loading";

const NameForm = ({ router }) => {
  function validateName(value) {
    let error = "";
    if (!value) {
      error = "Required";
    } else if (value.length > 15) {
      error = "Must be 15 characters or less";
    } else if (!/^[a-z]+$/i.test(value)) {
      error = "Invalid characters, we only want your first name!";
    }
    return error;
  }

  const handleFormSubmit = async (values, actions) => {
    const formBody = Object.entries(values)
      .map(
        ([key, value]) =>
          encodeURIComponent(key) + "=" + encodeURIComponent(value)
      )
      .join("&");
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formBody,
    };
    await fetch("/api/user", options)
      .then((r) => {
        if (r.ok) {
          return r.json();
        }
        throw r;
      })
      .then((json) => {
        setTimeout(() => {
          router.replace("/");
          actions.setSubmitting(false);
        }, 2500);
      })
      .catch(async (err) => {
        actions.setSubmitting(false);
        if (err instanceof Error) {
          throw err;
        }
        throw await err.json().then((rJson) => {
          setError("name", {
            message: `HTTP ${err.status} ${err.statusText}: ${rJson.message}`,
          });
          return;
        });
      });
  };

  return (
    <Formik initialValues={{ name: "" }} onSubmit={handleFormSubmit}>
      {({
        isSubmitting,
        getFieldProps,
        handleChange,
        handleBlur,
        handleSubmit,
        values,
      }) => (
        <form onSubmit={handleSubmit}>
          <Field name="name" validate={validateName}>
            {({ field, form }) => (
              <FormControl isInvalid={form.errors.name && form.touched.name}>
                <FormLabel htmlFor="name">First name</FormLabel>
                <Input {...field} id="name" placeholder="First Name" />
                <FormErrorMessage>{form.errors.name}</FormErrorMessage>
              </FormControl>
            )}
          </Field>

          <Button
            mt={4}
            variantColor="blue"
            isLoading={isSubmitting}
            type="submit"
          >
            Save Changes
          </Button>
        </form>
      )}
    </Formik>
  );
};

const OnboardingPage = () => {
  const [session, loading] = useSession();
  const router = useRouter();

  if (session) {
    if (session.user.name) {
      router.replace("/dashboard");
      return <Loading />;
    } else {
      return (
        <Container>
          <Nav />
          <Main>
            <Heading>Welcome to the FISE Lounge Dashboard</Heading>
            <Text>
              Please give us your name so we can finish setting up your account!
            </Text>
            <NameForm router={router} />
          </Main>
          <Footer />
        </Container>
      );
    }
  } else if (!loading && !session) {
    router.replace("/");
    return <p>Unauthorized Route: {error && error}</p>;
  } else return <Loading />;
};

export default OnboardingPage;
