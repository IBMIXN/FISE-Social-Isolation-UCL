import { signOut, getSession, useSession } from "next-auth/client";
import { useRouter } from "next/router";
import useSWR, { mutate } from "swr";

import fetcher from "../utils/fetcher";

import {
  Box,
  Button,
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
  Icon,
  Tooltip,
  Stack,
} from "@chakra-ui/core";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/Table";

import { Nav } from "../components/Nav";
import { Container } from "../components/Container";
import { Main } from "../components/Main";
import { Footer } from "../components/Footer";
import Loading from "../components/Loading";
import { useEffect } from "react";
import Breadcrumbs from "../components/Breadcrumbs";

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
        Delete Your Account
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Your Account?</ModalHeader>
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

const DashboardPage = ({ data, session }) => {
  const router = useRouter();

  const handleDeleteUser = async () => {
    await fetch(`/api/user`, {
      method: "DELETE",
    })
      .then((r) => {
        if (r.ok) {
          signOut({ callbackUrl: process.env.NEXTAUTH_URL });
          router.replace("/");
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

  const handleRefreshOtc = async (consumer_id) => {
    await fetch(`/api/consumer/${consumer_id}`, {
      method: "POST",
    })
      .then((r) => {
        if (r.ok) {
          return r.json();
        }
        throw r;
      })
      .then(({ message, data }) => {
        router.replace(`/dashboard`);
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
        <Breadcrumbs links={[["Dashboard", "/dashboard"]]} />
        <Heading>Welcome to the Dashboard, {session.user.name}</Heading>
        <Box mt="3rem">
          <Button
            leftIcon="exit"
            variantColor="red"
            onClick={() => {
              router.replace("/api/auth/signout");
              signOut();
              return;
            }}
          >
            Sign Out
          </Button>
        </Box>

        <Box mt="3rem">
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>Name</TableHeader>
                <TableHeader>Contacts</TableHeader>
                <TableHeader>One-Time-Code</TableHeader>
                <TableHeader />
              </TableRow>
            </TableHead>
            <TableBody>
              {data.consumers &&
                data.consumers.map((consumer, index) => (
                  <TableRow
                    bg={index % 2 === 0 ? "white" : "gray.50"}
                    key={index}
                  >
                    <TableCell>
                      <Text
                        fontSize="sm"
                        color="gray.600"
                        as="a"
                        href={`/dashboard/consumer/${consumer._id}`}
                      >
                        {consumer.name}
                      </Text>
                    </TableCell>
                    <TableCell>
                      <Text fontSize="sm" color="gray.500">
                        {consumer.contacts.length}
                      </Text>
                    </TableCell>
                    <TableCell>
                      <Stack isInline>
                        <Text fontSize="sm" color="gray.500">
                          {consumer.otc}
                        </Text>
                        <Tooltip label="Refresh OTC (Will log user out)">
                          <Button
                            m="0"
                            p="0"
                            size="1rem"
                            label="Refresh otc"
                            onClick={() => handleRefreshOtc(consumer._id)}
                          >
                            <Icon color="gray.500" name="repeat" size="1rem" />
                          </Button>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                    <TableCell textAlign="right">
                      <ChakraLink
                        href={`/dashboard/consumer/${consumer._id}`}
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
                    href="/dashboard/consumer/new"
                    leftIcon="add"
                    color="gray.600"
                  >
                    Add a new user
                  </Button>
                </TableCell>
                <TableCell />
                <TableCell />
                <TableCell />
              </TableRow>
            </TableBody>
          </Table>
        </Box>
        <Box mt="3rem">
          <DeleteUserModal onClick={handleDeleteUser} />
        </Box>
      </Main>
      <Footer />
    </Container>
  ) : (
    <Loading />
  );
};

export default DashboardPage;

export async function getServerSideProps(context) {
  const session = await getSession(context);
  let data = null;

  if (session) {
    const hostname = process.env.NEXTAUTH_URL;
    const options = { headers: { cookie: context.req.headers.cookie } };
    const res = await fetch(`${hostname}/api/user`, options);
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
