import {
  Html,
  Head,
  Preview,
  Section,
  Row,
  Text,
  Button,
  Heading,
  Font,
} from "@react-email/components";

interface VerificationEmailProps {
  username: string;
  otp: string;
  purpose?: string|null;
}

const VerificationEmail = ({
  username,
  otp,
  purpose,
}: VerificationEmailProps) => {
  return (
    <Html lang="en" dir="ltr">
      <Head>
        <title>Verification code</title>
        <Font
          fontFamily="Roboto"
          fallbackFontFamily="Verdana"
          webFont={{
            url: "https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1MU4mxKKTU1Kg.woff2",
            format: "woff2",
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Preview>Here&apos;s your verification code : {otp}</Preview>
      <Section>
        <Row>
          <Heading as="h2">hello {username},</Heading>
        </Row>
        {purpose ? (
          <Row>
            <Heading as="h3">{purpose}</Heading>
          </Row>
        ) : null}
        <Row>
        <Row>
          <Text>{otp}</Text>
        </Row>
          {purpose ? (
            <Text>
              we accept your request for updating username . please use the following verification
              code to complete verification for changing username
            </Text>
          ) : (
            <Text>
              Thank you for registring . please use the following verification
              code to complete registration
            </Text>
          )}
        </Row>
        
        <Row>
          <Text>
            if you did not request this code , please ignore this email
          </Text>
        </Row>
        {
          <Row>
            <Button
              href={`http://localhost:3000/verify/${username}`}
              style={{ color: "#61dafb" }}
            >
              verify here
            </Button>
          </Row>
        }
      </Section>
    </Html>
  );
};

export default VerificationEmail;
