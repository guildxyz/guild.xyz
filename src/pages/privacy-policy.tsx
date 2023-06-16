import {
  Heading,
  ListItem,
  OrderedList,
  Stack,
  Text,
  UnorderedList,
} from "@chakra-ui/react"
import Layout from "components/common/Layout"
import Link from "components/common/Link"

const Page = (): JSX.Element => (
  <Layout
    title="Privacy Policy"
    description={
      <Text>
        The protection of natural person's rights with regard to the processing of
        personal data
      </Text>
    }
    maxWidth="container.md"
  >
    <Stack
      spacing={8}
      sx={{
        "h2, h3, h4": {
          fontFamily: "display",
        },
        h2: {
          fontSize: "4xl",
          mb: 6,
        },
        h3: {
          fontSize: "2xl",
          mb: 4,
        },
        h4: {
          fontSize: "lg",
          mb: 4,
        },
        p: {
          lineHeight: 1.75,
          mb: 4,
        },
        "p dfn": {
          fontWeight: "bold",
        },
      }}
    >
      <section>
        <Heading as="h2">Introduction</Heading>
        <Heading as="h3">Why is this privacy notice made?</Heading>
        <Text>
          During its operation, the Data Controller handles personal data for several
          purposes, while respecting the rights of the data subjects and fulfilling
          legal obligations. The Data Controller also considers it important to
          present to the data subject the handling and the most important
          characteristics of the personal data that came to the controller’s
          knowledge during the data processing activities.
        </Text>
        <Text>
          What is the legal basis of processing the data subjects’ personal data?
          Personal data is only processed for a specific purpose and on an
          appropriate legal basis. These purposes and legal bases are presented
          individually, in relation to specific data processing.
        </Text>
        <Text>
          What external assistance is used to process your personal data? Personal
          data is mostly processed by the Data Controller at own premises. However,
          there are operations for which a data processor’s external help is
          necessary. The data processor may change according to the characteristics
          of each data processing.
        </Text>
        <Text>
          Who is processing your personal data? The data subject may receive
          information about the data processors employed by the Data Controller and
          their contact details in section II of this privacy notice.
        </Text>
      </section>

      <section>
        <Heading as="h2">Section I.</Heading>
        <Heading as="h3">Name of the data controller</Heading>
        <Text>
          The issuer of this privacy notice and the Data Controller:
          <br />
          COMPANY NAME: Z Gen Kibernetika Korlátolt Felelősségű Társaság
          <br />
          REGISTERED SEAT: 6720 SZEGED, KELEMEN LÁSZLÓ UTCA 11.
          <br />
          COMPANY REGISTRATION NUMBER: 06-09-025397
          <br />
          TAX NUMBER: 26787015-2-06
          <br />
          EUID IDENTIFIER: HUOCCSZ.06-09-025397
          <br />
          REPRESENTS: Brúnó Márton Zawiasa
          <br />
          EMAIL:{" "}
          <Link href="mailto:help@guild.xyz" colorScheme="blue">
            help@guild.xyz
          </Link>
          <br />
          CONTACT:{" "}
          <Link href="/" colorScheme="blue">
            guild.xyz
          </Link>
          <br />
          <b>(hereinafter: Company)</b>
        </Text>
      </section>

      <section>
        <Heading as="h2">Section II.</Heading>
        <Heading as="h3">Name of the data processors</Heading>
        <Text>
          <dfn>Data Processor:</dfn> a natural or legal person, public authority,
          agency or other body which processes personal data on behalf of the
          controller; (Regulation 2016/679 Article 4 8.)
        </Text>
        <Text>
          To use a data processor, prior consent from the data subject is not
          required, but he or she must be notified. Accordingly, the following
          information is provided:
        </Text>

        <Heading as="h4">Hosting Provider:</Heading>
        <Text>
          COMPANY NAME: Google LLC <br />
          REGISTERED SEAT: Mountain View, California, USA
          <br />
          CONTACT:{" "}
          <Link href="https://mail.google.com" target="_blank" colorScheme="blue">
            mail.google.com
          </Link>
        </Text>

        <Heading as="h4">Recipients:</Heading>
        <Text>
          COMPANY NAME: Google LLC <br />
          REGISTERED SEAT: Mountain View, California, USA
          <br />
          CONTACT:{" "}
          <Link href="https://mail.google.com" target="_blank" colorScheme="blue">
            mail.google.com
          </Link>
        </Text>
        <Text>
          Where the Privacy Notice generally refers to transfers to the Company's
          data processors, in those cases it should also be understood to refer to
          transfers to the above recipients.
        </Text>
      </section>

      <section>
        <Heading as="h2">Section III.</Heading>
        <Heading as="h3">Lawfullness of processing</Heading>

        <Heading as="h4">1. Minors</Heading>
        <Text>
          1.1. Our service is not available for minors who are under the age of 18.
          Minors may use our services only with the consent of their legal guardian,
          which they acknowledge by accepting this Privacy policy. The Company does
          not knowingly collect personal information from children under the age of
          18. If you believe that a minor under the age of 18 provided personal
          information to the Company, please contact us and we will delete that
          information.
        </Text>

        <Heading as="h4">
          2. Data processing based on the data subject’s consent
        </Heading>
        <Text>
          2.1. Where the Company intends to carry out data processing based on
          consent, the data subject's consent to the processing of his or her
          personal data shall be obtained by means of the data request form and
          information as set out in the Data Processing Policy.
        </Text>
        <Text>
          2.2. Consent shall also be deemed to be given if the data subject ticks a
          box when viewing the Company's website, makes the relevant technical
          settings when using information society services, or makes any other
          statement or takes any other action which clearly indicates the data
          subject's consent to the intended processing of his or her personal data in
          the relevant context. Silence, ticking a box or inaction therefore does not
          constitute consent. The continuation of a telephone call after having been
          duly informed shall constitute consent.
        </Text>
        <Text>
          2.3. Consent covers all processing activities carried out for the same
          purpose or purposes. Where processing is carried out for more than one
          purpose, consent shall be given for all the purposes for which the
          processing is carried out.
        </Text>
        <Text>
          2.4. Where the data subject gives his or her consent in the context of a
          written statement which also relates to other matters, such as the
          conclusion of a sales or service contract, the request for consent must be
          presented in a manner clearly distinguishable from those other matters, in
          a clear and easily accessible form, in clear and plain language. Any part
          of such a statement containing the consent of the data subject which is in
          breach of the Regulation shall not be binding.
        </Text>
        <Text>
          2.5. The Company shall not make the conclusion or performance of a contract
          conditional on the giving of consent to the processing of personal data
          which are not necessary for the performance of the contract.
        </Text>
        <Text>
          2.6. The data subject may withdraw his/her consent at any time by sending
          an e-mail to the e-mail address indicated in Chapter I.
        </Text>
        <Text>
          2.7. If the data subject withdraws his/her consent, the controller may no
          longer process his/her data. Where consent is withdrawn, the controller
          must ensure that the data are erased, unless another legal basis allows for
          the processing of those data (e.g. storage requirements or the need to
          perform a contract). Where processing has been carried out for more than
          one purpose, the controller may not use the personal data for the purpose
          for which the data subject has withdrawn consent.
        </Text>
        <Text>
          2.8. In all the data processing cases indicated below, the data subject
          acknowledges that the provision of data is not a prerequisite for the
          conclusion of a contract and is not obliged to provide his/her personal
          data.
        </Text>

        <Heading as="h4">
          3. Data processing based on performing legal obligations
        </Heading>
        <Text>
          3.1. In the case of data processing based on performing legal obligations,
          the scope of the data that can be processed, the purpose of the data
          processing, the duration of data storage and the recipients are governed by
          the provisions of the underlying legislation.
        </Text>
        <Text>
          3.2. The processing of personal data for compliance with a legal obligation
          is based on the regulation, regardless of the consent of the data subject.
          In this case, prior to the processing of the data, the data subject shall
          be informed that the data processing is obligatory and shall be clearly and
          in detail informed of all facts concerning the processing, in particular
          the purpose and legal basis of the data processing, the person authorized
          to handle and process the data, the duration of the data processing,
          whether the personal data of the data subject are processed by the Data
          Controller on the basis of the legal obligation applicable to him or her,
          and who can get access to the data. The information shall include the
          rights and remedies available to the data subject. In the case of mandatory
          data processing, the information may also take place with the publication
          of a reference to the legislative provisions which contain the foregoing
          information.
        </Text>

        <Heading as="h4">4. Data processing based on legitimate interests</Heading>
        <Text>
          4.1. The legitimate interests of the Company or a third party may provide a
          legal basis for the processing, provided that the interests, fundamental
          rights and freedoms of the data subject do not prevail. The reasonable
          expectations of the data subject based on his or her relationship with the
          controller should be taken into account, so that the processing of personal
          data for contact purposes, even for direct marketing purposes, may be
          considered to be based on legitimate interests.
        </Text>
        <Text>
          4.2. The processing based on legitimate interests requires a balancing of
          interest test, in which the Company will always take into account the
          current circumstances and the situation of the controller and the data
          subjects. In the case of processing in the interest of the Company, the
          balancing of interests tests carried out separately have led to the
          following result: in the balancing of interests test, the Company has
          concluded, taking into account the conditions described for the processing
          in question, that the processing is justified subject to the appropriate
          safeguards, as set out in this Policy, without which the Company would not
          be able to operate competitively. In this light, the emotional impact on
          data subjects and the harm to their right to privacy can be considered
          proportionate.
        </Text>

        <Heading as="h4">
          5. Data processing for the protection of the vital interests of the data
          subject or other natural person
        </Heading>
        <Text>
          5.1. The protection of the vital interests of the data subject or of
          another natural person may also provide a legal basis for processing, given
          that the right to data protection is fundamental but not exclusive, and
          that the right to the protection of personal data is naturally overridden
          by the right to life in a life and death context.
        </Text>

        <Heading as="h4">6. Data processing based on contractual interests</Heading>
        <Text>
          6.1. Data processing may also be based on a contractual interest if it is
          necessary for the performance of a contract in which the data subject is a
          party or if it is requested by the data subject in order to prepare the
          contract.
        </Text>

        <Heading as="h4">7. Promoting the rights of the data subject</Heading>
        <Text>
          7.1. The Company is obliged to ensure the exercise of the rights of the
          data subject during all data processing.
        </Text>
      </section>

      <section>
        <Heading as="h2">Section IV.</Heading>
        <Heading as="h3">Information about data processing by the company</Heading>

        <Heading as="h4">Data management in relation of connecting wallets</Heading>
        <Text>
          (1) The Company provides an open access control system for communities
          based on blockchain. Roles are defined by blockchain assets (tokens, NFTs).
          Rewards (e.g. accessing special chat rooms, or GitHub repositories) are
          provided the same way.
        </Text>
        <Text>
          (2) Connecting your wallet(s) is essential to participate in our services.
          The natural person using the website (you, the user) can give his/her
          consent to the processing of his/her personal data by ticking the relevant
          box.
        </Text>
        <Text>
          (3) Using the website and participating in our services related to the
          creation and management of decentralized autonomous organizations ("DAO")
          we use smart contracts that necessarily collect information such as your
          cryptocurrency wallet public address (which some jurisdictions may consider
          personal information) and store that information on a{" "}
          <b>public blockchain</b>, which is not controlled by us. In addition,
          knowing your wallet public address means that the transaction history is
          visible due to the nature of the technology used. A <b>smart contract</b>{" "}
          is computer code that automatically processes events when certain
          conditions are met; for example, when a proposal is submitted to a member's
          DAO, and after that DAO member casts all the necessary votes, the smart
          contract executes the proposed action if the proposal passes. In these
          situations, your personal information is stored on the respective
          blockchain through the execution of the smart contract and cannot
          necessarily be modified or deleted due to the immutable nature of the
          blockchain.{" "}
          <b>
            Our services shall be only used with express acknowledgement of such
            features of the blockchain and smart contracts.
          </b>
        </Text>
        <Text>
          (4) We might use cookies to preserve your identification data – please
          check out the “COOKIE POLICY ON THE WEBSITE OF THE COMPANY” section of this
          Privacy Policy too.
        </Text>
        <Text>
          (5) The scope of personal data processed: public key of the wallet – EVM
          address, cookies according to the relevant section of the Privacy Policy
        </Text>
        <Text>
          (6) Purpose of the processing of personal data: to identify the user to be
          able to provide services
        </Text>
        <Text>
          (7) The legal basis for the processing is the consent of the data subject.
        </Text>
        <Text>
          (8) Recipients of the personal data: employees performing customer service,
          administration and development tasks if required.
        </Text>
        <Text>
          (9) Duration of storage of personal data: 5 years from ceasing the last
          membership of a guild or until the data subject's consent is withdrawn
          (request for erasure).
        </Text>

        <Heading as="h4">
          Data management in relation of joining guilds and connecting Social
          Accounts
        </Heading>
        <Text>
          (1) Once your wallet is connected, you can join gulids, DAOs due to our
          services. You will be able to connect several social accounts (“Social
          accounts”) while joining including but not limited to
        </Text>
        <OrderedList type="a" pl={4} mb={4}>
          <ListItem>Discord</ListItem>
          <ListItem>Telegram</ListItem>
          <ListItem>GitHub</ListItem>
          <ListItem>Google</ListItem>
          <ListItem>Twitter</ListItem>
        </OrderedList>
        <Text>
          (2) Connecting Social accounts is based on OAuth authorization protocol,
          which means that you will have to <b>authorize your Social account</b> in a
          pop-up window to provide the Company the requested data and access.{" "}
          <b>
            In the authorization pop-up window, you will see what data the Company
            will get and what actions the Company will be able to do.
          </b>
        </Text>
        <Text>
          <b>
            (3) By Connecting your Social accounts, you consent to the fact that they
            will be linked together with your wallet private key and as a result of
            that your blockchain transaction history.
          </b>
        </Text>
        <Text>
          (4) The scope of personal data processed: public key of the wallet (EVM -
          Ethereum address), personal data indicated during the authorization of the
          Social accounts (e.g.: content of accounts followed, e-mail addresses,
          content of posts, Social account IDs e.g.: Discord ID, Telegram ID, GitHub
          ID etc.)
        </Text>
        <Text>
          (5) Purpose of the processing of personal data: to provide services, since
          Company provides an open access control system for communities based on
          blockchain
        </Text>
        <Text>
          (6) The legal basis for the processing is the performance of a contract
          since the Company provides a service to the users
        </Text>
        <Text>
          (7) Recipients of the personal data: guild administrators will only access
          to EVM (Ethereum) addresses of users. Data from Social accounts shall be
          only accessed by employees performing customer service, administration and
          development tasks if required
        </Text>
        <Text>
          (8) Duration of storage of personal data: 5 years from ceasing the last
          membership of a guild
        </Text>
      </section>

      <section>
        <Heading as="h4">
          Data management in relation to social media (Twitter)
        </Heading>
        <Text>
          (1) Our Company has only limited influence on the data processing of social
          media platform operators. In those places where we can influence and
          parameterize it, we will facilitate its data processing in a manner that is
          appropriate from a data protection point of view within the range of
          possibilities available to us. In most cases, however, we have no control
          over the operator's activities, so we have no information about exactly
          what data is processed.
          <br />
          Twitter's privacy policy can be found at:{" "}
          <Link
            href="https://twitter.com/en/privacy"
            target="_blank"
            colorScheme="blue"
          >
            twitter.com/en/privacy
          </Link>
        </Text>
        <Text>
          (2) The Controller manages its own page on Twitter. The data subject can
          subscribe to the news feeds published on the Twitter page's message board
          by clicking on the "like" or "like" link on the pages. To be able to
          contact the Data Controller via Twitter, you must be logged in. For this
          purpose, Twitter also requests, stores and processes personal data. The
          Controller has no control over the type, scope and processing of these data
          and does not receive personal data from the Twitter operator. On Twitter
          pages, the Data Controller processes the personal data of followers on the
          basis of the voluntary consent of the followers, which is deemed to have
          been given by the fact that the person concerned likes, follows or comments
          on the page or posts. The data subject declares that he/she is over 16
          years of age when requesting services on the Twitter page of the
          Controller. A person under the age of 16 requires the consent of his or her
          legal representative in order for his or her declaration of consent to the
          processing to be valid pursuant to Article 8(1) of the GDPR. The controller
          is not in a position to verify the age and entitlement of the person giving
          consent, so the data subject warrants that the data he or she has provided
          is accurate.
        </Text>
        <Text>
          (3) Purpose of processing: to provide information on current information,
          news concerning the Data Controller, advertising on social media,
          presentation and promotion of services. The Twitter page is used by the
          Data Controller for marketing purposes in order to inform interested
          parties about its services and to enable them to contact the Data
          Controller.
        </Text>
        <Text>
          (4) Legal basis for processing: voluntary consent of the data subject (in
          accordance with Twitter policies)
        </Text>
        <Text>
          (5) Data subject: name of the data subject; data subjects: users of the
          social media platform
        </Text>
        <Text>
          (6) Duration of data processing: the data subject can unsubscribe from the
          Twitter page of the Data Controller by clicking on the "dislike" or "do not
          like" button or delete unwanted content by using the settings on the
          message board. The active status of the service
        </Text>
        <Text>
          (7) Recipients: the employees of the data controller performing tasks
          related to customer service and marketing, the Company's data processors as
          data processors, in particular the Company's IT service provider.
        </Text>
        <Text>
          (8) The data subject acknowledges that the provision of data is not a
          prerequisite for the conclusion of a contract and is not obliged to provide
          his/her personal data. The possible consequence of not providing the data
          is the failure to inform the Data Controller about current news and
          services concerning the Data Controller.
        </Text>

        <Heading as="h4">Management of recruitment data, applications, CVs</Heading>
        <Text>
          (1) The personal data that may be processed include: the name, date and
          place of birth, mother's name, address, photograph, telephone number,
          e-mail address, details of professional history, experience, training,
          qualifications of the natural person. If, following the application of the
          data subject, a personal interview of the data subject takes place, the
          Data Controller shall make a record of it, the content of which shall also
          be considered personal data.
        </Text>
        <Text>(2) Purpose of the processing of personal data:</Text>
        <UnorderedList pl={4} mb={4}>
          <ListItem>identification of the data subject,</ListItem>
          <ListItem>
            the processing by the Controller of the data subject's job application to
            the Controller,
          </ListItem>
          <ListItem>assessment of the applicant's application,</ListItem>
          <ListItem>
            the participation of the data subject in the selection procedure,
          </ListItem>
          <ListItem>
            selecting the data subject with the appropriate skills and professional
            experience for the position advertised by the Data Controller,
          </ListItem>
          <ListItem>
            contacting and maintaining contact with the data subject during the
            selection process,
          </ListItem>
          <ListItem>
            offering the data subject a subsequent job offer if the data subject is
            not selected by the Data Controller for the advertised position.
          </ListItem>
        </UnorderedList>
        <Text>
          (3) Legal basis for the processing: By submitting a job application, the
          data subject gives his/her consent (Article 6(1)(a) GDPR) to the processing
          of his/her personal data (deemed to have been provided when the application
          is sent).
        </Text>
        <Text>
          (4) Recipients or categories of recipients of personal data: employees with
          managerial, labour relations responsibilities who are entitled to exercise
          employer rights in the Company.
        </Text>
        <Text>
          (5) The Data Controller shall delete the personal data of the data subject
          by 31 December of each year following the submission of the job application
          or until the withdrawal of the data subject's consent.
          <br />
          The Controller shall delete the documents sent by the data subject without
          delay at the request of the data subject. If the data subject requests the
          deletion of his or her personal data before the end of the selection
          process, the data subject shall not be able to participate in the selection
          process.
        </Text>

        <Heading as="h4">Data processing for tax and accounting obligations</Heading>
        <Text>
          (1) The Company shall process the data of natural persons who have come
          into contact with it for the purposes of fulfilling a legal obligation, tax
          and accounting obligations (bookkeeping, taxation) as provided for by law.
          §-of the Act of 2000 on Accounting: name, address, designation of the
          person or organisation ordering the transaction, signature of the person
          ordering the transaction and the person certifying the execution of the
          order, and, depending on the organisation, the signature of the controller;
          on stock movement vouchers and cash management vouchers: signature of the
          recipient and on counterfoils: signature of the payer, and under Act CXVII
          of 1995 on Personal Income Tax: tax identification number.
        </Text>
        <Text>
          (2) Data processing related to the keeping of the driver's logbook and the
          driver's logbook (in relation to vehicles used by more than one holder):
          the Company processes the data specified by law (name of the driver, type
          of vehicle, registration number, date and purpose of the journey, route
          taken, name of the business partner visited) for the purposes of legal
          obligations, cost accounting, supporting documents, tax assessment and fuel
          saving. The relevant legislation is Act No. CXVII of 1995 (Tax Act), §
          27/2/, Annex 3, item 6 and Annex 5, item 7.
        </Text>
        <Text>
          (3) The period of storage of personal data shall be 8 years after the
          termination of the legal relationship giving rise to the legal basis.
        </Text>

        <Heading as="h4">
          Processing of documents of lasting value under the Archives Act
        </Heading>
        <Text>
          (1) The Company shall, in the performance of its legal obligation, process
          documents of permanent value pursuant to Act LXVI of 1995 on public
          records, public archives and the protection of private archival material
          (Archives Act), in order to ensure that the permanent value of the
          Company's archival material is preserved intact and in a usable condition
          for future generations. Duration of storage: until the transfer to the
          public archives.
        </Text>
        <Text>
          (2) Recipients of the personal data: the head of the Company, employees of
          the Company who are responsible for the management and archiving of the
          records, employees of the public archives.
        </Text>
      </section>

      <section>
        <Heading as="h2">Section V.</Heading>
        <Heading as="h3">Cookie policy on the website of the company</Heading>

        <Text>
          (1) Cookies are text files with small pieces of data, that are stored in
          the user’s computer or phone (HDD, SSD) until their expiration date, and if
          a user returns to that site in the future, the web browser returns that
          data to the web server. Their purpose is to store data regarding visiting
          the website, and personal adjustments, but these are not personal data of
          the user. Cookies help to create a user friendly website and to improve the
          user’s experience. If the user does not agree to use cookies, the use of
          the website will be intermitted. We might use cookies to preserve your
          identification data called session cookies. We ourselves do not store
          anything in cookies, but third-party entities store cookies on the website:
        </Text>
        <UnorderedList pl={4} mb={4}>
          <ListItem>
            PostHog (
            <Link
              href="https://posthog.com/privacy"
              target="_blank"
              colorScheme="blue"
            >
              posthog.com/privacy
            </Link>
            ) - If necessary, we can theoretically disable the use of cookies, but it
            would prevent us from cross-session tracking of users and affect some
            other functionalities, so it is not recommended.
          </ListItem>
          <ListItem>
            Intercom - session, device, user identification:{" "}
            <Link
              href="https://www.intercom.com/help/en/articles/2361922-intercom-messenger-cookies"
              target="_blank"
              colorScheme="blue"
            >
              www.intercom.com/help/en/articles/2361922-intercom-messenger-cookies
            </Link>
          </ListItem>
          <ListItem>
            Additionally, there is a cookie associated with Datadog, but it is used
            by Intercom, not us:{" "}
            <Link
              href="https://www.intercom.com/legal/cookie-policy"
              target="_blank"
              colorScheme="blue"
            >
              www.intercom.com/legal/cookie-policy
            </Link>{" "}
            - its name is dd_s.
          </ListItem>
          <ListItem>
            In few cases .mypinata.cloud cookies on some pages where images are
            loaded from Pinata.
          </ListItem>
        </UnorderedList>
        <Text>
          (2) Purpose of personal data processing: improvement in user’s internet
          experience, storage of personal adjustments
        </Text>
        <Text>
          (3) Legal basis of data processing: the data subject’s freely given consent
        </Text>
        <Text>
          (4) Categories of processed personal data: the Data Controller stores every
          analytical information without name or any other personal data
        </Text>
        <Text>
          (5) Period for which the personal data are stored: The data subject can
          delete the cookies anytime on his or her computer or phone
        </Text>
      </section>

      <section>
        <Heading as="h2">Section VI.</Heading>
        <Heading as="h3">Information about the rights of data subject</Heading>

        <Text>
          You can find further information about the rights of the data subject in
          General Data Protection Regulation (
          <Link
            href="https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:32016R0679&from=EN"
            target="_blank"
            colorScheme="blue"
          >
            eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:32016R0679&from=EN
          </Link>
          )
        </Text>
        <UnorderedList pl={4} mb={4}>
          <ListItem>
            Information and access to personal data (Article 13 and 14),
          </ListItem>
          <ListItem>Right of access by the data subject (Article 15),</ListItem>
          <ListItem>Right to rectification (Article 16),</ListItem>
          <ListItem>
            Right to erasure (‘right to be forgotten’ – Article 17),
          </ListItem>
          <ListItem>Right to restriction of processing (Article 18),</ListItem>
          <ListItem>Right to data portability (Article 20),</ListItem>
          <ListItem>Right to object (Article 21),</ListItem>
          <ListItem>
            Right to not be subject to automated individual decision-making,
            including profiling (Article 22),
          </ListItem>
          <ListItem>Right for remedies (Article 77-82).</ListItem>
        </UnorderedList>

        <Heading as="h4">
          Right to lodge a complaint with a supervisory authority:
        </Heading>
        <Text>
          (1) Every data subject shall have the right to lodge a complaint with a
          supervisory authority, in particular in the Member State of his or her
          habitual residence, place of work or place of the alleged infringement if
          the data subject considers that the processing of personal data relating to
          him or her infringes General Data Protection Regulation. You can find
          further information about remedies under Article 77.
        </Text>
        <Text>
          (2) Contact of the supervisory authority:
          <br />
          Nemzeti Adatvédelmi és Információszabadság Hatóság
          <br />
          Székhely: 1055 Budapest, Falk Miksa utca 9-11
          <br />
          Postacím:1363 Budapest, Pf.: 9.
          <br />
          Tel. +36 (1) 391-1400
          <br />
          Fax: +36 (1) 391-1410
          <br />
          Email: ugyfelszolgalat@naih.hu
          <br />
          Website:{" "}
          <Link href="https://www.naih.hu" target="_blank" colorScheme="blue">
            www.naih.hu
          </Link>
        </Text>
      </section>

      <Text>Place and date: Szeged, 3th February 2023</Text>
      <Text>
        <b>Z Gen Kibernetika Kft.</b>
      </Text>
    </Stack>
  </Layout>
)

export default Page
