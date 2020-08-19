import { getSession } from "next-auth/client";
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
  Select,
} from "@chakra-ui/core";

import Loading from "../../../../components/Loading";
import { Nav } from "../../../../components/Nav";
import { Container } from "../../../../components/Container";
import { Main } from "../../../../components/Main";
import { Footer } from "../../../../components/Footer";
import Breadcrumbs from "../../../../components/Breadcrumbs";
import { useEffect, useState } from "react";

const NameForm = ({ router }) => {
  const [formError, setFormError] = useState("");

  function validateName(value) {
    let error = "";
    if (!value) {
      error = "Required";
    } else if (value.length > 15) {
      error = "Must be 15 characters or less";
    } else if (!/^[a-z]+$/i.test(value)) {
      error = "Invalid characters, we only want their first name!";
    }
    return error;
  }

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

  const handleFormSubmit = async (values, actions) => {
    const valuesToSend = { ...values, consumer_id: router.query.consumer_id };
    const formBody = Object.entries(valuesToSend)
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
    await fetch("/api/contact", options)
      .then((r) => {
        if (r.ok) {
          return r.json();
        }
        throw r;
      })
      .then(({ message, data: contact }) => {
        setTimeout(() => {
          router.replace(`/dashboard/contact/${contact._id}`);
          actions.setSubmitting(false);
        }, 1500);
      })
      .catch(async (err) => {
        actions.setSubmitting(false);
        if (err.status === 400) {
          return await err.json().then((rJson) => {
            setFormError(rJson.message);
            return;
          });
        }
        if (err instanceof Error) {
          throw err;
        }
        throw await err.json().then((rJson) => {
          console.error(
            `HTTP ${err.status} ${err.statusText}: ${rJson.message}`
          );
          return;
        });
      });
  };

  return (
    <Formik
      initialValues={{ name: "", email: "", relation: "" }}
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
          <Field name="name" validate={validateName}>
            {({ field, form }) => (
              <FormControl isInvalid={form.errors.name && form.touched.name}>
                <FormLabel htmlFor="name">First name</FormLabel>
                <Input {...field} id="name" placeholder="Adam" />
                <FormErrorMessage>{form.errors.name}</FormErrorMessage>
              </FormControl>
            )}
          </Field>
          <br />
          <Field name="email" validate={validateEmail}>
            {({ field, form }) => (
              <FormControl isInvalid={form.errors.email && form.touched.email}>
                <FormLabel htmlFor="email">Email address</FormLabel>
                <Input {...field} id="email" placeholder="adam@example.org" />
                <FormErrorMessage>{form.errors.email}</FormErrorMessage>
              </FormControl>
            )}
          </Field>
          <br />
          <FormControl>
            <FormLabel htmlFor="relation">What relation is this?</FormLabel>

            <Field as={Select} name="relation" placeholder="Select Relation">
              <option value="son">Their son</option>
              <option value="daughter">Their daughter</option>
              <option value="grandson">Their grandson</option>
              <option value="granddaughter">Their granddaughter</option>
              <option value="father">Their father</option>
              <option value="mother">Their mother</option>
              <option value="grandfather">Their grandfather</option>
              <option value="grandmother">Their grandmother</option>
              <option value="uncle">Their uncle</option>
              <option value="aunt">Their aunt</option>
              <option value="brother">Their brother</option>
              <option value="sister">Their sister</option>
              <option value="friend">Their friend</option>
            </Field>
          </FormControl>

          {formError && <Text color="crimson">{formError}</Text>}
          <Button
            mt={4}
            variantColor="blue"
            isLoading={isSubmitting}
            type="submit"
          >
            Create Contact
          </Button>
        </form>
      )}
    </Formik>
  );
};

const NewContactPage = ({ data, session }) => {
  const router = useRouter();

  useEffect(() => {
    if (!session) router.replace("/");
    if (data && !data.name) router.replace("/onboarding");
  }, []);

  const { consumer_id } = router.query;

  return session && data ? (
    <Container>
      <Nav />
      <Main>
        <Breadcrumbs
          links={[
            ["Dashboard", "/dashboard"],
            ["User", `/dashboard/consumer/${consumer_id}`],
            ["New Contact", "#"],
          ]}
        />
        <Heading>Create a New Contact for {data.name}</Heading>
        <Text>
          {data.name} will be able to call this person in the FISE Lounge app{" "}
          <br /> (If you haven't already, you will need to add yourself as a
          contact too).
        </Text>
        <NameForm router={router} />
      </Main>
      <Footer />
    </Container>
  ) : (
    <Loading />
  );
};

export default NewContactPage;

export async function getServerSideProps(context) {
  const { consumer_id } = context.params;
  const session = await getSession(context);
  let data = null;

  if (session) {
    const hostname = process.env.NEXTAUTH_URL;
    const options = { headers: { cookie: context.req.headers.cookie } };
    const res = await fetch(`${hostname}/api/consumer/${consumer_id}`, options);
    const json = await res.json();
    if (json.data) {
      data = json.data;
    }
  }

  return {
    props: {
      session,
      data,
    },
  };
}
