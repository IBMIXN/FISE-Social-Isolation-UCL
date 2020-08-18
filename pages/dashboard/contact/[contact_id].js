import { getSession } from "next-auth/client";
import { useRouter } from "next/router";
import { Formik, Field } from "formik";

import useSWR from "swr";
import fetcher from "../../../utils/fetcher";

import relations from "../../../utils/relations";

import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  FormErrorMessage,
  Text,
  Heading,
} from "@chakra-ui/core";

import { Nav } from "../../../components/Nav";
import { Container } from "../../../components/Container";
import { Main } from "../../../components/Main";
import Breadcrumbs from "../../../components/Breadcrumbs";
import { Footer } from "../../../components/Footer";
import Loading from "../../../components/Loading";
import { useEffect } from "react";

const MakeChangesForm = ({
  router,
  contact_id,
  currentName,
  currentEmail,
  currentRelation,
}) => {
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

  function validateRelation(value) {
    let error = "";
    if (!value) {
      error = "Choose a relation";
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
      method: "PUT",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formBody,
    };
    await fetch(`/api/contact/${contact_id}`, options)
      .then((r) => {
        if (r.ok) {
          return r.json();
        }
        throw r;
      })
      .then(({ message, data }) => {
        router.replace(`/dashboard/consumer/${data.consumer_id}`);
        actions.setSubmitting(false);
      })
      .catch(async (err) => {
        actions.setSubmitting(false);
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
      initialValues={{
        name: currentName,
        email: currentEmail,
        relation: currentRelation,
      }}
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

          <Field name="relation" validate={validateRelation}>
            {({ field, form }) => (
              <FormControl
                isInvalid={form.errors.relation && form.touched.relation}
              >
                <FormLabel htmlFor="relation">
                  What relation is this person to ?
                </FormLabel>
                <Select {...field} id="relation" placeholder="Select Relation">
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
                </Select>
                <FormErrorMessage>{form.errors.relation}</FormErrorMessage>
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

const ConsumerPage = ({ data, session }) => {
  const router = useRouter();
  const { contact_id } = router.query;

  useEffect(() => {
    if (!session) router.replace("/");
    if (data && !data.name) router.replace("/onboarding");
  }, []);

  const handleDeleteContact = async () => {
    await fetch(contact_id && `/api/contact/${contact_id}`, {
      method: "DELETE",
    })
      .then((r) => {
        if (r.ok) {
          if (data) router.replace(`/dashboard/consumer/${data.consumer_id}`);
          else router.replace(`/dashboard`);
          return;
        }
        throw r;
      })
      .catch(async (err) => {
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

  return session && data ? (
    <Container>
      <Nav />
      <Main>
        <Breadcrumbs
          links={[
            ["Dashboard", "/dashboard"],
            ["User", `/dashboard/consumer/${data.consumer_id}`],
            ["Contacts", "#"],
          ]}
        />
        <Heading>Editing {data.name}'s Contact Details</Heading>
        <MakeChangesForm
          router={router}
          currentName={data.name}
          currentEmail={data.email}
          currentRelation={relations[data.relation]}
          contact_id={contact_id}
        />
        <Box mt="3rem">
          <Button
            leftIcon="delete"
            variantColor="red"
            onClick={handleDeleteContact}
          >
            Delete This Contact
          </Button>
        </Box>
      </Main>
      <Footer />
    </Container>
  ) : (
    <Loading />
  );
};

export default ConsumerPage;

export async function getServerSideProps(context) {
  const { contact_id } = context.params;
  const session = await getSession(context);
  let data = null;

  if (session) {
    const hostname = process.env.NEXTAUTH_URL;
    const options = { headers: { cookie: context.req.headers.cookie } };
    const res = await fetch(`${hostname}/api/contact/${contact_id}`, options);
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
