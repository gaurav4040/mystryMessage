import {Heading,Text,Button } from '../node_modules/react-email/src/components'

import {Preview}  from '../node_modules/react-email/src/package/preview/dist/index'

import { Html } from '../node_modules/react-email/src/package/html/dist/index'

import { Head} from '../node_modules/react-email/src/package/head/dist/index'

import { Font } from '../node_modules/react-email/src/package/font/dist/index'

import { Row } from '../node_modules/react-email/src/package/row/dist/index'
import { Section, } from '../node_modules/react-email/src/package/section/dist/index' 

interface VerificationEmailProps{
    username:string
    otp:string
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
                    <a href="href={`http://localhost:3000/verify/${username}`}">
                        <Button  style={{color:'#61dafb'}}>
                            verify here
                        </Button>
                    </a>
                </Row>
                
            }
        </Section>

    </Html>
)}

export default VerificationEmail;