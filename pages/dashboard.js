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

const DashboardPage = () => {
  const [session, loading] = useSession();
  const router = useRouter();
  const { data, error } = useSWR("/api/user", fetcher);

  const handleDeleteUser = async () => {
    const options = {
      method: "DELETE",
    };
    await fetch(`/api/user`, options)
      .then((r) => {
        if (r.ok) {
          router.replace("/api/auth/signout");
          signOut();
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
    return (
      <Container>
        <Nav />
        <Main>
          <Heading>Welcome to the Dashboard, {session.user.name}</Heading>
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
                        <Text fontSize="sm" color="gray.600">
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
            <Button
              leftIcon="close"
              variantColor="red"
              onClick={handleDeleteUser}
            >
              Delete Your Account
            </Button>
          </Box>
        </Main>
        <Footer />
      </Container>
    );
  } else if ((!loading && !session) || error) {
    if (error) console.error(error);
    router.replace("/");
    return <p>Unauthorized Route: {error && error}</p>;
  } else return <Loading />;
};

export default DashboardPage;
