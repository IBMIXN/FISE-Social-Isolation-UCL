import { useSession } from "next-auth/client";
import { useRouter } from "next/router";
import useSWR from "swr";
import fetcher from "../../../utils/fetcher";

import {
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

  return (
    <Formik
      initialValues={{ name: currentName, isCloudEnabled }}
      onSubmit={(values, actions) => {
        setTimeout(() => {
          alert(JSON.stringify(values, null, 2));
          actions.setSubmitting(false);
        }, 1000);
      }}
    >
      {(props) => (
        <form onSubmit={props.handleSubmit}>
          <Field name="name" validate={validateName}>
            {({ field, form }) => (
              <FormControl isInvalid={form.errors.name && form.touched.name}>
                <FormLabel htmlFor="name">First name</FormLabel>
                <Input {...field} id="name" placeholder="name" />
                <FormErrorMessage>{form.errors.name}</FormErrorMessage>
              </FormControl>
            )}
          </Field>
          <Field name="isCloudEnabled">
            {({ field, form }) => (
              <>
                <FormLabel htmlFor="name">Cloud features enabled?</FormLabel>
                <Input as={Checkbox} {...field} id="isCloudEnabled" />
              </>
            )}
          </Field>
          <Button
            mt={4}
            variantColor="blue"
            isLoading={props.isSubmitting}
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
            <MakeChangesForm currentName={data.name} />
            {error && <Text color="red.400">Error: {error.message}</Text>}

            {data && data.contacts ? (
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
                  {data.contacts.map((contact, index) => (
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
                      <Text
                        as="a"
                        href="/dashboard/contact/new"
                        fontWeight="bold"
                        fontSize="sm"
                        color="gray.600"
                      >
                        <Icon name="small-add" size="20px" color="gray.600" />
                        Add a new user
                      </Text>
                    </TableCell>
                    <TableCell />
                    <TableCell />
                    <TableCell />
                  </TableRow>
                </TableBody>
              </Table>
            ) : (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableHeader>Name</TableHeader>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow bg="white">
                    <TableCell>
                      <Text fontSize="sm" color="gray.600">
                        No Users found
                      </Text>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            )}
          </Main>

          {/* <DarkModeSwitch /> */}
          <Footer />
        </Container>
      );
    }
  }
};

export default ConsumerPage;
