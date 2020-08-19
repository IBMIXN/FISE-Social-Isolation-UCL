import { getSession } from "next-auth/client";
import { useRouter } from "next/router";
import { Formik, Field } from "formik";

import fetcher from "../../../utils/fetcher";

import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Link as ChakraLink,
  Text,
  Heading,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/core";

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
import { Footer } from "../../../components/Footer";
import Loading from "../../../components/Loading";
import Checkbox from "../../../components/Checkbox"
import relations from "../../../utils/relations";
import Breadcrumbs from "../../../components/Breadcrumbs";
import { useEffect } from "react";

const capitalize = ([first, ...rest]) =>
  first.toUpperCase() + rest.join("").toLowerCase();

const DeleteUserModal = ({ onClick }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Button
        leftIcon="delete"
        variant="outline"
        variantColor="red"
        onClick={onOpen}
      >
        Delete This User
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete This User?</ModalHeader>
          <ModalCloseButton />
          <ModalBody>Are you sure you want to perform this action?</ModalBody>

          <ModalFooter>
            <Button variantColor="blue" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button variantColor="red" onClick={onClick}>
              Confirm
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

const MakeChangesForm = ({
  currentName,
  isCloudEnabled,
  consumer_id,
  router,
}) => {
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
    await fetch(`/api/consumer/${consumer_id}`, options)
      .then((r) => {
        if (r.ok) {
          return r.json();
        }
        throw r;
      })
      .then(({ message, data }) => {
        router.replace(`/dashboard`);
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
        isCloudEnabled: isCloudEnabled === "true",
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
                <Input {...field} id="name" placeholder="name" />
                <FormErrorMessage>{form.errors.name}</FormErrorMessage>
              </FormControl>
            )}
          </Field>
          
          <Field
            name="isCloudEnabled"
            type="checkbox"
            checked={values.isCloudEnabled === true}
            label="Enable Cloud Features?"
            component={Checkbox}
          />

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

const ConsumerPage = ({ data, session }) => {
  const router = useRouter();
  const { consumer_id } = router.query;

  const handleDeleteConsumer = async () => {
    await fetch(consumer_id && `/api/consumer/${consumer_id}`, {
      method: "DELETE",
    })
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
          console.error(
            `HTTP ${err.status} ${err.statusText}: ${rJson.message}`
          );
          return;
        });
      });
  };

  useEffect(() => {
    if (!session) router.replace("/");
    if (data && !data.name) router.replace("/onboarding");
  }, []);

  return session && data ? (
    <Container>
      <Nav />
      <Main>
        <Breadcrumbs
          links={[
            ["Dashboard", "/dashboard"],
            [`${data.name}'s User Profile`, "#"],
          ]}
        />
        <Heading>Editing {data.name}'s Profile</Heading>
        <MakeChangesForm
          router={router}
          consumer_id={consumer_id}
          currentName={data.name}
          isCloudEnabled={data.isCloudEnabled}
        />
        {data && (
          <Box mt="3rem">
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeader>Name</TableHeader>
                  <TableHeader>Email</TableHeader>
                  <TableHeader>Relation</TableHeader>
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
                        <Text
                          fontSize="sm"
                          color="gray.600"
                          as="a"
                          href={`/dashboard/contact/${contact._id}`}
                        >
                          {contact.name}
                        </Text>
                      </TableCell>
                      <TableCell>
                        <Text fontSize="sm" color="gray.500">
                          {contact.email}
                        </Text>
                      </TableCell>
                      <TableCell>
                        <Text fontSize="sm" color="gray.500">
                          {capitalize(relations[contact.relation])}
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
                      href={`/dashboard/contact/new/${consumer_id}`}
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
          <DeleteUserModal onClick={handleDeleteConsumer} />
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
