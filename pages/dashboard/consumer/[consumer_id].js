import { useSession } from "next-auth/client";
import { useRouter } from "next/router";
import useSWR from "swr";
import fetcher from "../../../utils/fetcher";

import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Checkbox,
} from "@chakra-ui/core";

import { Link as ChakraLink, Text, Icon, Heading } from "@chakra-ui/core";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/Table";

import { Nav } from "../../../components/Nav";
import { Container } from "../../../components/Container";
import { Main } from "../../../components/Main";
import { Footer } from "../../../components/Footer.js";
import Loading from "../../../components/Loading";
import { Formik, Field } from "formik";
import { useState } from "react";

const MakeChangesForm = (props) => {
  const { currentName, isCloudEnabled } = props;

  function validateName(value) {
    let error = "";
    if (!value) {
      error = "Required";
    } else if (value.length > 15) {
      error = "Must be 15 characters or less";
    } else if (!/^[a-z]+$/i.test(value)) {
      error = "Invalid characters";
    }
    return error;
  }

  function validateEmail(value) {
    let error = "";
    // if (!value) {
    //   error = "Required";
    // } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
    //   error = "Invalid email address";
    // }
  }

  return (
    <Formik
      initialValues={{ name: currentName, isCloudEnabled: true }}
      onSubmit={(values, actions) => {
        setTimeout(() => {
          alert(JSON.stringify(values, null, 2));
          actions.setSubmitting(false);
        }, 1000);
      }}
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
                <Input {...field} id="name" placeholder="name" />
                <FormErrorMessage>{form.errors.name}</FormErrorMessage>
              </FormControl>
            )}
          </Field>
          <FormControl my="1rem">
            <FormLabel>
              Enable Cloud Features?
              <Checkbox
                ml="1rem"
                size="lg"
                name="isCloudEnabled"
                checked={values.isCloudEnabled}
                isChecked={values.isCloudEnabled}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </FormLabel>
          </FormControl>

          <Button
            mt={4}
            variantColor="blue"
            isLoading={isSubmitting}
            type="submit"
            leftIcon="check"
          >
            Save Changes
          </Button>
        </form>
      )}
    </Formik>
  );
};


const ConsumerPage = () => {
  const [session, loading] = useSession();
  const router = useRouter();
  const { consumer_id } = router.query;
  const { data, error } = useSWR(`/api/consumer/${consumer_id}`, fetcher);

  const handleDeleteConsumer = async () => {
    const options = {
      method: "DELETE",
      // headers: {
      //   "Content-Type": "application/x-www-form-urlencoded",
      // },
    };
    await fetch(`/api/consumer/${consumer_id}`, options)
      .then((r) => {
        if (r.ok) {
          router.replace("/dashboard");
          return;
        }
        throw r;
      })
      .catch(async (err) => {
        if (err instanceof Error) {
          throw err;
        }
        throw await err.json().then((rJson) => {
          console.error(`HTTP ${err.status} ${err.statusText}: ${rJson.msg}`);
          return;
        });
      });
  }

  if (!session && !loading) {
    router.replace("/");
    return <p>Not authed, sorry</p>;
  } else {
    if ((loading || !data) && !error) {
      return <Loading />;
    } else {
      return (
        <Container>
          <Nav />
          <Main>
            <Heading>Editing {data.name}'s Profile</Heading>
            <MakeChangesForm
              currentName={data.name}
              isCloudEnabled={data.isCloudEnabled}
            />
            {error && <Text color="red.400">Error: {error.message}</Text>}

            {data && (
              <Box mt="3rem">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableHeader>Name</TableHeader>
                      <TableHeader>Scenes</TableHeader>
                      <TableHeader>Contacts</TableHeader>
                      <TableHeader />
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.contacts &&
                      data.contacts.map((contact, index) => (
                        <TableRow
                          bg={index % 2 === 0 ? "white" : "gray.50"}
                          key={index}
                        >
                          <TableCell>
                            <Text fontSize="sm" color="gray.600">
                              {contact.name}
                            </Text>
                          </TableCell>
                          <TableCell>
                            <Text fontSize="sm" color="gray.500">
                              {contact.contacts.length}
                            </Text>
                          </TableCell>
                          <TableCell>
                            <Text fontSize="sm" color="gray.500">
                              {contact.ar_scenes.length}
                            </Text>
                          </TableCell>
                          <TableCell textAlign="right">
                            <ChakraLink
                              href={`/dashboard/contact/${contact._id}`}
                              fontSize="sm"
                              fontWeight="medium"
                              color="blue.600"
                            >
                              Edit
                            </ChakraLink>
                          </TableCell>
                        </TableRow>
                      ))}
                    <TableRow bg="white">
                      <TableCell>
                        <Button
                          as="a"
                          href="/dashboard/contact/new"
                          leftIcon="add"
                          color="gray.600"
                        >
                          Add a new contact
                        </Button>
                      </TableCell>
                      <TableCell />
                      <TableCell />
                      <TableCell />
                    </TableRow>
                  </TableBody>
                </Table>
              </Box>
            )}
            <Box mt="3rem">
              <Button leftIcon="close" variantColor="red" onClick={handleDeleteConsumer}>
                Delete This User
              </Button>
            </Box>
          </Main>

          {/* <DarkModeSwitch /> */}
          <Footer />
        </Container>
      );
    }
  }
};

export default ConsumerPage;
