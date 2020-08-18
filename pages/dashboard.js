import { signOut, useSession } from "next-auth/client";
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

const DashboardPage = () => {
  const [session, loading] = useSession();
  const router = useRouter();
  const { data, error } = useSWR("/api/user", fetcher);

  const handleDeleteUser = async () => {
    await fetch(`/api/user`, {
      method: "DELETE",
    })
      .then((r) => {
        if (r.ok) {
          router.replace("/");
          signOut({callbackUrl: process.env.NEXTAUTH_URL});
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

  if (session && data) {
    if (!data.name) router.replace("/onboarding");
    return (
      <Container>
        <Nav />
        <Main>
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
                        <Text fontSize="sm" color="gray.500">
                          {consumer.otc}
                        </Text>
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
    );
  } else if ((!loading && !session) || error) {
    if (error) console.error(error);
    router.replace("/");
    return <p>Unauthorized Route: {error && JSON.stringify(error)}</p>;
  } else return <Loading />;
};

export default DashboardPage;
