import { Header } from "@/components/Header"
import {
  Layout,
  LayoutFooter,
  LayoutHeadline,
  LayoutHero,
  LayoutMain,
  LayoutTitle,
} from "@/components/Layout"
import { Anchor } from "@/components/ui/Anchor"

export const metadata = {
  title: "Terms of Use",
}

const Page = (): JSX.Element => (
  <Layout>
    <LayoutHero className="pb-28">
      <Header />
      <LayoutHeadline className="max-w-screen-md">
        <LayoutTitle className="text-foreground">Terms of Use</LayoutTitle>
      </LayoutHeadline>
    </LayoutHero>

    <LayoutMain className="prose prose-counters flex max-w-screen-md flex-col gap-8 prose-headings:font-display prose-headings:text-foreground prose-li:text-foreground text-foreground marker:text-foreground">
      <section>
        <h2>Welcome to Guild.xyz!</h2>
        <p>
          Guild.xyz is an online platform for automated membership management of
          communities based on blockchain. This term of use ("this Agreement")
          governs your access to and use of the services available at{" "}
          <Anchor href="/" variant="highlighted">
            https://guild.xyz/
          </Anchor>{" "}
          ("Website") and any relating technologies, functionalities, features, and
          software (the "Services").
        </p>

        <p>
          The Services are provided by Z Gen Kibernetika Korlátolt Felelősségű
          Társaság (registered seat: 6720 Szeged, Kelemen László utca 11., company
          registration number: Cg.06-09-025397, tax number: 26787015-2-06) ("Service
          Provider" or "Us"). This Agreement is entered into by the individual or
          entity using or accessing the Services (referred to as "Customer" or "You")
          and the Service Provider. If you are agreeing to this Agreement not as an
          individual but on behalf of your organization, this Agreement will bind
          your organization, unless your organization has a separate agreement in
          effect with us. You confirm that you have the necessary authority to enter
          into this Agreement on behalf of your organization before proceeding.
        </p>

        <p>
          By accessing to and using the Services you agree to be bound by this
          Agreement, so please read this document carefully.{" "}
          <b>
            The offering of the Services to you is conditional on your acceptance of
            this Agreement. If you do not agree to this Agreement, you must not
            access or use the Service. Please do not use the Services if you are
            under 18 of age or barred from doing so under applicable law.
          </b>
        </p>
      </section>

      <section>
        <ol>
          <li>
            <b>Service</b>
            <ol>
              <li>
                <b>Scope</b>: This Agreement governs access and use of the Services.
                You may access and use the Services in accordance with this Agreement
                and the Privacy Policy. Certain services or functionalities may be
                subject to additional terms specific to the relevant service or
                functionality ("Feature-Specific Terms") as specified in the relevant
                Feature-Specific Terms which are hereby incorporated into this
                Agreement by reference. By accessing or using the relevant feature,
                you agree to be bound by such Feature-Specific Terms.
              </li>

              <li>
                <b>Changes</b>: The Service Provider may update the Services or
                modify features and functionality from time to time. The Service
                Provider also reserves the right to revise the terms of this
                Agreement from time to time by posting the modified terms on the
                Website, and such amendments will enter into effect eight days after
                its publication. By continuing to access or use the Services after
                the amendment enters into effect, you agree to be bound by the
                revised Agreement.
              </li>
            </ol>
          </li>
        </ol>
      </section>
      <section>
        <ol start={2}>
          <li>
            <b>Using the Services</b>
            <ol>
              <li>
                <b>Access rights</b>: Subject to the terms of this Agreement, the
                Service Provider grants you a limited, non-exclusive,
                non-transferable and revokable right to use the Service during the
                Term. Except as expressly agreed in writing by the Service Provider,
                you shall not distribute, sublicense, transfer, sell, offer for sale,
                disclose, or make available any part of the Service to any third
                party.
              </li>

              <li>
                <b>Eligibility to use</b>: To use the Services, you must be at least
                of legal age (18 years of age or older or otherwise of legal age in
                your resident jurisdiction). You represent and warrant that: (i) you
                are of legal age in your resident jurisdiction, and competent to
                agree to this Agreement; and (ii) you have validly entered into this
                Agreement and have the legal power to do so.
              </li>

              <li>
                <b>Digital wallet</b>: To use our Service, you must use one of the
                supported third-party wallets ("Digital Wallet") which allows you to
                engage in transactions on blockchains. By connecting your Digital
                Wallet, you create a user profile with the Service Provider
                ("Profile"). The Service Provides does not undertake any
                responsibility for, or liability in connection with your use of a
                Digital Wallet and makes no representations or warranties regarding
                how the Service will operate with any specific Digital Wallet.
              </li>
            </ol>
          </li>
        </ol>
      </section>
      <section>
        <ol start={3}>
          <li>
            <b>Community management</b>
            <ol>
              <li>
                <b>Guilds</b>: For membership management purposes, the Services may
                enable you to create or join a "Guild". Once you create a Guild, you
                will become the "Guild Admin", with control over the membership
                structure of the Guild, including the customization of Roles,
                Requirements and Rewards (as defined below).
              </li>

              <li>
                <b>Roles, Requirements and Rewards</b>: Guild Admins may freely set
                up the membership structure of the Guild and define "Roles" that are
                specific to each Guild. Guild Admins may also specify "Rewards", in
                particular in the form of permitting certain actions or enabling
                access to something. Roles and Rewards may be conditional upon the
                "Requirements" set by the Guild Admin.
              </li>

              <li>
                <b>Joining a Guild</b>: If you meet certain Requirements, you may be
                able to join a Guild in a specific Role and/or you may be entitled to
                Rewards. You understand and acknowledge that (i) Guild Admins are
                solely responsible for the terms of their Guilds, including the
                relevant Requirements, Roles and Reward; (ii) the Service Provider
                has no responsibility for such terms, and you cannot claim access to
                any Requirements or any Rewards directly from the Service Provider in
                relation to the completion of any Requirements; (iii) Guilds may
                change the Requirements for certain Roles or Rewards from time to
                time and the Service Provider has no responsibility for any such
                changes.
              </li>

              <li>
                <b>Connecting third-party platforms</b>: The Services may allow you
                to connect certain third-party platforms ("Third-party Platforms")
                with your Profile. Providing your credentials and authorizing access
                to such Third-party Platforms, may result in the access, use,
                disclosure of certain Personal Data to the Service Provider and
                depending on your choices, also to certain Guilds. You acknowledge
                that the use of any Third-party Platform is governed solely by the
                terms and conditions and privacy policy of such Third-party Platform
              </li>
            </ol>
          </li>
        </ol>
      </section>
      <section>
        <ol start={4}>
          <li>
            <b>Data protection</b>
            <ol>
              <li>
                <b>Data processing</b>: In connection with your use of the Services,
                the Service Provider will process certain information about you that
                may contain personal data. The{" "}
                <Anchor href="/privacy-policy" variant="highlighted">
                  Privacy Policy
                </Anchor>{" "}
                describes how the Service Provider collects, uses, transfers,
                discloses and stores your personal data. You understand and
                acknowledge that, in connection with your use of certain features of
                the Services, your personal data may be stored on a blockchain
                through the execution of the smart contracts, and this means that,
                due to the immutable nature of the blockchain, some of your personal
                data may not be modified or deleted.
              </li>

              <li>
                <b>Data sharing</b>: In accordance with section 3, you may decide to
                join or leave certain Guilds. Depending on the different Third-Party
                Platforms connected with your Profileand whether you decide to share
                your Profile with a certain Guild, this may result in the disclosure,
                access, or use of your personal data shared with us. You understand
                and acknowledge that the data processing activities of a Guild are
                governed solely by the terms and conditions of and privacy policy of
                the relevant Guild. The Service Provider does not endorse, is not
                liable for, and makes no representations in respect of any Guilds, or
                the manner in which such Guild uses, stores, or processes personal
                data. You agree that (i) it is solely the responsibility of the
                relevant Guild to inform you of any relevant policies and practices
                that may impact the processing of your data, (ii) obtain any rights,
                permissions or consent from you that are necessary for the lawful use
                of your data, (iii) ensure that the transfer and processing of your
                data is lawful, (iv) respond to and resolve any dispute with you
                relating to our personal data.
              </li>

              <li>
                <b>Third-Party Platforms</b>: The Service Provider does not endorse,
                is not liable for, and makes no representations in respect of any
                Third-party Platform, or the way such Third-party Platform uses,
                stores, or processes personal data. If you choose to connect your
                Profile with a Third-party Platform, you grant the Service Provider
                permission to access your relevant Personal Data as appropriate for
                the interoperation of such Third-Party Platform with the Services.
              </li>

              <li>
                <b>Sub-processors and data transfers</b>: You understand and agree
                that the Service Provider will engage third-party service providers
                that may access and process your personal data to assist in providing
                the Services to you. You agree that the Service Provider and
                third-party service providers may access and process your personal
                data in countries outside of the European Economic Area (EEA). You
                also understand and agree that by joining a Guild, you consent that
                your relevant personal data will be shared with such Guild and that
                the Guild may be subject to the laws of a jurisdiction outside of the
                EEA.
              </li>
            </ol>
          </li>
        </ol>
      </section>

      <section>
        <ol start={5}>
          <li>
            <b>Your responsibility</b>
            <ol>
              <li>
                <b>Security</b>: You are solely responsible for your Profile and for
                keeping your connected Digital Wallet and your wallet credentials
                secure. The Service Provider is not liable for any acts or omissions
                by you in connection with your Profile or as a result of your Digital
                Wallet being compromised. You agree to immediately notify us if you
                discover any unauthorized or suspicious activity relating to the
                Service or your Profile. In the case of an issue related to your
                Digital Wallet, please contact your wallet provider.
              </li>

              <li>
                <b>Compliance and taxes</b>: You will ensure that your use of the
                Services is compliant with all applicable laws and regulations, and
                the provisions of this Agreement. You are solely responsible for
                determining if any reporting, tax or other legal obligations apply to
                you in relation to your use of the Services. You agree and understand
                that the Service Provider does not provide any legal, tax, or
                investment advice and you agree to seek your own advice as necessary,
                and to comply with any reporting, tax or legal obligations you may
                have in connection with your use of our Services.
              </li>

              <li>
                <b>Embargoed Countries</b>: The use of the Services may be subject to
                import or export controls or other restrictions under the laws of the
                country where you intend to use the Services. It is your sole
                responsibility to check such limitations before using the Services
                and to comply with such restrictions and limitations. You shall not
                access or use the Services if you are located in any jurisdiction in
                which the provision of the Services, Software or other components is
                prohibited under applicable laws or regulations (a "Prohibited
                Jurisdiction"). You represent and warrant that (i) you are not
                prohibited from receiving EU or US exports; and (ii) you are not a
                national of, or a legal entity registered in, any Prohibited
                Jurisdiction.
              </li>
            </ol>
          </li>
        </ol>
      </section>

      <section>
        <ol start={6}>
          <li>
            <b>Fees and payment</b>

            <ol>
              <li>
                <b>Paid services</b>: The Service Provider offers both free and paid
                Services. Unless indicated otherwise, the Services are offered for
                free. However, certain transactions carried out via the Services may
                be subject to a fee ("Protocol Fee" and “Gas Fee”) in accordance with
                the Fee Schedule available on the Website.
              </li>

              <li>
                <b>Fees</b>: Customer is responsible for the payment of all fees,
                payment method and in the currency quoted at the time of the
                initiation of the transaction. (i) Protocol Fee: This fee is for the
                use of smart contracts that forward the transaction to the final
                destination. These smart contracts are deployed by Guild.xyz. (ii)
                Gas Fee: This fee is for the Ethereum nodes to validate the
                transaction. It is not related to Guild. Read about it here:
                https://www.investopedia.com/terms/g/gas-ethereum.asp Transaction
                fees are final and are non-refundable.
              </li>

              <li>
                <b>Changes of fees</b>: The Service Provider reserves the right to
                revise and update the Fee Schedule, at any time at its sole
                discretion. Any such revision or updates to the fees will apply
                prospectively following the effective date of the fee revision or
                update.
              </li>
            </ol>
          </li>
        </ol>
      </section>

      <section>
        <ol start={7}>
          <li>
            <b>Transactions</b>

            <ol>
              <li>
                <b>Smart contracts</b>: The Service Provider provides a web3 service
                that enables automated membership management, and the use of the
                Services may result in certain transactions between users.{" "}
                <b>
                  The Service Provider is not a financial institution, payments
                  processor, creditor, wallet provider, exchange, or financial
                  advisor.
                </b>{" "}
                The Service Provider cannot make any representation or guarantee
                regarding any specific outcomes resulting from making digital assets
                available for minting or collecting, or engaging in any other
                transactions or activities via the Services.
              </li>

              <li>
                <b>Risk assumption</b>: The transactions that can be carried out via
                the Services rely upon certain blockchain technology, including
                decentralized, distributed public ledger(s). By accessing or using
                the Services, you confirm that you are aware of the risks inherent in
                such technologies, such as the uncertainty of the regulatory regime
                governing blockchain technologies, digital assets, tokens and
                cryptocurrencies, and that the lack of use or public interest in the
                creation and development of distributed ecosystems could negatively
                impact the development of those ecosystems as well as the potential
                utility or value of such assets. You also confirm that you are aware
                that the price and liquidity of blockchain-based assets, including
                non-fungible tokens (NFTs), are extremely volatile and may be subject
                to fluctuations. Fluctuations in the price of other blockchain-based
                assets could materially and adversely affect digital assets.
              </li>

              <li>
                <b>Platform only</b>: You expressly acknowledge that the Service
                Provider provides a platform only, and it is not party to any smart
                contracts or agreements. The Service Provider does not have custody
                or control over the NFTs or other digital assets you are interacting
                with, and we do not execute or effectuate purchases, transfers, or
                sales of NFTs or other digital assets. You are responsible for
                verifying the identity, legitimacy, and authenticity of NFTs or
                digital assets that you purchase from third-party sellers using the
                Service and we make no claims, guarantees, or recommendations about
                the identity, legitimacy, functionality, or authenticity of users or
                NFTs (and any content associated with such NFTs) visible on the
                Service.{" "}
                <b>
                  It is your sole responsibility to verify all transaction details
                  before sending instructions to the Service Provider. You should
                  always carefully check the relevant transaction details. The
                  Service Provider is not responsible or liable for any losses you
                  may incur due to incorrect transaction information.
                </b>
              </li>
            </ol>
          </li>
        </ol>
      </section>

      <section>
        <ol start={8}>
          <li>
            <b>Intellectual property</b>

            <ol>
              <li>
                <b>Reservation of rights</b>: Each party shall retain all rights,
                title and interest in and to all its respective patents, inventions,
                copyrights, trademarks, domain names, databases trade secrets,
                know-how and any other intellectual property and/or proprietary
                rights (collectively, "Intellectual Property Rights"). This Agreement
                does not grant any right, title, or interest to you with respect to
                the Services or in any of the Service Provider’s Intellectual
                Property Rights, except as expressly set out in this Agreement.
              </li>

              <li>
                <b>Customer Content</b>: The Services may enable you to submit and
                upload content to the Services, such as images and text ("Customer
                Content"). You own all right, title, and interest in and to Customer
                Content. You hereby grant us a worldwide, royalty-free, fully
                paid-up, and sublicensable license to display, host, copy, and
                reproduce (in any form) Customer Content to the extent necessary to
                provide and maintain the Services. You represent and warrant that you
                own all rights, title, and interest in and to the Customer Content or
                you have otherwise obtained all necessary consents, licenses and
                waivers required to create, submit, store, and use Customer Content
                in connection with the Services.
              </li>

              <li>
                <b>Feedback</b>: The Service Provider may use any feedback, ideas,
                comments, enhancement requests, recommendations or suggestions
                ("Suggestions") that you send or share with the Service Provider
                without any obligation to you. You hereby grant to the Service
                Provider a world-wide, royalty free, irrevocable, perpetual license
                to use and otherwise incorporate any Suggestions.
              </li>
            </ol>
          </li>
        </ol>
      </section>

      <section>
        <ol start={9}>
          <li>
            <b>Acceptable Use</b>

            <ol>
              <li>
                <b>Restrictions</b>: You will not and will not permit any third party
                to: (i) reverse engineer, decompile, disassemble or otherwise attempt
                to discover the source code, object code or underlying structure,
                ideas, know-how or algorithms relevant to the Services except for the
                scope in which such limitation is explicitly prohibited by law; (iii)
                access the Services for competitive purposes; (iv) use the Services
                in a manner that violates the rights of a third party, or applicable
                laws and regulations; or (v) use the Services in any manner that is
                likely to damage, disable, overburden, or impair the Services or its
                related systems and networks.
              </li>

              <li>
                <b>Prohibited Customer Content</b>: You are exclusively responsible
                for all Customer Content. You agree that you will not upload, use or
                in connection with the Services any prohibited Customer Content
                including, without limitation, Customer Content that (i) exploits,
                harms, or attempts to exploit or harm minors in any way by exposing
                them to inappropriate content or otherwise; (ii) is pornographic,
                sexually explicit or offensive, obscene, defamatory, libelous,
                bullying, profane, indecent; (iii) promote racism, violence or
                hatred, or otherwise conveys a message of hate against any individual
                or group; (iv) are factually inaccurate, false, misleading or
                deceptive; (v) contains viruses, trojan horses, worms or any other
                harmful or deleterious programs; (vi) furthers or promotes criminal
                activity or provides instructional information about illegal
                activities.
              </li>

              <li>
                <b>Prohibited Use</b>: You also agree that you will not and not
                permit any third party to: (i) detrimentally interfere with,
                intercept, or expropriate any system, data, or information; (ii)
                attempt to gain unauthorized access to the Services, other wallets
                not belonging to you, computer systems or networks connected to the
                Services, through password mining or any other means; (iii) harvest
                or otherwise collect information from the Services about others,
                including without limitation email addresses and/or public or private
                wallet keys, without proper consent; (iv) use the Service to carry
                out any financial activities subject to registration or licensing,
                including but not limited to creating, offering, selling, or buying
                securities, commodities, options, or debt instruments; (v) use the
                Service to create, sell, or buy NFTs or other items that give owners
                rights to participate in an ICO or any securities offering, or that
                are redeemable for securities, commodities, or other financial
                instruments; (vi) use the Service to engage in price manipulation,
                fraud, or other deceptive, misleading, or manipulative activity;
                (vii) use the Service to buy, sell, or transfer stolen items,
                fraudulently obtained items, items taken without authorization,
                and/or any other illegally obtained items; (viii) impersonate or
                attempt to impersonate any person.
              </li>

              <li>
                <b>Monitoring</b>: The Service Provider reserves the right to
                investigate and take appropriate action against anyone who, in its
                sole discretion, violates the provisions of this section 6, including
                removing any Customer Content with or without prior notice,
                terminating or suspending your access to the Services and/or (where
                required applicable law) reporting such Customer Content or
                activities to law enforcement authorities.
              </li>
            </ol>
          </li>
        </ol>
      </section>

      <section>
        <ol start={10}>
          <li>
            <b>Warranty</b>

            <ol>
              <li>
                Free Services are provided "AS IS" and "as available". To the maximum
                extent permitted by applicable law, THE SERVICE PROVIDER DISCLAIMS
                ANY IMPLIED WARRANTIES INCLUDING WITHOUT LIMITATION MERCHANTABILITY
                OR FITNESS FOR A PARTICULAR PURPOSE OR NON-INFRINGEMENT.
              </li>
            </ol>
          </li>
        </ol>
      </section>

      <section>
        <ol start={11}>
          <li>
            <b>Indemnity</b>

            <ol>
              <li>
                To the extent permitted by law, Customer will defend, indemnify and
                hold harmless the Service Provider, including its employees and
                Affiliates, from and against any third-party claims, incidents,
                liabilities, procedures, damages, losses and expenses, including
                reasonable legal and accounting fees, arising out of or in any way
                connected with (i) your access or use of the Services, (ii) your
                breach of this Agreement, or (iii) your violation of applicable laws,
                rules or regulations in connection with the Services.
              </li>
            </ol>
          </li>
        </ol>
      </section>

      <section>
        <ol start={12}>
          <li>
            <b>Limitation of liability</b>

            <ol>
              <li>
                <b>Exclusion of damages</b>: TO THE FULLEST EXTENT PROVIDED BY LAW,
                IN NO EVENT WILL THE SERVICE PROVIDER OR ITS AFFILIATES, OR THEIR
                LICENSORS, EMPLOYEES, CONTRACTORS, AGENTS, OFFICERS OR DIRECTORS, BE
                LIABLE FOR ANY FOR ANY LOST PROFITS, REVENUES, OR BUSINESS
                OPPORTUNITIES, LOSS OF USE, LOSS OF DATA, LOSS OF CONFIDENTIAL OR
                OTHER INFORMATION, LOSS OF DIGITAL ASSETS, LOSS OF ACCESS TO ANY
                DIGITAL WALLET, BUSINESS INTERRUPTION AND ANY OTHER INDIRECT,
                SPECIAL, INCIDENTAL, CRIMINAL, SUBSEQUENT OR CONSEQUENTIAL DAMAGES
                WHATSOEVER, WHETHER BASED ON CONTRACT, TORT, NEGLIGENCE, PRODUCT
                LIABILITY OR OTHERWISE, ARISING OUT OF OR IN ANY WAY RELATED TO THE
                USE OF OR INABILITY TO USE THE SERVICE, REGARDLESS WHETHER THE
                SERVICE PROVIDER HAS BEEN ADVISED OR SHOULD HAVE HAD KNOWLEDGE OF THE
                POSSIBILITY OF SUCH DAMAGES. THE SERVICE PROVIDE WILL NOT BE
                LIABILITY FOR THE ACTIONS OR OMISSIONS OF THIRD PARTIES, NOR FOR ANY
                DAMAGES THAT MAY OCCUR AS A RESULT OF YOUR TRANSACTIONS OR OTHER
                INTERACTIONS WITH THIRD PARTIES VIA THE SERVICES.
              </li>

              <li>
                <b>Limitation of liability</b>: YOU AGREE THAT THE SOLE AND EXCLUSIVE
                REMEDY FOR UNSATISFACTORY SERVICE SHALL BE TERMINATION OF THE SERVICE
                AND A REFUND OF ANY AMOUNT ALREADY PAID BY YOU NOTWITHSTANDING
                ANYTHING TO THE CONTRARY IN THESE TERMS. THE AGGREGATE LIABILITY OF
                THE SERVICE PROVIDER FOR ALL CLAIMS RELATING TO THE SERVICES, THE
                ACCESS TO AND USE OF THE SERVICE, CONTENT, DIGITAL ASSETS OR ANY
                PRODUCTS OR SERVICES PURCHASED ON THE SERVICES SHALL NOT EXCEED THE
                GREATER OF (A)USD 100 OR (B) THE AMOUNT RECEIVED BY THE SERVICE
                PROVIDER FROM YOU RELATED TO THE RELEVANT DIGITAL ASSET THAT IS THE
                SUBJECT OF THE APPLICABLE CLAIM.
              </li>

              <li>
                <b>Exceptions</b>: AFOREMENTIONED LIMITATIONS OF LIABILITY DO NOT
                APPLY FOR CAUSED INTENTIONAL OR GROSS NEGLIGENT BREACH OF OBLIGATIONS
                BY THE SERVICE PROVIDER AND DAMAGES CAUSED TO LIFE, BODY OR HEALTH,
                AND FOR ANY OTHER LIABILITY THAT MAY NOT, UNDER APPLICABLE LAW, BE
                LIMITED OR EXCLUDED. IN SUCH JURISDICTIONS, OUR LIABILITY IS LIMITED
                TO THE EXTENT PERMITTED BY LAW, THEREBY MINIMIZING OUR LIABILITY TO
                YOU TO THE LOWEST AMOUNT PERMITTED BY APPLICABLE LAW.
              </li>

              <li>
                <b>Force Majeure</b>: The Service Provider will not be liable to
                Customer or to any other third party for failure to perform or any
                delay in the performance of the Service due to fire, flood, war,
                riot, strike, explosion, lock out, injunction, natural disaster,
                interruption of transportation, acts of war, terrorism, labor
                disputes, acts of civil or military authority, power blackouts,
                denial of service attacks, bugs, computer viruses, trojan horses or
                any other event beyond the Service Provider's reasonable control.
              </li>
            </ol>
          </li>
        </ol>
      </section>

      <section>
        <ol start={13}>
          <li>
            <b>Term and termination</b>

            <ol>
              <li>
                <b>Term</b>: This Agreement enters into effect on the day when you
                accept this Agreement and continues until terminated either by you or
                the Service Provider ("Term").
              </li>

              <li>
                <b>Cancellation</b>: Customer may terminate a free Service
                immediately without cause. If applicable, Subscription Services may
                be terminated in accordance with the Subscription Terms.
              </li>

              <li>
                <b>Termination for Cause</b>: Either party may terminate this
                Agreement with notice if the other party materially breaches this
                Agreement and such breach is not cured within fifteen days after the
                non-breaching party provides notice of the breach. The Service
                Provider may immediately terminate this Agreement for cause without
                notice if Customer or its Users violate section 7 (Acceptable Use) of
                this Agreement.
              </li>

              <li>
                <b>Survival</b>: The following sections will survive expiry or
                termination of this Agreement: 5 (Your responsibility), 6 (Fees and
                payment), 7 (Transactions), 8 (Intellectual Property Rights), 10-12,
                13 (Term and termination), 14 (Miscellaneous).
              </li>

              <li>
                <b>Effect</b>: If this Agreement is terminated: (i) the rights and
                licenSes granted by the Service Provider to you will cease
                immediately; (ii) the Service Provider may delete any data relating
                to your Profile in a commercially reasonable period of time in
                accordance with its Privacy Notice.
              </li>
            </ol>
          </li>
        </ol>
      </section>

      <section>
        <ol start={14}>
          <li>
            <b>Miscellaneous</b>

            <ol>
              <li>
                <b>Severability; Entire agreement</b>: The provisions of this
                Agreement apply to the maximum extent permitted by relevant law. If
                any court or relevant authority decides that any part of this
                Agreement is unlawful, unenforceable, or invalid, the remaining
                clauses will remain in full force and effect. This is the entire
                contract between the Parties regarding the Service. It supersedes any
                prior contract or oral or written statements regarding your use of
                the Service.
              </li>

              <li>
                <b>Remedy</b>: The failure of either Party to enforce a provision of
                this Agreement is not a waiver of its right to do so later. The
                waiver by the Service Provider of any breach shall not be deemed a
                waiver of any subsequent breach of the same or any other term of this
                Agreement. Any remedy made available to the Service Provider by any
                of the provisions of this Agreement is not intended to be exclusive
                of any other remedy.
              </li>

              <li>
                <b>Expiration of Claims</b>: Both parties agree that except for
                claims related to the indemnification obligations above, all claims
                arising under or related to this Agreement must be brought within one
                year after the date the cause of action arose.
              </li>

              <li>
                <b>Assignment</b>: You may not assign or transfer this Agreement or
                any rights or obligations under this Agreement without the Service
                Provider’s written consent. The Service Provider may freely assign
                its rights and obligations under this Agreement in its entirety to an
                Affiliate or in connection with a merger, acquisition, corporate
                reorganization, or sale of all or substantially all of its assets.
                For the purposes of this Agreement, "affiliate" means any entity that
                controls, is controlled by or is under common control with a party,
                where "control" means the ability to direct the management and
                policies of an entity.
              </li>

              <li>
                <b>Governing law, dispute resolution</b>: This Agreement is governed
                by Hungarian law, excluding the Hungarian conflict of law rules and
                the Vienna Convention on Contracts for International Sale of Goods.
              </li>

              <li>
                <b>Consumer protection</b>: If any consumer laws are applicable to
                the parties’ relationship, and cannot otherwise be lawfully excluded,
                nothing in this Agreement will restrict, exclude or modify any
                mandatory rules of law. Any consumer complaints relating to this
                Agreement, or the Services may be communicated by the following
                means: (i) by sending a letter to the address of the Service Provider
                (6720 Szeged, Kelemen László utca 11.) or (ii) by sending an e-mail
                to{" "}
                <Anchor href="mailto:help@guild.xyz" variant="highlighted">
                  help@guild.xyz
                </Anchor>
                . Any consumer complaint will be assessed and duly answered within 30
                days from the date when the complaint is received. If your complaint
                is rejected, then you may submit your complaint to the competent
                conciliation body at the place of your habitual or temporary
                residence. Prior to the proceeding of the conciliation body, you must
                attempt to solve the dispute with us directly. Should you decide to
                turn to a conciliation body other than the competent conciliation
                body, then – upon your request – that conciliation body will have
                competence to proceed. If you believe that your consumer rights have
                been violated, then you may also file a complaint with the competent
                consumer protection authority. The authority will decide whether to
                initiate proceedings upon the assessment of the complaint. The
                competence of the consumer protection authority depends on the place
                of your habitual residence. The list of authorities is available
                here. There is no code of practice available at the Service Provider
                as defined under the act on the prohibition of unfair commercial
                practices.
              </li>

              <li>
                <b>Notice</b>: Notices are to be sent by electronic means, in the
                form of an email. Notices through email will be deemed to have been
                duly given the day after it is sent. The Service Provider may be
                contacted at{" "}
                <Anchor href="mailto:help@guild.xyz" variant="highlighted">
                  help@guild.xyz
                </Anchor>
                . The Service Provider reserves the right to make reasonable steps to
                verify your identity before responding to or acting upon Customer's
                request.
              </li>
            </ol>
          </li>
        </ol>
      </section>
    </LayoutMain>
    <LayoutFooter />
  </Layout>
)

export default Page
