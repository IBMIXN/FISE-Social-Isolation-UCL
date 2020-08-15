import { useSession } from "next-auth/client";
// import Footer from "../components/footer";
import {
  Heading,
  List,
  ListIcon,
  ListItem,
} from "@chakra-ui/core";

import { Nav } from "../components/Nav";
import { Hero } from "../components/Hero";
import { Container } from "../components/Container";
import { Main } from "../components/Main";
import { DarkModeSwitch } from "../components/DarkModeSwitch";
import { CTA } from "../components/CTA";
import { Footer } from "../components/Footer.js";

const IndexPage = () => {
  const [session, loading] = useSession();
  return (
    <Container>
      <Nav />
      <Hero />
      <Main mt="-30vh">
        <Heading>
          Let your loved ones connect with <strong>you</strong>, not the other
          way around.
        </Heading>

        <List spacing={3} my={0}>
          <ListItem>
            <ListIcon icon="check-circle" color="green.500" />
            Intuitive User Interface
          </ListItem>
          <ListItem>
            <ListIcon icon="check-circle" color="green.500" />
            Secure
          </ListItem>
          <ListItem>
            <ListIcon icon="check-circle" color="green.500" />
            Free
          </ListItem>
        </List>
      </Main>

      {/* <DarkModeSwitch /> */}
      <Footer />
      {!loading && !session && <CTA />}
    </Container>
  );
};

export default IndexPage;
