import { Flex, Heading } from '@chakra-ui/core'

export const Hero = ({ title }) => (
  <Flex justifyContent="center" alignItems="center" height="70vh">
    <Heading fontSize="10vw">{title}</Heading>
  </Flex>
)

Hero.defaultProps = {
  title: 'FISE Lounge',
}
