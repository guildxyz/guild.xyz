import {
  Box,
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
  <Layout title="General Terms and Conditions" maxWidth="container.md">
    <Stack
      spacing={8}
      sx={{
        "h2, h3, h4": {
          fontFamily: "display",
        },
        h2: {
          fontSize: "2xl",
          mb: 6,
        },
        h3: {
          fontSize: "xl",
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
        "ol, ul": {
          pl: 4,
        },
        li: {
          lineHeight: 1.75,
          mb: 4,
        },
        "li ul, li ol": {
          mb: 4,
        },
        "li ol li, li ul li": {
          mb: 0,
        },
      }}
    >
      <section>
        <OrderedList>
          <ListItem>
            The present Terms and Conditions (hereinafter referred to as <b>"GTC"</b>
            ) govern and set out the terms and conditions of the use the of the
            services of open access control system for communities based on
            blockchain available on the website{" "}
            <Link href="https://guild.xyz" colorScheme="blue">
              guild.xyz
            </Link>{" "}
            (hereinafter referred to as the{" "}
            <b>
              <i>"Website"</i>
            </b>
            ,{" "}
            <b>
              <i>"Platform"</i>
            </b>
            ) operated by <b>Z Gen Kibernetika Korlátolt Felelősségű Társaság</b>{" "}
            (registered seat: 6720 Szeged, Kelemen László utca 11., registration
            number: 06-09-025397, tax number: 26787015-2-06, hereinafter referred to
            as:{" "}
            <b>
              <i>"Service Provider"</i>
            </b>
            ) as well as the rights and obligations arising between the Service
            Provider, and the Client (hereinafter referred to as the{" "}
            <b>
              <i>"Client"</i>
            </b>
            ). In connection with its services the Service Provider provides that the
            roles are defined by blockchain assets (tokens, NFTs, POAPs), rewards
            (e.g. accessing special chat rooms, or GitHub repositories) (hereinafter
            all services provided through the Platform are collectively referred to
            as{" "}
            <b>
              <i>"Services"</i>
            </b>
            )
          </ListItem>

          <ListItem>
            The Platform provides users with access to tokens, POAPs, Smart Contracts
            published by Service Provider and by third parties. Acceptance of the GTC
            is a prerequisite for the use of the Services. The GTC is deemed to be
            accepted and the Client acknowledges that he has read and agreed to these
            Terms by signing up for an account on the Website, connecting the
            Client’s cryptocurrency wallet (e.g., MetaMask) or otherwise using or
            accessing the Platform. By using the Service, the Client accepts and
            acknowledges the present GTC and the Service Provider's Privacy Policy as
            binding upon him/her. The Services are not available to minors under the
            age of 18. Minors may only use the Services through their legal
            representative. If you do not agree to these Terms, you must not access
            or use the Site.
          </ListItem>

          <ListItem>
            This document is not filed, is concluded in electronic form, is written
            in English and does not qualify as a written contract.
          </ListItem>

          <ListItem>
            These GTC apply to all Services provided worldwide, including e-commerce
            services, through the Website. The use of the Services offered by the
            Platform and the rules for the provision of the Services are governed by
            Act CVIII of 2001 on certain issues of electronic commerce services and
            information society services (
            <b>
              <i>"E-Commerce Act"</i>
            </b>
            ).
          </ListItem>

          <ListItem>
            Hungarian law shall prevail with respect to any matters not regulated in
            these GTC and the interpretation of these GTC, in particular with respect
            to the relevant provisions of Act V of 2013 on the Civil Code (
            <b>
              <i>"Civil Code"</i>
            </b>
            ). The provisions of the applicable laws which are binding on all parties
            shall apply without any special stipulation.
          </ListItem>

          <ListItem>
            With express mutual declarations made after acceptance of the General
            Terms and Conditions, an online service contract is concluded between the
            Client and the Service Provider.
          </ListItem>

          <ListItem>
            The Service Provider shall publish the text of these GTC in force at any
            time and available for download by the Client on the Website. The Service
            Provider reserves the right to unilaterally amend these GTC. The
            amendment shall enter into force 8 days after it is posted on the
            Website.
          </ListItem>

          <ListItem>
            Given that the contract underlying the provision of the Service is
            entirely in English and the provision of the Service is entirely in
            English, the English language shall prevail for the purposes of these
            GTC.
          </ListItem>
        </OrderedList>
      </section>

      <section>
        <Heading as="h2">
          THE DESCRIPTION OF THE SERVICES IN GENERAL
          <br />
          <Text as="span" colorScheme="gray" fontSize="lg">
            The Services of Guild
          </Text>
        </Heading>

        <OrderedList start={9}>
          <ListItem>
            Using the Website and participating in the Services related to the
            creation and management of decentralized autonomous organizations (
            <b>
              <i>"Guild"</i>
            </b>
            ) Service Provider uses smart contracts that necessarily collect
            information such as the Client’s cryptocurrency wallet public address and
            store that information on a public blockchain, which is not controlled by
            the Service Provider. In addition, knowing the Client’s wallet public
            address means that the transaction history is visible due to the nature
            of the technology used. A smart contract is computer code that
            automatically processes events when certain conditions are met; for
            example, when a proposal is submitted to a member's Guild, and after that
            Guild member casts all the necessary votes, the smart contract executes
            the proposed action if the proposal passes. In these situations, the
            Client’s personal information is stored on the respective blockchain
            through the execution of the smart contract and cannot necessarily be
            modified or deleted due to the immutable nature of the blockchain. The
            Services shall be only used with express acknowledgement of such features
            of the blockchain and smart contracts.
          </ListItem>

          <ListItem>
            Once the Client’s wallet is connected, the Client can join gulids, Guilds
            due to the Services. The Client will be able to connect several social
            accounts (
            <b>
              <i>"Social accounts"</i>
            </b>
            ) while joining including but not limited to
            <OrderedList type="a" mt={4}>
              <ListItem>Discord</ListItem>
              <ListItem>Telegram</ListItem>
              <ListItem>GitHub</ListItem>
              <ListItem>Google</ListItem>
              <ListItem>Twitter</ListItem>
            </OrderedList>
          </ListItem>

          <ListItem>
            Connecting Social accounts is based on OAuth authorization protocol,
            which means that the Client will have to authorize his/her Social account
            in a pop-up window to provide the Service Provider the requested data and
            access. In the authorization pop-up window, the Client will see what data
            the Service Provider will get and what actions the Service Provider will
            be able to do.
          </ListItem>

          <ListItem>
            By Connecting the Client’s Social accounts, the Client consents to the
            fact that they will be linked together with his/her wallet public key and
            as a result of that his/her blockchain transaction history.
          </ListItem>

          <ListItem>
            Tokens that the Client might interact with in connection with the
            Services are mostly non-fungible Ethereum-based tokens that operate using
            smart contracts on the Ethereum blockchain (
            <b>
              <i>"Smart Contracts"</i>
            </b>
            ). The Ethereum blockchain serves as an immutable ledger for all
            transactions conducted on the platform. As a result, tokens are not
            controlled by any single party, including Guild, and are subject to
            various risks and uncertainties. Guild does not own or control MetaMask,
            WalletConnect, the Ethereum network, the Client’s browser, or any
            third-party sites, products, or services (including third-party wallets
            or marketplaces) that the Client may use to access, visit, or facilitate
            during the use of the Services. The Guild holds no responsibility for any
            transaction in connection with the Services.
          </ListItem>

          <ListItem>
            Guild will not be held liable for the actions or omissions of any third
            parties, nor for any damages the Client may incur as a result of his/her
            transactions or any other interactions with third parties. The Client
            understands that his/her Ethereum public address will be visible to the
            public whenever The Client engages in a transaction.{" "}
          </ListItem>
        </OrderedList>
      </section>

      <section>
        <Heading as="h2">
          CONNECTING THE WALLET
          <br />
          <Text as="span" colorScheme="gray" fontSize="lg">
            How blockchain transactions work
          </Text>
        </Heading>

        <OrderedList start={15}>
          <ListItem>
            To access and utilize the Services, including participating in
            transactions, the Client must link his/her account to a digital wallet
            supported on MetaMask, WalletConnect, or other compatible wallet
            extensions or gateways allowed on the Services. These digital wallets
            enable you to purchase, store, and conduct transactions using the native
            Ethereum cryptocurrency, ETH.
          </ListItem>

          <ListItem>
            By connecting the cryptocurrency wallet, the Client acknowledges and
            agrees that he/she is solely responsible for maintaining the security of
            his/her wallet and all related authentication credentials, including
            private or public cryptocurrency keys, non-fungible tokens, or
            cryptocurrencies stored in or accessible through his/her wallet. Any
            unauthorized access to the Client’s cryptocurrency wallet by third
            parties could lead to the loss or theft of tokens or other assets and/or
            funds held in his/her wallet, as well as any associated financial
            information like bank accounts or credit cards. Please note that Guild is
            not accountable for managing and maintaining the security of the Client’s
            cryptocurrency wallet. In the event of any unauthorized or suspicious
            activity related to the Services noticed in the cryptocurrency wallet,
            please inform us immediately.
          </ListItem>

          <ListItem>
            It is crucial to understand and acknowledge that the Smart Contracts
            deployed via the Platform do not grant Guild custody, possession, or
            control of any digital asset at any time to facilitate transactions.
            Guild may facilitate transactions between Clients on the Platform, such
            as the sale or distribution of Editions, but it is not a party to any
            agreement between sellers, buyers, authors, creators, or other Clients.
            Guild cannot make any representation or guarantee regarding any specific
            outcomes for Clients resulting from creating or posting their creator
            content on the Platform, making digital assets available for minting or
            collecting, or engaging in any other transactions or activities on the
            Platform.
          </ListItem>

          <ListItem>
            To safeguard the integrity of the Platform, the Service Provider reserves
            the right, at any time and at its sole discretion, to block access to the
            Platform from specific IP addresses and unique device identifiers.
            Service Provider may suspend or terminate the Client’s access to the
            Platform at any time in relation to any transaction, as required by other
            compliance policies and practices. The Service Provider may also impose
            reasonable limitations and controls on the Client’s or any beneficiary's
            ability to use the Platform. The Service Provider may suspend or
            terminate the Client access to and use of the Platform, including
            suspending access to the Interface, at its sole discretion, at any time
            and without notice to the Client. The Service Provider shall have no
            liability in this respect.
          </ListItem>

          <ListItem>
            <b>
              <u>Transaction instructions:</u>
            </b>{" "}
            Guild will execute Eth Transactions based on the Client’s instructions.
            However, the Client understands and accepts that Guild does not:
            <br />
            - have any control or liability over the delivery, quality, or any other
            aspect of goods or services the Client buys or sells to third parties.
            Guild will not intervene to ensure that any buyer or seller the Client
            transacts with through your Guild wallet completes the relevant
            transaction or has the necessary authority to do so.
            <br />- guarantee the identity of any user, receiver, or other party
            involved in a transaction conducted on the Guild platform. It is the
            Client’s sole responsibility to verify all transaction details before
            sending instructions to Guild.
          </ListItem>
        </OrderedList>
      </section>

      <section>
        <Heading as="h2">
          DESCRIPTION OF SOME KEY SERVICES
          <br />
          <Text as="span" colorScheme="gray" fontSize="lg">
            (non-exhaustive list)
          </Text>
        </Heading>

        <OrderedList start={20}>
          <ListItem>
            <b>
              <u>Guild Creation</u>
            </b>

            <OrderedList>
              <ListItem>
                By selecting the Create Guild option on the guild.xyz website, the
                Client can choose the platform of the guild the Client would like to
                create, such as Discord, Telegram, Google Workspace, GitHub, etc.
              </ListItem>
              <ListItem>
                After selecting a platform (e.g. Discord), the Client can restrict
                the guild installation to a specific server. Two options are
                possible: the first one is to have the Discord account already
                connected to the online platform, the second one requires
                synchronisation. After the steps required for the former result, the
                Client selects the preferred server.
              </ListItem>
              <ListItem>
                Once the server is selected, the system will automatically perform a
                'data saving' process, which is essential for the smooth operation of
                the server.
              </ListItem>
              <ListItem>
                Following the steps above will create the desired guild.
              </ListItem>
              <ListItem>
                By browsing the server's details page, the Client can find
                information about the guild's specifications, such as the identity of
                the server admin, 'roles', 'rewards'.
              </ListItem>
              <ListItem>
                Under the 'requirements' tab in the 'roles' section, the Client can
                specify the requirements for joining the guild (e.g. having a certain
                amount/quality of cryptocurrency).
              </ListItem>
              <ListItem>
                By saving the 'role', any changes or settings you make to the role
                will take effect immediately (e.g. guild membership requirements).
              </ListItem>
              <ListItem>
                The general settings and specifications of the guild can also be
                customized, such as the guild URL availability, description, visual
                appearance (e.g. background color), security settings (e.g. hiding
                members, hiding the guild from external viewers).
              </ListItem>
              <ListItem>
                Further customisations can be made to the guild created.
              </ListItem>
            </OrderedList>
          </ListItem>

          <ListItem>
            <b>
              <u>How to join a guild?</u>
            </b>
            <br />

            <Text>
              As a first step, clicking on "Our Guild" in the top right corner of the
              screen, you will see the "Connect to a wallet" option, which allows you
              to connect (register) with 3 wallet types: (i) MetaMask, (ii)
              WalletConnect, (iii) Coinbase Wallet. This is followed by a
              verification process: after entering the account name, you can click on
              "Verify account" and then click on "Sign" in the pop-up window.
            </Text>

            <Text>
              Guild-linked Social Media Accounts:
              <br />
              Click on the "Join guild to get roles" button to access the social
              media profiles that can be linked to the Account:
            </Text>

            <UnorderedList>
              <ListItem>
                <b>Discord:</b> click on the "Connect" button to connect using the
                "Authorize" function in the pop-up window, whereby the User agrees to
                allow Discord to access (i) username, avatar, banner; (ii) the
                servers the Client is in, (iii) read the Client’s member info for
                servers he/she belongs to.
              </ListItem>

              <ListItem>
                <b>Telegram:</b> clicking on the "Connect" button and then clicking
                on the "Log in with Telegram" button in the pop-up window, an
                authentication process will be performed, during which the Client
                will be asked to enter his/her phone number. Clicking on "Next" will
                send a confirmation message to the Client’s Telegram account. Here
                the Client has two options: he/she can click on "Decline" to reject
                the login attempt and "Confirm" to confirm the login attempt. By
                clicking on the "Confirm" button in the pop-up window, the Client has
                the option to grant access to the Guild Bot application by clicking
                on "Accept", whereby the Client simultaneously accepts that the
                application has access to the following data: name; username; profile
                picture.
              </ListItem>

              <ListItem>
                <b>Twitter:</b> the pop-up window that appears when the Client clicks
                on the "Connect" button can be connected using the "Authorize app"
                function, whereby the Client agrees to allow the Service to access
                the following data: (i) people who follow him/her and people the
                Client follows, (ii) all the tweets the Client can view, including
                tweets from protected accounts, (iii) any account the Client can
                view, including protected accounts.
              </ListItem>
            </UnorderedList>

            <Text>
              Connected Accounts can be accessed by clicking on the icon in the top
              right corner of the screen. Here the Client has the option to
              disconnect the connected profile at any time by clicking on the
              "Disconnect" button. However, the Disconnect function does not delete
              the Client's details from the Service Provider's database (but they are
              looking to add a delete function at a later stage).
            </Text>

            <Text>
              After successful authentication processes, the Client can join the
              Guilds by clicking on the "Join Guild" button. In the "Our Guild" menu,
              under the heading "Roles", the Client will find the privileges that the
              Client can obtain if he/she meets the conditions. For example, the
              "Grower" role, which allows the Client to access Google Docs by
              following the @guilxyz profile on the Twitter account associated with
              the Service. The Roles to which the Client has been granted access are
              highlighted under "Home" in the "Our Guild" menu.
            </Text>
          </ListItem>

          <ListItem>
            <b>
              <u>How to drop a POAP with Guild</u>
            </b>
            <br />

            <OrderedList>
              <ListItem>
                First of all, it is required to seek up the website of Guild.xyz.
              </ListItem>
              <ListItem>
                On the previous website the Client should click on the button being
                characterized by three points next to Discord title. After this the
                Client should choose the „Manage POAPs” option. If the Client had
                previous POAPs made by him/her, they will appear on this slide.
                Eventually it is possible to edit the previous POAP or create a brand
                new one.
              </ListItem>
              <ListItem>
                As the Client clicks on creating a new POAP option, he/she will see
                the „Create POAP” site, which is similarly structured as the one on
                the previous website. Here the Client can declare what he/she
                commemorates (the name of the POAP); the description of the POAP; the
                Client can also add some visual artworks to his/her POAP. The Client
                can also add a website and an e-mail address to his/her POAP.
              </ListItem>
              <ListItem>
                An edit code will be automatically be generated, which must be
                remembered for further changes. It is also possible to optimize the
                dates of dropping the POAP: the event date is the start of dropping
                (the appointment when participants can start to join), the expiry
                date is the end of sending valid links to potential members (if the
                participants gets a link before the end of the date, the member can
                use it successfully after the expiry day, too).
              </ListItem>
              <ListItem>
                It is also possible to upload a POAP, which has already been existed.
              </ListItem>
              <ListItem>The drop is successfully submitted.</ListItem>
              <ListItem>
                The Client has to upload the links of the POAP he/she would like to
                be distributed in the community.
                <br />
                There are two options considering this step: first of all, the Client
                should upload a txt file containing the link itself; secondly, the
                Client can add the link manually filling the blank below.
              </ListItem>
              <ListItem>The links have been successfully uploaded.</ListItem>
              <ListItem>
                Next you can determine requirements considering the enter to POAPs by
                using the „Manage POAP” site. These requirements can be based on
                payment or voice participation. Both of the functions are for to goal
                to filter potencial members joining the POAP server. You can also
                determine no requirements considering joining in POAP.
              </ListItem>
              <ListItem>
                Via the payment requirement the Client can monetize his/her POAP. The
                Client can require an exact price, currency and chain from the
                potencial members. This way The Client can protect his/her server
                from bots and farmers. The Client can also describe the address to be
                paid (the transaction fee is free of service costs).
              </ListItem>
              <ListItem>
                After all, the Client can distribute his/her server by choosing
                between two options: first of all, the Client can activate your POAP
                which involves creating the Discord site, which can be found by
                Discord users later; secondly (according to the more popular way) the
                Client can directly send a link to potencial members.
              </ListItem>
              <ListItem>
                If the Client chooses version number two, the link can be embed and
                customized in different ways in a form of button.
              </ListItem>
              <ListItem>
                If a potencial member would like to join the server via the link, the
                member’s Discord account and wallet will be automatically attached to
                the application.
              </ListItem>
            </OrderedList>
          </ListItem>
        </OrderedList>
      </section>

      <section>
        <Heading as="h2">GENERAL INFORMATION AND FURTHER SERVICES</Heading>

        <OrderedList start={23}>
          <ListItem>
            Service Provider does not sell any asset with financial value. Also, it
            is not possible to make financial investments by using the Services.{" "}
          </ListItem>
          <ListItem>
            In the case of minting, the Service Provider is entitled to consideration
            in crypto.
          </ListItem>
          <ListItem>
            If a transaction is made through the Services the Service Provider is
            entitled to a base fee consideration even for free tokens.
          </ListItem>
        </OrderedList>
      </section>

      <section>
        <Heading as="h2">LIABILITY</Heading>

        <OrderedList start={26}>
          <ListItem>
            By accepting these Terms, the Client acknowledges and consents that the
            Service Provider functions solely as an online platform provider and does
            not exercise direction or control over any of the Guilds operated through
            the Platform.
          </ListItem>
          <ListItem>
            If the Client is a member of a Guild managed through the Platform, the
            Client has the option to opt-in for receiving emails, text messages, or
            other communications through third-party services available on the
            Platform regarding proposals or updates related to that Guild. However,
            by choosing to receive such communications, the Client explicitly
            acknowledges and agrees that the Service Provider bears no responsibility
            or liability for any losses incurred, and it will not be held accountable
            for any failures in such communications.
          </ListItem>
          <ListItem>
            The Client is responsible for any and all sales, use, value-added and
            other taxes, duties, and assessments now or hereafter claimed or imposed
            by any governmental authority, associated with the use of the Services.
          </ListItem>
          <ListItem>
            Please be aware that the Service Provider does not become a party to any
            relationship between users, including those involved in any Guild on the
            Platform. Should the Client encounter any dispute with another Client of
            the Platform, it is the Client’s responsibility to address the matter
            directly with that other Client.
          </ListItem>
          <ListItem>
            The Platform may offer access to third-party websites or resources.
            Please note that this access is provided solely as a convenience, and we
            do not take responsibility for the content, products, or services
            available on or through those resources or the links displayed on such
            websites. You acknowledge and accept sole responsibility for any risks
            that may arise from your utilization of any third-party resources.
          </ListItem>
          <ListItem>
            The Service Provider makes no warranty that the Service will meet the
            Client’s requirements or be available on an uninterrupted, secure, or
            error-free basis. The Client acknowledges that due to the characteristics
            of the Internet, the continuous operation of the Platform and Services
            may be interrupted despite the Service Provider's prior knowledge and
            intent. The Service Provider makes no warranty regarding the quality,
            accuracy, timeliness, truthfulness, completeness, or reliability of any
            information or content on the Platform.
          </ListItem>
          <ListItem>
            The Service Provider is entitled to suspend the Service in whole or in
            part for maintenance of the Service or the related Website or for other
            security reasons without any prior notice or information.
          </ListItem>
          <ListItem>
            Tokens transacted on the Platform, are intangible digital assets. They
            derive their existence solely from the ownership record stored within the
            relevant blockchain network. The transfer of title for any unique digital
            asset occurs solely on the distributed ledger within the relevant
            blockchain network, over which the Service Provider has no control. The
            Service Provider cannot guarantee that impostors won't be able to carry
            out the transfer of title or rights to any tokens. It is the Client’s
            full responsibility to verify the identity, legitimacy, and authenticity
            of assets purchased through the Platform. Despite any indicators or
            messages that may suggest verification, the Service Provider does not
            make any claims regarding the identity, legitimacy, or authenticity of
            assets on the Platform or any supposed subsequent transactions.
          </ListItem>
          <ListItem>
            The Client may use the interface of the Website solely at his/her own
            risk and accepts that the Service Provider shall not be liable for any
            damages arising from the use of the Website with particular reference to
            the liability for intentional or criminal damage or breach of contract
            causing harm to life, physical health or health or any property damage,
            or other direct, indirect, special, consequential or punitive damages,
            losses or expenses suffered or incurred by the Client.
          </ListItem>
          <ListItem>
            The Service Provider shall not be held responsible or liable for any
            losses, damages, or claims arising from the Client’s use of the Services,
            including, but not limited to, the following: (i) user errors like
            forgotten passwords, incorrectly constructed transactions, or mistyped
            wallet addresses; (ii) server failures or data loss; (iii) issues with
            cryptocurrency wallets or corrupted files; (iv) unauthorized access to
            the interface; (v) errors in the proposal converter; or (vi) any
            third-party activities, such as viruses, phishing, brute forcing, or
            other means of attack against any blockchain network underlying the
            interface.
          </ListItem>
          <ListItem>
            When processing a Service, Guild may need to share your user information
            with other contractual third parties, or as mandated by applicable laws
            or requested by a lawful government authority. By using the Service, you
            grant Guild full permission and authority to share this information with
            such contractual third parties or as required by law, and you release
            Guild from any liability, error, mistake, or negligence related to such
            sharing.
          </ListItem>
          <ListItem>
            By using the Interface, you confirm that you are aware of the inherent
            risks associated with cryptographic and blockchain-based systems. You
            possess a working understanding of digital assets like Ethereum.
            Moreover, you recognize the highly volatile nature of the markets for
            these digital assets, influenced by factors such as adoption,
            speculation, technology, security, and regulation. You understand that
            the costs and transaction speeds of cryptographic and blockchain-based
            systems can vary and may change unexpectedly.
          </ListItem>
          <ListItem>
            Furthermore, you acknowledge the potential risk of your digital assets
            losing some or all of their value during transactions involving the
            Interface. We want to clarify that we cannot be held responsible for
            these market variables or risks, nor can we be held liable for any losses
            you may experience while using the Services. Consequently, you fully
            comprehend and agree to assume all the risks related to accessing, using,
            and interacting with the Services.
          </ListItem>
          <ListItem>
            The Client shall ensure that the use of the Website does not directly or
            indirectly violate the rights of third parties or the law.
          </ListItem>
          <ListItem>
            The Client agrees to indemnify and hold the Service Provider, along with
            its officers, directors, employees, and agents, harmless from any claims,
            disputes, demands, liabilities, damages, losses, and costs and expenses,
            including reasonable legal and accounting fees, arising from or related
            to (i) the use of the Services, (ii) the Client’s user content, or (iii)
            any violation of these Terms.
          </ListItem>
          <ListItem>
            To the fullest extent permitted by law, neither the Service Provider nor
            its affiliates involved in creating, producing, or delivering the
            Services and Platform will be liable for any incidental, special,
            exemplary, or consequential damages. This includes damages for lost
            profits, lost revenues, lost savings, lost business opportunities, loss
            of data or goodwill, service interruption, computer damage, or system
            failure, or the cost of substitute services of any kind. Such liability
            arises out of or in connection with these Terms or from the use of, or
            inability to use the Services. This applies whether the claim is based on
            warranty, contract, tort (including negligence), product liability, or
            any other legal theory. It is irrespective of whether the Service
            Provider or its affiliates were informed of the possibility of such
            damages. Even if a limited remedy set forth herein is found to have
            failed of its essential purpose, the limitations of liability shall
            remain.
          </ListItem>
          <ListItem>
            To the maximum extent allowed by the law in the Client’s jurisdiction, in
            no event will the Service Provider's total liability arising out of or in
            connection with these Terms or from the use of, or inability to use, the
            Services exceed the amounts you have paid or are payable to the Service
            Providerfor the use of the Services. If the Client has not had any
            payment obligations to the Service Provider, the maximum liability will
            be one hundred euros (€100), as applicable.
          </ListItem>
          <ListItem>
            The exclusions and limitations of damages stated above are fundamental
            elements of the agreement between the Service Provider and the Client.
          </ListItem>
        </OrderedList>
      </section>

      <section>
        <Heading as="h2">GENERAL RULES FOR THE USE OF THE SERVICES</Heading>

        <OrderedList start={44}>
          <ListItem>
            The use of any meta tags or other hidden text or metadata that includes
            Service Provider's trademark, logo, URL, or product name is strictly
            prohibited without the express written consent of the Service Provider.
          </ListItem>
          <ListItem>
            The Client shall not send unsolicited or unauthorized advertising,
            promotional materials, emails, junk mail, spam, chain letters, or any
            other form of solicitation through the Platform.
          </ListItem>
          <ListItem>
            The Client shall not engage in deceptive, unfair, objectionable or
            manipulative economic activities in any way or using the Platform or
            Services to conceal economic activity, advertise or offer to sell or buy
            any goods or services for any business purpose that is not specifically
            authorized; further or promote any criminal activity or enterprise or
            provide instructional information about illegal activities, including for
            the purpose of concealing economic activity, laundering money, or
            financing terrorism;
          </ListItem>
          <ListItem>
            The Client shall not use the Platform or Services or any part thereof for
            any commercial purpose or for the benefit of any third party, or in any
            manner that is not permitted by these Terms
          </ListItem>
          <ListItem>
            To maintain a respectful environment, the Client shall avoid posting,
            uploading, publishing, submitting, or transmitting any content that:
            <UnorderedList>
              <ListItem>
                Promotes discrimination, bigotry, racism, hatred, harassment, or harm
                against any individual or group.
              </ListItem>
              <ListItem>
                Encourages conduct that would lead to civil liability or violates any
                applicable law or regulation.
              </ListItem>
              <ListItem>
                Infringes, misappropriates, or violates a third party's intellectual
                property rights, patent, copyright, trademark, trade secret, moral
                rights, or rights of publicity or privacy.
              </ListItem>
              <ListItem>
                Promotes illegal or harmful activities or substances.
              </ListItem>
              <ListItem>
                Contains violent or threatening content or encourages violence or
                actions that are threatening to any person or entity.
              </ListItem>
              <ListItem>
                Contains defamatory, obscene, pornographic, vulgar, or offensive
                material.
              </ListItem>
              <ListItem>
                Includes fraudulent, false, misleading, or deceptive information.
              </ListItem>
            </UnorderedList>
          </ListItem>
          <ListItem>
            The Client shall not use any robot, spider, site search/retrieval
            application, or other device to retrieve or index any portion of the
            Platform or the content posted on the Platform, or to collect information
            about its Clients for any unauthorized purpose;
          </ListItem>
          <ListItem>
            Accessing or using the Platform to create, list, or purchase assets that
            are redeemable for financial instruments, assets granting Clients rights
            to participate in an ICO or any securities offering, or assets providing
            Creators, Recipients, or users with financial rewards is strictly
            prohibited. This encompasses activities such as decentralized finance
            (DeFi) yield bonuses, staking bonuses, and burn discounts. Nevertheless,
            it's important to clarify that this restriction does not hinder the legal
            use of any proceeds resulting from your permissible use of the Platform.
          </ListItem>
          <ListItem>
            The Service Provider is under no obligation to constantly monitor access
            or usage of the Platform and Services, nor to review or edit any content.
            Nevertheless, the Service Provider retains the right to do so in order to
            operate the Platform, ensure adherence to these Terms, and comply with
            applicable laws or legal requirements. The Service Provider reserves the
            discretion, though not the obligation, to remove or disable access to any
            content, including user content, at any time and without prior notice if
            the Service Provider deems it objectionable or in violation of these
            Terms, based on its sole judgment.
            <br />
            <br />
            The Client shall be responsible for maintaining the confidentiality of
            his/her account login information and shall be fully responsible for all
            activities that occur under his/her account including all consequences
            under applicable laws. The Client agrees to immediately notify Guild of
            any unauthorized use, or suspected unauthorized use of your account or
            any other breach of security.
          </ListItem>
        </OrderedList>
      </section>

      <section>
        <Heading as="h2">WITHDRAWAL INFORMATION</Heading>

        <OrderedList start={52}>
          <ListItem>
            If the Service Provider offers a Service in respect of which the Client
            has the right of withdrawal provided for in Article 20 of Government
            Decree 45/2014 (26.II.) (hereinafter referred to as "Consumer Contract
            Decree"), the Service Provider shall create the conditions for the Client
            to exercise it properly.
          </ListItem>
          <ListItem>
            Service Provider gives the following information to the Client in
            accordance with the Government Decree
            <UnorderedList fontStyle="italic">
              <ListItem>
                The Client has 14 days to withdraw from the contract without giving
                any reason. Likewise, if the contract for the provision of services
                has started, the Client has the right to terminate the contract
                without giving any reason within 14 days.
              </ListItem>
              <ListItem>
                If the Client wishes to exercise his/her right of withdrawal, the
                Client must send a clear statement of his/her intention to withdraw
                (for example, by electronic mail) to the addresses provided by the
                Service Provider. For this purpose, the Client may also use the model
                declaration of withdrawal below or submit any other declaration
                clearly expressing your intention to withdraw, for example in
                electronic form.
              </ListItem>

              <SampleWithdrawalNotice />

              <ListItem>
                The Client will exercise his/her right of withdrawal in time if the
                Client sends his/her withdrawal notice before the 14-day deadline.
                The Client can also exercise his/her right of withdrawal from the day
                of conclusion of the contract until the day of the start of the
                service.
              </ListItem>
            </UnorderedList>
            <Text>Legal effects of withdrawal:</Text>
            <UnorderedList fontStyle="italic">
              <ListItem>
                If the Client withdraws from this contract, Service Provider will
                refund any consideration paid by you immediately, but no later than
                14 days after receipt of the Client’s notice of withdrawal. The
                refund will be made by the same method of payment as the original
                transaction, unless the Client expressly agrees to a different method
                of payment.
              </ListItem>
            </UnorderedList>
          </ListItem>

          <ListItem>
            The Service Provider explicitly draws the Client's attention to the fact
            that the Client may not exercise his/her right of withdrawal in the cases
            provided for in Article 29 (1) of the Consumer Contract Decree, in
            particular:
            <UnorderedList fontStyle="italic">
              <ListItem>
                after the full performance of the service, but where the contract
                imposes a payment obligation on the consumer, this exception may be
                invoked only if performance has begun with the consumer's express
                prior consent and the consumer's acknowledgement that he will lose
                his right of withdrawal once the business has performed the contract
                in full;
              </ListItem>
              <ListItem>
                in respect of digital content supplied on a non-tangible medium,
                where the seller has begun performance with the consumer's express
                prior consent and the consumer has, at the same time as giving that
                consent, acknowledged that he has lost his right of withdrawal once
                performance has begun and the undertaking has sent the consumer a
                confirmation.
              </ListItem>
            </UnorderedList>
          </ListItem>

          <ListItem>
            In the event that the Service Provider accepts the withdrawal and the
            original situation has been restored and decides to refund the Client,
            the Service Provider shall refund the Client the total amount paid by the
            Client as consideration, including the costs incurred in connection with
            the performance.
          </ListItem>
        </OrderedList>
      </section>

      <section>
        <Heading as="h2">INTELLECTUAL PROPERTY RIGHTS</Heading>

        <OrderedList start={56}>
          <ListItem>
            The Client undertakes to respect and not to infringe the intellectual
            property rights of the Service Provider, including the computer program
            works of the Service Provider running on the website.
          </ListItem>
          <ListItem>
            Through the Service Provider’s Platform, the Client may have the option
            to store or share various types of content, such as text (in posts or
            communications with others), files, documents, graphics, images, music,
            software, audio, and video. All content that you post or make available
            through the Platform and Services, is collectively referred to as "User
            Content." It is important to note that the Service Provider does not
            claim any ownership rights over the Client’s User Content, and these
            Terms do not limit any rights the Client may have to his/her User
            Content. By making any User Content available through the Platform, the
            Client grants the Service Provider a non-exclusive, transferable,
            worldwide, royalty-free license with the right to sublicense. This
            license allows the Client to use, copy, modify, create derivative works,
            distribute, publicly display, and publicly perform the Client’s User
            Content in connection with operating and providing the Platform. Certain
            content accessible through the Platform may be subject to intellectual
            property rights, and the Service Provider retains all rights to such
            content.
          </ListItem>
          <ListItem>
            The Client holds sole and full responsibility for all User Content he/she
            shares. By providing User Content through the Platform, the Client
            represents and warrants that he/she possess, and will continue to
            possess, all necessary rights to grant the Service Provider the license
            rights to use his/her User Content as described in these Terms.
            Furthermore, the Client affirms that neither his/her User Content nor the
            act of making it available through the Platform will infringe upon,
            misappropriate, or violate any third party's intellectual property
            rights, rights of publicity or privacy, or result in a violation of any
            applicable law or regulation.
          </ListItem>
          <ListItem>
            The entire content of the Website, in particular the data, information,
            images, descriptions, texts, graphics and the design, appearance and
            structure of the Website, the implementation of certain functions, are
            the exclusive property of the Service Provider or the Service Provider
            has the right to use them and as such are protected by copyright under
            under Act LXXVI of 1999 on Copyright (the "Copyright Act"). Their use
            without the prior written consent of the Service Provider infringes the
            copyright of the Service Provider and shall entail legal consequences.
            Links to the Website may be placed on other sites, provided that the link
            leads to the main page of the Website, but links to internal pages of the
            Website are only permitted with the prior consent of the Service Provider
            in the case of links to the content of the entire page. In no case may
            the link be made in such a way that the Website or any of its internal
            pages or content is perceived as the content of another website.
          </ListItem>
          <ListItem>
            Under no circumstances shall the use of the Service result in the source
            code being reverse-engineered, reversed or in any other way infringed by
            anyone in any way of the Service Provider's intellectual property rights.
            It is also prohibited to adapt or reverse engineer the content of the
            Website or any part of it; to use any application that can modify or
            index the Website or any part of it (e.g. search engine or any other
            reverse engine).
            <br />
            <br />
            We welcome and appreciate any feedback, comments, ideas, proposals, and
            suggestions for improving the Platform ("Feedback"). If you choose to
            submit Feedback, you agree that we have the freedom to use it (and allow
            others to use it) without any restrictions or compensation to you.
          </ListItem>
        </OrderedList>
      </section>

      <section>
        <Heading as="h2">INFORMATION PROVIDED UNDER THE LEGISLATION</Heading>

        <OrderedList start={61}>
          <ListItem>
            Information provided pursuant to E-Commerce Act, regardless of whether
            the Service Provider provides its services free of charge: Z Gen
            Kibernetika Kft. (registered seat: 6720 Szeged, Kelemen László utca 11.,
            registration number: 06-09-025397, tax number: 26787015-2-06, EUID:
            HUOCCSZ.06-09-025397)
            <UnorderedList>
              <ListItem>
                Name of the Service Provider: Z Gen Kibernetika Kft.
              </ListItem>
              <ListItem>
                Registered office of the Service Provider: 6720 Szeged, Kelemen
                László utca 11.
              </ListItem>
              <ListItem>
                Company registration number of the Service Provider: 06-09-025397
              </ListItem>
              <ListItem>Tax number of the Service Provider: 26787015-2-06</ListItem>
              <ListItem>EUID of the Service Provider: HUOCCSZ.06-09-025397</ListItem>
              <ListItem>
                Representative of the Service Provider: Zawiasa Brúnó Márton
              </ListItem>
              <ListItem>
                E-mail address of the service provider: raz@zgen.hu
              </ListItem>
              <ListItem>Provider's telephone number: </ListItem>
              <ListItem>
                The person providing hosting services to the Service Provider and his
                contact details:
              </ListItem>
            </UnorderedList>
          </ListItem>
          <ListItem>
            The Contract concluded by using the Website is free of charge – with some
            exceptions – and is concluded by accessing or using the Website in
            English. The Contract does not constitute a written contract and is not
            registered by the Service Provider.
          </ListItem>
          <ListItem>
            Information provided pursuant to Consumer Contract Decree is applicable
            regardless of the fact that all services provided by the Servie Provider
            are free of charge and without time and space restriction.
          </ListItem>
          <ListItem>
            The Service Provider has taken the necessary security measures in
            connection with the operation of the Website, which includes the
            protection of all data content generated in connection with the use of
            the Website.
          </ListItem>
        </OrderedList>
      </section>

      <section>
        <Heading as="h2">COMPLAINT HANDLING</Heading>

        <OrderedList start={65}>
          <ListItem>
            The Service Provider's aim is to provide the Service in a satisfactory
            quality and to the Client's full satisfaction. If the Client, who is a
            consumer, has a complaint about the Service and its performance, he may
            communicate his complaint to the contact details provided in clause 63.
          </ListItem>
          <ListItem>
            The Service Provider shall immediately investigate the oral complaint and
            remedy it as necessary. If the Client does not agree with the handling of
            the complaint, the Service Provider shall immediately take a record of
            the complaint and its position on the complaint and provide a copy of the
            record to the Client by e-mail. If it is not possible to investigate the
            complaint immediately, the Service Provider shall take a record of the
            complaint and provide a copy of the record to the Client by e-mail.
          </ListItem>
          <ListItem>
            The Service Provider shall reply to the written complaint in writing by
            e-mail within 30 days, giving reasons for its rejection of the complaint.
            The Service Provider shall keep a copy of the reply for 3 years and shall
            present it to the supervisory authorities upon request.
          </ListItem>
          <ListItem>
            If the Client does not agree with the outcome of the complaint handling,
            Service Provider provides the following information to Clients who are
            consumers under the applicable legislation:
            <OrderedList type="a" fontStyle="italic">
              <ListItem>
                In such a case, you may contact the Consumer Protection Department of
                the competent Government Office or one of the conciliation bodies
                attached to the Chamber of Commerce and Industry. In cases of
                administrative authority for consumer protection, the district office
                or the district office of the county seat shall act in accordance
                with Government Decree 387/2016 (XII. 2.) on the designation of a
                consumer protection authority. The contact details of the district
                offices can be found at{" "}
                <Link
                  href="http://www.kormanyhivatal.hu"
                  target="_blank"
                  colorScheme="blue"
                >
                  www.kormanyhivatal.hu
                </Link>{" "}
                while the information on the conciliation bodies can be found by
                clicking on the "Bodies" (Testületek) menu (
                <Link
                  href="http://wbekeltetes.hu/udvozlo"
                  target="_blank"
                  colorScheme="blue"
                >
                  bekeltetes.hu/udvozlo
                </Link>
                )
              </ListItem>
              <ListItem>
                Conciliation bodies can help to resolve consumer disputes out of
                court in a much faster and more cost-effective way. Their aim is to
                reach an agreement between the parties. However, their decisions are
                not binding in the absence of a declaration of acceptance. On
                request, the conciliation body can advise on the rights and
                obligations of consumers.
              </ListItem>
              <ListItem>
                In case of a consumer complaint, you can also use the EU online
                dispute resolution platform, which requires a simple registration on
                the European Commission's website. The online platform is available
                at{" "}
                <Link
                  href="https://ec.europa.eu/consumers/odr/main/index.cfm?event=main.home.show&lng=HU"
                  target="_blank"
                  colorScheme="blue"
                >
                  ec.europa.eu/consumers/odr/main/index.cfm?event=main.home.show&lng=HU
                </Link>
              </ListItem>
              <ListItem>
                The Service Provider has a duty to cooperate in conciliation board
                proceedings by sending a letter of reply to the conciliation board
                and, if it is established in the county, by ensuring the
                participation of a person authorised to negotiate a settlement at the
                hearing.
              </ListItem>
              <ListItem>
                As a last resort, the consumer can also take the matter to the
                competent court, where he or she can even lodge a complaint on a
                complaint day. Documentary evidence is still essential.
              </ListItem>
            </OrderedList>
          </ListItem>
        </OrderedList>
      </section>

      <section>
        <Heading as="h2">Final Provisions</Heading>

        <OrderedList start={69}>
          <ListItem>
            The contract concluded under these GTC between the Service Provider and
            the Client establishes a contractual relationship solely for the
            Services, does not create an employment relationship between them and
            cannot be construed as an employment contract by either party.
          </ListItem>
          <ListItem>
            The Parties shall accept statements sent by SMS or e-mail as written.
          </ListItem>
          <ListItem>
            The parties agree that, taking into account the above, they shall
            communicate with each other primarily by electronic means, by sending an
            e-mail to the e-mail address uploaded by the Client at the time of
            purchase and by sending an e-mail to the e-mail address of the Service
            Provider The parties undertake to maintain the e-mail addresses mentioned
            above for the duration of the present contract and to monitor the
            messages received. Any statement sent electronically to the other Party
            to the designated e-mail address shall be deemed to have been
            communicated on the business day following the day on which it was sent,
            regardless of when it became available to the Party to which it was sent.
          </ListItem>
          <ListItem>
            The Parties stipulate that a declaration sent by registered mail to the
            registered office or residence of the Party to whom the offer is
            addressed shall be deemed to have been communicated on the 5th (fifth)
            working day following the date indicated on the offer coupon as the date
            of dispatch.
          </ListItem>
          <ListItem>
            The Parties shall notify the other Party of any changes in their data
            registered in the Commercial Register, in particular in their address,
            registered office, representatives, bank account number or personal data
            within 3 (three) days of the change.
          </ListItem>
          <ListItem>
            The Customer declares that the conclusion of the contract and the
            statements made by the Customer were not made in error or on the basis of
            false assumptions, and that the statements contained therein reflect a
            genuine and actual decision of the Customer's will.
          </ListItem>
          <ListItem>
            If any provision or part of a provision of the GTC is invalid or
            unenforceable, this shall not affect the validity of the remaining
            provisions of the GTC. The parties hereby undertake to replace in such
            case the invalid or unenforceable provision by a valid or enforceable
            provision which is as consistent as possible with the spirit and purpose
            of the provision to be replaced.
          </ListItem>
          <ListItem>
            These Terms and Conditions constitute a single statement of intent for
            the transactional purpose described above, and therefore its division
            into sections and subheadings is for convenience of reading and reference
            only, but shall in no way affect its content, interpretation, application
            or the intended transactional purpose of either Party in this Agreement,
            and therefore shall not be construed or relied upon to have such effect
            or purpose.
          </ListItem>
          <ListItem>
            Statements, authorisations, objections and agreements made orally or in
            writing or in any other form in the course of pre-contractual
            consultations and negotiations on the subject matter of the GTC shall not
            be binding on the Parties.
          </ListItem>
          <ListItem>
            The Parties declare that they will not conceal from each other any fact
            or circumstance relevant to the contract when concluding the contract for
            the use of the Services.
          </ListItem>
          <ListItem>
            The Service Provider shall not be liable for any damage caused by the use
            of the Website. The User shall be responsible for the protection of the
            device used for Internet communication and the data contained thereon.
            The Service Provider shall not be liable for any errors or mistakes on
            the Website.
          </ListItem>
          <ListItem>
            The Service Provider conducts its data processing in a GDPR-compliant
            manner, further details of which can be found in the published privacy
            notice.
          </ListItem>
          <ListItem>
            The Service Provider reserves all rights to distribute and copy any part
            of its Website by any means. Without the prior written consent of the
            Service Provider, any use based on the Copyright Act of the whole or
            parts of the Websites (reproduction, distribution, adaptation, etc.)
          </ListItem>
          <ListItem>
            Any unauthorised use will lead to civil and criminal penalties and
            liability for damages. By using the Website, the Customer acknowledges
            that the Service Provider shall be entitled to a penalty in the event of
            any unauthorised use of its content. The amount of the penalty is HUF
            30.000 per image and HUF 2.000 per word. The Client acknowledges that
            this penalty is not excessive and browses the Site with this in mind.
          </ListItem>
          <ListItem>
            If the Service Provider does not exercise its rights under these GTC, the
            failure to exercise such rights shall not be deemed a waiver of such
            rights. A waiver of any right hereunder shall be valid only upon the
            express written declaration to that effect. The occasional failure of the
            Service Provider to strictly adhere to any term or condition of the GTC
            shall not constitute a waiver of its subsequent strict adherence to such
            term or condition.
          </ListItem>
          <ListItem>
            These GTC and the contract of sale shall be governed by Hungarian law.
            The Parties shall attempt to resolve any disputes relating to these GTC
            and the contract of sale by amicable means. The Parties expressly
            stipulate the jurisdiction of the Hungarian court and, depending on its
            jurisdiction, the exclusive jurisdiction of the Szeged District Court in
            the settlement of any disputes that cannot be settled amicably.
          </ListItem>
          <ListItem>
            The current version of the GTC shall be published by the Service Provider
            on the Website; in the event of a dispute between the parties regarding
            the current version of the GTC, the latest version published on the
            Website shall prevail.
            <br />
            <br />
            With regard to issues not regulated in these GTC, the Service Provider
            shall be governed by the Hungarian laws and regulations in force at the
            time and applicable to its business activities constituting the Service,
            in particular the provisions of the Civil Code, without any special
            stipulation.
          </ListItem>
          <ListItem>
            Please only use the Services if you agree to the above.
          </ListItem>
          <ListItem>
            These General Terms and Conditions are effective from 2023.10.01.
          </ListItem>
          <ListItem>
            To download and view these Terms and Conditions in a printer-friendly
            format, please click{" "}
            <Link href="/guild-gtc.pdf" target="_blank" colorScheme="blue">
              here
            </Link>
            .
          </ListItem>
        </OrderedList>
      </section>

      <Text>Szeged, 2023.10.01.</Text>
    </Stack>
  </Layout>
)

const SampleWithdrawalNotice = () => (
  <Box borderWidth={1} borderRadius="2xl" padding={8} my={4}>
    <Heading as="h3" fontSize="md" mb="1!important">
      Sample withdrawal/cancellation notice
    </Heading>
    <Text colorScheme="gray" mt={0}>
      (fill in and return only if you wish to withdraw from the contract)
    </Text>

    <Stack sx={{ p: { mb: 1 } }}>
      <Text>
        Addressee [insert the name, postal address and e-mail address of the
        company]:
      </Text>
      <Text>
        The undersigned(s) declare(s) that I/we exercise my/our right of
        withdrawal/cancellation in respect of the contract for the purchase of the
        following good(s) or the provision of the following service(s):
      </Text>
      <Text>Date of conclusion/acceptance of the contract:</Text>
      <Text>Name of consumer(s):</Text>
      <Text>Address of consumer(s):</Text>
      <Text mt={8}>
        Signature of the consumer(s) (in case of paper declaration only):
      </Text>
      <Text>Dated</Text>
    </Stack>
  </Box>
)

export default Page
