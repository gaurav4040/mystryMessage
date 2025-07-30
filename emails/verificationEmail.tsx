import { Html, Head, Preview, Section, Row, Text, Button, Heading, Font } from "@react-email/components";



interface VerificationEmailProps {
    username: string;
    otp: string;
}


const VerificationEmail=({username,otp}:VerificationEmailProps)=>{
    return(
    <Html lang="en" dir="ltr">
        <Head >
            <title>Verification code</title>
            <Font 
                fontFamily="Roboto"
                fallbackFontFamily="Verdana"
                webFont={{
                    url: 'https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1MU4mxKKTU1Kg.woff2',
                    format: 'woff2'
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
            <Row>
                <Text>
                    Thank you for registring . please use the following verification code to complete registration
                </Text>
            </Row>
            <Row>
                <Text>{otp}</Text>
            </Row>
            <Row>
                <Text>
                    if you did not request this code , please ignore this email
                </Text>
            </Row>
            {
                <Row>
                    
                        <Button href={`http://localhost:3000/verify/${username}`} style={{color:'#61dafb'}}>
                            verify here
                        </Button>
                   
                </Row>
                
            }
        </Section>

    </Html>
)}

export default VerificationEmail;