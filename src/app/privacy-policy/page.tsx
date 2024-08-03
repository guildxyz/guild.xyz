import { Header } from "@/components/Header"
import {
  Layout,
  LayoutHeadline,
  LayoutHero,
  LayoutMain,
  LayoutTitle,
} from "@/components/Layout"
import { Anchor } from "@/components/ui/Anchor"

export const metadata = {
  title: "Privacy Policy",
}

const Page = (): JSX.Element => (
  <Layout>
    <LayoutHero className="pb-28">
      <Header />
      <LayoutHeadline className="max-w-screen-md">
        <LayoutTitle className="text-foreground">Privacy Policy</LayoutTitle>
      </LayoutHeadline>
    </LayoutHero>

    <LayoutMain className="prose flex max-w-screen-md flex-col prose-headings:font-display prose-headings:text-foreground prose-li:text-foreground text-foreground marker:text-foreground">
      <section>
        <h2>Welcome to Guild.xyz!</h2>
        <p>
          Guild.xyz is an online platform for automated membership management of
          communities based on blockchain. This notice summarizes how we collect, use
          and safeguard the information you provide to us and what choices you have
          with respect to your privacy.
        </p>
        <p>
          This notice applies to the data processing of Z Gen Kibernetika Korlátolt
          Felelősségű Társaság (registered seat: 6720 Szeged, Kelemen László utca
          11., company registration number: Cg.06-09-025397, tax number:
          26787015-2-06) ("Us") and its relevant Affiliates (as specified below) in
          relation to our Services and our Website available at{" "}
          <Anchor href="/" variant="highlighted">
            https://guild.xyz/
          </Anchor>
          .
        </p>

        <p>
          As a Customer, Guild Admin or Subscriber of our Services, the collection,
          use and sharing of your personal data is subject to this notice. Please
          note that this notice does not apply to any Third-Party Platforms connected
          with your profile via the Services, or to the privacy practices of any
          Guilds that you join. Unless defined otherwise, capitalized terms in this
          notice will have the same meaning as in the Terms of Use.
        </p>
      </section>
      <section>
        <h2>What type of data do we collect?</h2>
        <p>
          When you use our Services, we need to process some information about you to
          make our Services work and to evaluate how you use our Services. This
          information may include personal data about you, such as:
        </p>

        <ol type="a">
          <li>
            <b>Registration data</b>: When you create your profile, we will request
            certain information about you, such as your public wallet address, a
            social media ID or you email address. If you do not provide this
            information, you may not be able to enjoy all features of the Services
          </li>

          <li>
            <b>Social account information</b>: If you decide to connect a certain
            third-party account with our platform, by providing your credentials and
            authorizing the relevant platform to share certain data with us, we will
            access and process such data relating to your social account. Such data
            may include:
            <table className="my-4">
              <thead>
                <tr>
                  <th>Third-party Platform</th>
                  <th>Scope of data</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td>Discord</td>
                  <td>
                    Username, avatar, banner, the discord servers you have joined,
                    and specific discord server information (such as nickname,
                    avatar, roles etc.)
                  </td>
                </tr>

                <tr>
                  <td>Twitter</td>
                  <td>
                    Twitter account information (such as your name, profile picture
                    and description), information about your posts and followers, the
                    lists you have created or are a member of
                  </td>
                </tr>

                <tr>
                  <td>Google</td>
                  <td>
                    Email address and profile information (including any information
                    you have made publicly available)
                  </td>
                </tr>

                <tr>
                  <td>GitHub</td>
                  <td>
                    User profile data, public and private repositories, commit
                    statuses, repository invitations, collaborators, deployment
                    statuses, and repository webhooks
                  </td>
                </tr>
              </tbody>
            </table>
            Whether or not you will share such information with us is entirely up to
            you. Upon your consent, we may also share such information with the
            Guilds selected by you.
          </li>

          <li>
            <b>Membership information</b>: When you create or join a Guild, we will
            process information about your Roles, Rewards as well as any Requirements
            that you have set or completed. Such data is necessary for us to provide
            the Services. Please note that this information will also be available
            for others you collaborate with, in particular for the relevant Guilds
            that you have joined and with whom you decide to share your Profile.
          </li>

          <li>
            <b>Blockchain information</b>: Depending on your choices, you may enter
            into different transactions with others via our platform. In such cases,
            information about your transactions (such as the public address of your
            digital wallet, the public address of the addressee’s digital wallet,
            block number, timestamp and other input data) that may also include
            personal data about you may be stored on a blockchain through the
            execution of smart contracts.
          </li>

          <li>
            <b>Content that you upload to the Services</b>: You may also upload
            content to the Services, such as your profile picture and background.
            Such content may include personal data about you.
          </li>

          <li>
            <b>Billing and subscription information</b>: If you subscribe to a paid
            Service, you need to provide certain billing information (such as your
            name, address and VAT number). You will also be required to provide
            payment information, such as payment card details, which we collect via
            our secure payment processing service providers, Stripe Inc and Coinbase
            Ireland Limited. This data is necessary to provide you with our
            Subscription Services.
          </li>

          <li>
            <b>Other information</b>: You may decide to share further information,
            including personal data, with us when you contact us, provide feedback to
            us regarding the Services or otherwise communicate with us. It is solely
            your decision to share any other data with us during such communications,
            so our processing of such data will be based on your consent.
          </li>

          <li>
            <b>Information about your use of the Services</b>: As most websites and
            services provided through the Internet, we gather certain information and
            store it in log files when you interact with our Services. This
            information includes internet protocol (IP) address, as well as browser
            type and browser version, operating system, screen resolution and device
            type.
          </li>

          <li>
            <b>Cookie information</b>: When you access our websites and Services, we
            use cookies and other information gathering technologies for a variety of
            purposes. These technologies may provide us with personal data,
            information about devices and networks you utilize to access our website,
            and other information regarding your interactions. For detailed
            information about the use of cookies, please see our Cookie Notice
          </li>
        </ol>
      </section>
      <section>
        <h2>Why do we process your data?</h2>
        <p>
          We may process your personal data for several purposes. How we use your
          personal data depends on your on how you use the Services and your
          preferences you have communicated to us.
        </p>
        <ol type="a">
          <li>
            <b>Services</b>: We will use some of your personal data for the provision
            and maintenance of your profile, and for authentication purposes. E.g. We
            use your public digital wallet address to enable you to login to our
            Services.
          </li>
          <li>
            <b>Billing</b>: We will process certain information, such as financial
            data for billing purposes, i.e. to complete transactions, and send you
            purchase confirmations and invoices.
          </li>
          <li>
            <b>Customer support</b>: If needed, we use data (which can include your
            communications) to investigate, respond to and resolve complaints
            relating to our Services.
          </li>
          <li>
            <b>Developing Services</b>: We use analytics to better understand the
            behavior of our users to grow our business. For this purpose, we collect
            certain information, such as how often our Services are used, and the
            events that occur while using our websites. We use this aggregate
            information to identify usage patterns and trends.
          </li>
          <li>
            <b>Communication</b>: We may send you information regarding the Services,
            such as administrative messages, to your email address or public wallet
            address provided to us. Upon your consent, we may also enable
            communications between you and others through our Services.
          </li>
          <li>
            <b>Marketing</b>: Upon your consent, we may use your email address to
            send you marketing communications and to provide you with updates about
            our services and products.
          </li>
          <li>
            <b>Security</b>: We use information about you to secure your profile,
            verify accounts, to monitor suspicious or fraudulent activity and to
            identify violations of our Terms of Use or Master Subscription Agreement.
          </li>
          <li>
            <b>Protecting our legitimate business interests and legal rights</b>:
            Where required by law or where we believe it is necessary to protect our
            legal rights, interests and the interests of others, we use information
            about you in connection with legal claims, compliance, regulatory, and
            audit functions, and disclosures in connection with the acquisition,
            merger or sale of our business.
          </li>
          <li>
            <b>Other</b>: We may also process your data for any other purposes for
            which we obtain your consent where necessary or otherwise in accordance
            applicable law and this policy.
          </li>
        </ol>
      </section>
      <section>
        <h2>What is the legal basis of our data processing? (for EEA users)</h2>
        <p>
          If you are an individual in the European Economic Area (EEA), we collect
          and process information about you only where we have legal bases for doing
          so under applicable EU laws. This means we collect and use your information
          only where:
        </p>
        <ul>
          <li>
            It is necessary in order to provide you the Services, including to set up
            and maintain your profile and to provide customer support;
          </li>
          <li>
            It satisfies a legitimate interest (which is not overridden by your data
            protection interests), such as for research and development, and to
            protect our legal rights and interests;
          </li>
          <li>You give us consent to do so for a specific purpose;</li>
          <li>It is needed to comply with a legal obligation.</li>
        </ul>
      </section>

      <section>
        <h2>Do we share your data with third parties?</h2>
        <p>
          We never sell your personal data to third parties. However, in certain
          cases we need to share your personal data with our Affiliates and third
          parties. In any case, we will share your personal data only in accordance
          with applicable laws and this notice, and in the following cases:
        </p>

        <ol type="a">
          <li>
            <b>Guild owners</b>: Depending on your use of the Services, you may
            decide to share certain personal data with others. In particular, if you
            join a Guild, the Administrators of the relevant Guild may get access to
            your personal data in the course of the management of their Guild.
            Besides, you may also decide to share additional information, such as
            enhanced details with our Subscribers. If you have any questions about
            the data processing practices of the relevant Guild, you should consult
            their Privacy Policy.
          </li>

          <li>
            <b>Public blockchain</b>: When you initiate a blockchain transaction,
            then your data will be shared with the blockchain so that a verifiable
            proof is created of your transaction, your membership or attendance of
            certain events.
          </li>

          <li>
            Third-party service providers: In certain cases, we use third party data
            providers. For example, we may outsource billing and payment transactions
            to third parties, we may engage hosting service providers, IT providers,
            operating systems and platforms, internet service providers, and data
            analytics companies.
            <br />
            Currently, these third parties include the following providers:
            <br />
            <ul>
              <li>
                <b>Google LLC</b>, for data hosting,
              </li>
              <li>
                <b>Ipfs</b>, for storing and sharing files,,
              </li>
              <li>
                <b>Posthog Inc</b>, for product analytics,,
              </li>
              <li>
                <b>Datadog Inc</b>, to monitor, troubleshoot and optimize application
                performance,,
              </li>
              <li>
                <b>Intercom R&D Unlimited Company</b> for customer communications,
                and,
              </li>
              <li>
                <b>Plausible</b>, for data analytics.
              </li>
            </ul>
            <p>
              If you purchase through our website, depending on the payment method
              you choose, your payment and subscription information will be processed
              by:
            </p>
            <ul>
              <li>
                <b>Stripe Inc</b>, in accordance with its{" "}
                <Anchor href="https://stripe.com/privacy" variant="highlighted">
                  Privacy Policy
                </Anchor>
                , or
              </li>
              <li>
                <b>Coinbase Ireland Limited</b>, in accordance with its{" "}
                <Anchor
                  href="https://www.coinbase.com/legal/privacy"
                  variant="highlighted"
                >
                  Privacy Policy
                </Anchor>
                .
              </li>
            </ul>
            In the case of certain transactions, your transaction data may also be
            stored on the blockchain as specified in section b) above.
          </li>

          <li>
            <b>Professional advisors</b>: We may share your data with professional
            advisers acting as service providers, processors, controllers, or joint
            controllers - including lawyers, bankers, auditors, and insurers who
            provide consultancy, banking, legal, insurance and accounting services,
            and to the extent we are legally obliged to share or have a legitimate
            interest in sharing your data.
          </li>

          <li>
            <b>Legal compliance</b>: We may transmit personal data if the applicable
            legal provisions so require, or when such action is necessary to comply
            with any laws, e.g. with criminal authorities if we are required to
            cooperate for such purposes. We may also need to share personal data for
            the protection of our rights and interests, to protect your safety or the
            safety of others or to investigate fraud, in accordance with the
            applicable laws.
          </li>

          <li>
            <b>During a change to our business</b>: If we are involved in a merger,
            acquisition, bankruptcy, dissolution, reorganisation, sale of some or all
            of our assets, or a similar transaction or proceeding, or steps in
            contemplation of such activities, certain information may be shared or
            transferred, subject to standard confidentiality arrangements.
          </li>
        </ol>
      </section>

      <section>
        <h2>Do we share your data with third parties?</h2>
        <p>
          Our website and Services are hosted by Google, in Switzerland. If you
          access our website or Services from any other region of the world with laws
          or other requirements governing personal data collection, use, or
          disclosure that differ from applicable laws in the European Economic Area,
          then through your continued use of our sites and Services, you are
          transferring your data outside of the European Economic Area, and you agree
          to have your data transferred to and processed in different jurisdictions,
          such as the United States.
        </p>
      </section>

      <section>
        <h2>How long will we retain your data?</h2>
        <p>
          We will retain your personal data as long as it is needed to fulfil the
          purposes specified above (for example, to provide you with our Services),
          unless a longer retention period is required or permitted by law (such as
          tax, accounting or other legal requirements). Upon your lawful request or
          when we have no ongoing legitimate business need to process your personal
          data, we will either delete or anonymize it in accordance with our deletion
          policy.
        </p>
        <p>
          With respect to the data stored on the public blockchain, due to the
          immutable nature of the blockchain, your transaction data that may also
          include your public wallet address may not be modified or deleted.
        </p>
      </section>

      <section>
        <h2>You data privacy rights</h2>
        <p>You may ask us to:</p>
        <ul>
          <li>
            provide information to you about the personal data that we or our
            processors process about you,
          </li>
          <li>correct inaccuracies or amend your personal data,</li>
          <li>
            stop processing your personal data and/or to stop sending you marketing
            communications,
          </li>
          <li>delete your personal data.</li>
        </ul>

        <p>
          If you are from a country where the General Data Protection Regulation of
          the EU (GDPR) applies, you may have additional rights such as:
        </p>

        <ul>
          <li>
            In certain circumstances, you may have a broader right to erasure of your
            personal data. For example, if it is no longer necessary in relation to
            the purposes for which it was originally collected. Please note, however,
            that we may need to retain certain information for record keeping
            purposes, to complete transactions or to comply with our legal
            obligations.
          </li>
          <li>
            You may have the right to request that we restrict processing of your
            personal data in certain circumstances (for example, where you believe
            that the personal data we hold about you is inaccurate or unlawfully
            held).
          </li>
          <li>
            In certain circumstances, you may have the right to be provided with your
            personal data in a structured, machine readable and commonly used format
            and to request that we transfer the personal data to another data
            controller without hindrance.
          </li>
        </ul>
      </section>

      <section>
        <h2>Who is responsible for the processing of your data?</h2>
        <p>
          Guild.xyz services are provided by Z Gen Kibernetika Korlátolt Felelősségű
          Társaság (registered seat: 6720 Szeged, Kelemen László utca 11., company
          registration number: Cg.06-09-025397, tax number: 26787015-2-06) and it
          acts as a data controller with respect to the processing of your data.
        </p>
        <p>
          Where you decide that you would like to share data with a Guild, then they
          will be considered as a data controller with respect to their processing.
          To learn more about their data processing practices, you should consult the
          Privacy Policy of the relevant Guild.
        </p>
      </section>

      <section>
        <h2>Children’ privacy</h2>
        <p>
          Our Site and the Service are not directed to anyone under the age of 18.
          The Site does not knowingly collect or solicit information from anyone
          under the age of 18, or allow anyone under the age of 18 to sign up for the
          Service. In the event that we learn that we have gathered information from
          anyone under the age of 18 without the consent of a parent or guardian, we
          will delete that information as soon as possible. If you believe we have
          collected such information, please contact us at{" "}
          <Anchor href="mailto:help@guild.xyz" variant="highlighted">
            help@guild.xyz
          </Anchor>
        </p>
      </section>

      <section>
        <h2>Changes</h2>
        <p>
          We reserve the right to change this notice from time to time. Changes will
          be published on this website and any material changes will go into effect
          eights days following such notification. We encourage you to periodically
          review this page for the latest information on our privacy practices. Your
          continued use of our website or our Services constitutes your agreement to
          be bound by such changes to this notice. Your only remedy, if you do not
          accept the terms of notice, is to discontinue use of our Website and
          Services.
        </p>
      </section>

      <section>
        <h2>Any further questions?</h2>
        <p>
          If you have any further questions in relation to the processing of your
          data, please contact{" "}
          <Anchor href="mailto:help@guild.xyz" variant="highlighted">
            help@guild.xyz
          </Anchor>
          .
        </p>
      </section>
    </LayoutMain>
  </Layout>
)

export default Page
