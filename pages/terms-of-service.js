import Footer from "../components/_App/Footer";
import Navbar from "../components/_App/Navbar";
import PageBanner from "../components/Common/PageBanner";
import HelloEmailLink from "../components/HelloEmailLink";
import { userSideProps } from "../middlewares";
import { getViewPageWithCategoriesOptions } from "../services";

const TermsOfService = () => {
  return (
    <>
      <Navbar canShowSearch={false} />

      <PageBanner pageTitle="Terms of Service" pageName="Terms of Service" />

      <div className="listings-area ptb-70 inform-page">
        <div className="container mt-4">
          <div className="row m-0">
            <h3>Terms of Service</h3>
            <p>
              <strong>LAST UPDATED: 23.08.2024</strong>
            </p>
            <p className="mb-1">
              Welcome to RentAbout, a platform that enables:
            </p>
            <div className="p-0">
              <ul>
                <li>
                  Users to advertise items for rent (such users being "Owners")
                </li>
                <li>
                  Owners to communicate with and enter into agreements with
                  other users to rent (such users being "Renters")
                </li>
                <li>Renters to pay Owners for renting the relevant items</li>
                <li>Users to resolve disputes concerning the rented items</li>
              </ul>
            </div>

            <p>
              The RentAbout platform is accessible through the RentAbout
              application, available for download on your mobile device (the
              "RentAbout App"), and our website available at
              https://rentabout.com (together, the "RentAbout Service" or the
              “Service”). The RentAbout Service is provided by RentAbout Ltd. A
              limited liability company registered under the laws of England and
              Wales with registered address at the Innovation Centre, Keckwick
              Lane, Daresbury, Warrington, United Kingdom, WA4 4FS ("RentAbout,"
              "we," "our," or "us").
            </p>

            <p>
              PLEASE READ THESE TERMS CAREFULLY TO ENSURE THAT YOU UNDERSTAND
              EACH PROVISION. BY ACCESSING OR USING THE RENT ABOUT SERVICE, BY
              REGISTERING FOR AN ACCOUNT ON THE RENT ABOUT, OR BY CLICKING A
              BUTTON OR CHECKING A BOX MARKED "I AGREE" OR SOMETHING SIMILAR,
              YOU SIGNIFY THAT YOU HAVE READ, UNDERSTOOD, AND AGREE TO BE BOUND
              BY THESE TERMS AND TO THE COLLECTION AND USE OF YOUR INFORMATION
              AS SET FORTH IN OUR PRIVACY POLICY WHICH IS HEREBY INCORPORATED
              INTO THESE TERMS BY REFERENCE. THESE TERMS APPLY TO ALL OWNERS,
              RENTERS, AND OTHERS WHO REGISTER FOR OR OTHERWISE ACCESS THE RENT
              ABOUT SERVICE (COLLECTIVELY "USERS").
            </p>

            <p>
              These Terms together with any documents or policies referred to
              herein (collectively the “Terms of Service”) constitute a legally
              binding agreement made between you and us, concerning your access
              to and use of the RentAbout Service. You agree that by accessing
              the Service, you have read, understood, and agreed to be bound by
              all of these Terms. If you do not agree with any or all of these
              Terms, then you are expressly prohibited from using the Services
              and you must discontinue use immediately. These Terms may be
              updated from time to time, and you are encouraged to review them
              periodically to stay informed about any changes. Your continued
              use of RentAbout after any modifications to the Terms will
              constitute your acceptance of those changes. Additional terms may
              apply to you depending on whether you are a renter, owner, buyer
              or seller.
            </p>

            <h4>IMPORTANT NOTICE ABOUT RENTING ITEMS</h4>
            <p className="mb-0">
              RentAbout only provides a platform that facilitates users in
              renting and lending items but does not rent or lend items itself.
              We do not routinely monitor the quality of the items listed for
              hire by Owners on the RentAbout Service. Consequently, it is the
              Owner's responsibility (and not ours) to ensure that the items
              conform to any provided descriptions, are fit for their intended
              purpose, and are safe to use. If you are a Renter, we are not
              responsible for the quality, safety, or legality of any items you
              hire through the RentAbout Service.
            </p>
            <div className="p-0">
              <ul>
                <li>
                  <b>Owner Responsibilities:</b> If you are an Owner, you are
                  solely responsible for ensuring compliance with any legal
                  obligations related to the items you provide for hire. This
                  includes respecting Renters' rights under applicable consumer
                  protection laws and compensating for any damages or injuries
                  caused by your items.
                </li>
                <li>
                  <b>Renter Responsibilities:</b> If you are a Renter, you are
                  responsible for the proper care and timely return of any items
                  you hire through the RentAbout Service. Generally, you will
                  not be held liable for compensating the Owner for accidental
                  loss or damage to the items unless the loss or damage results
                  from your negligence, forgetfulness, carelessness, improper
                  use, lack of necessary skills or experience to operate the
                  items, or theft. The RentAbout Service will determine
                  liability under these circumstances. Additionally, you are
                  responsible for any damage you cause to other people or
                  property while using the rented items.
                </li>
              </ul>
            </div>

            <h4>THE RENT ABOUT SERVICE </h4>
            <p className="mb-0">
              The RentAbout Service provides a platform that enables Owners and
              Sellers to advertise items for hire and sale, and to communicate
              and enter into agreements with Renters and Buyers for the hire or
              sale of those items. Our services include:
            </p>
            <div className="p-0">
              <ul>
                <li>
                  <b>Advertising:</b> Owners and Sellers can list their items on
                  the RentAbout platform, providing detailed descriptions,
                  pricing, and availability. This allows Renters and Buyers to
                  browse, compare, and choose items for hire or purchase.
                </li>

                <li>
                  <b>Communication and Agreement Facilitation:</b> The RentAbout
                  Service facilitates direct communication between Owners,
                  Sellers, Renters, and Buyers. Users can negotiate terms, ask
                  questions, and finalize agreements through our messaging
                  system.
                </li>
                <li>
                  <b>Transaction Management:</b> The platform supports secure
                  transactions, allowing Renters to pay Owners for the hire of
                  items, and Buyers to pay Sellers for the purchase of items or
                  services. Our system ensures that payments are processed
                  efficiently and securely.
                </li>
                <li>
                  <b>Social Features:</b> RentAbout may provide social features
                  that allow you to message and share information about your use
                  of the RentAbout Service with other users. These features are
                  designed to enhance your experience by enabling you to connect
                  with other users, share your feedback, and create a community
                  of trusted renters and sellers.
                </li>
                <li>
                  <b>Rules of Acceptable Use:</b> Any use of the social features
                  provided by RentAbout must comply with our Rules of Acceptable
                  Use set out herein. By using the RentAbout Service, you agree
                  to adhere to these rules and understand that failure to comply
                  may result in suspension or termination of your account.
                </li>
              </ul>
            </div>

            <h4>USER ACCOUNT REGISTRATION </h4>
            <p>
              To access and use the RentAbout Service, you must register for an
              account ("User Account") and agree to provide accurate, current,
              and complete information during the registration process. You must
              be at least 16 years old to create a User Account. By registering,
              you represent and warrant that you have the right, authority, and
              capacity to enter into and abide by these Terms. To create a User
              Account, you must provide certain information, including but not
              limited to your name, email address, phone number, and a secure
              password. You agree to provide truthful, accurate, and complete
              information during the registration process and to update such
              information to maintain its accuracy and completeness. You are
              solely responsible for the accuracy of the information provided
              and for any activity that occurs under your User Account.
            </p>
            <p>
              You are responsible for maintaining the confidentiality of your
              User Account login credentials and for all activities that occur
              under your User Account. You agree to immediately notify RentAbout
              of any unauthorized use or suspected unauthorized use of your User
              Account or any other breach of security. RentAbout will not be
              liable for any loss or damage arising from your failure to
              safeguard your User Account and password.
            </p>
            <p>
              Each user is permitted to create only one User Account. Creating
              multiple accounts for the same individual or entity is strictly
              prohibited unless explicitly authorized by RentAbout. RentAbout
              reserves the right to suspend, deactivate, or terminate your User
              Account at its sole discretion if it believes that you have
              violated these Terms and Conditions, provided false information,
              or engaged in fraudulent or illegal activities. You may deactivate
              or delete your User Account at any time by following the
              instructions provided on the RentAbout platform. However, you
              remain responsible for any outstanding obligations related to your
              use of the RentAbout Service, including any rental or purchase
              agreements entered into prior to account deactivation.
            </p>
            <p>
              By registering for a User Account, you consent to RentAbout using
              your registration information for purposes of providing the
              RentAbout Service, enhancing user experience, and communicating
              with you regarding your account and activities on the platform.
              Your registration information will be used in accordance with
              RentAbout's Privacy Policy, which outlines how we collect, use,
              and protect your personal information. If you have any concerns
              that your Account may have been misused, you should contact us at{" "}
              <HelloEmailLink /> straight away to let us know.
            </p>

            <h4>INTELLECTUAL PROPERTY AND USE OF THE RENT ABOUT SERVICE </h4>
            <p>
              The materials and content comprising the RentAbout Service are
              owned by us or our third-party licensors. We grant you permission
              to use these materials and content solely for the purpose of using
              the RentAbout Service in accordance with these Terms of Service.
              Your right to use the RentAbout Service is personal to you, and
              you are not permitted to transfer this right to any other person.
            </p>
            <p className="mb-0">
              Your right to use the RentAbout Service is non-exclusive and does
              not prevent us from granting others the right to use the RentAbout
              Service. You agree to the following restrictions regarding the
              RentAbout Service. Unless explicitly allowed by these Terms of
              Service or as permitted by the functionality of the RentAbout
              Service, you agree not to:
            </p>
            <div className="p-0">
              <ul>
                <li>
                  Copy or attempt to copy the RentAbout App or any other part of
                  the RentAbout Service;
                </li>
                <li>
                  Provide, sell, or otherwise make available the RentAbout App
                  or any other part of the RentAbout Service to any other
                  person;
                </li>
                <li>
                  Alter or attempt to alter the RentAbout App or any other part
                  of the RentAbout Service in any way;
                </li>
                <li>
                  Access or attempt to access the underlying code of the
                  RentAbout App or any other part of the RentAbout Service that
                  has not been expressly made publicly available by us.
                </li>
              </ul>
            </div>

            <p>
              You acknowledge that all confidential information, copyrights, and
              other intellectual property rights in the RentAbout App or any
              other part of the RentAbout Service are owned by us or the
              entities that have licensed those rights to us. You agree that you
              have no rights in or to the RentAbout App or any other part of the
              RentAbout Service, other than the right to use and access them in
              accordance with these Terms of Service.
            </p>
            <p className="mb-0">You shall not:</p>
            <div className="p-0">
              <ul>
                <li>
                  Copy, distribute, or disclose any part of the RentAbout
                  Service in any medium, including without limitation by any
                  automated or non-automated “scraping”;
                </li>
                <li>
                  Use any automated system, including without limitation
                  “robots,” “spiders,” “offline readers,” etc., to access the
                  RentAbout Service;
                </li>
                <li>
                  Transmit spam, chain letters, or other unsolicited email;
                </li>
                <li>
                  Attempt to interfere with, compromise the system integrity or
                  security, or decipher any transmissions to or from the servers
                  running the RentAbout Service;
                </li>
                <li>
                  Take any action that imposes, or may impose at our sole
                  discretion an unreasonable or disproportionately large load on
                  our infrastructure;
                </li>
                <li>
                  Upload invalid data, viruses, worms, or other software agents
                  through the RentAbout Service;
                </li>
                <li>
                  Collect or harvest any personally identifiable information,
                  including account names, from the RentAbout Service;
                </li>
                <li>
                  Use the RentAbout Service for any commercial solicitation
                  purposes without our prior written permission;
                </li>
                <li>
                  Impersonate another person or otherwise misrepresent your
                  affiliation with a person or entity, conduct fraud, hide or
                  attempt to hide your identity;
                </li>
                <li>
                  Interfere with the proper working of the RentAbout Service;
                </li>
                <li>
                  Access any content on the RentAbout Service through any
                  technology or means other than those provided or authorized by
                  the RentAbout Service;
                </li>
                <li>
                  Bypass the measures we may use to prevent or restrict access
                  to the RentAbout Service, including without limitation
                  features that prevent or restrict use or copying of any
                  content or enforce limitations on use of the RentAbout Service
                  or the content therein;
                </li>
                <li>
                  Bypass the measures we may use to prevent or restrict access
                  to the RentAbout Service, including without limitation
                  features that prevent or restrict use or copying of any
                  content or enforce limitations on use of the RentAbout Service
                  or the content therein;
                </li>
                <li>
                  Or assist any third party to carry out any of these prohibited
                  actions.
                </li>
              </ul>
            </div>
            <p>
              By agreeing to these Terms of Service, you understand and accept
              these restrictions and acknowledge that any violation of these
              terms may result in termination of your access to the RentAbout
              Service and possible legal action.
            </p>

            <h4>OWNER SPECIFIC TERMS</h4>
            <p>
              This section 5 applies to you if you are an owner on the RentAbout
              Service. You must not offer to lend through the RentAbout Service
              any firearms, weapons, pornography, mature content, animals, or
              any items that it would be illegal to offer for hire in your or
              the renter's country of residence. We reserve the right to remove
              any items offered for hire from the RentAbout Service if we
              believe such items are illegal, immoral, or damaging to our
              reputation.
            </p>
            <p className="mb-0">You are responsible for ensuring that:</p>
            <div className="p-0">
              <ul>
                <li>
                  Rights and Legal Compliance:
                  <ul>
                    <li>
                      You have all necessary rights to hire out any items you
                      advertise on the RentAbout Service, and the renter's use
                      of those items will not infringe any other party's rights;
                    </li>
                    <li>
                      The items you advertise can be legally offered for hire.
                    </li>
                  </ul>
                </li>
                <li>
                  Delivery and Description:
                  <ul>
                    <li>
                      You deliver any hired items to the renter in accordance
                      with the agreement you reach with the renter;
                    </li>
                    <li>
                      Any descriptions of the items you advertise for hire
                      through the RentAbout Service are accurate and include all
                      information relevant to the use of the item, including:
                      <ul>
                        <li>
                          Notice of any defects, restrictions, or other
                          requirements that may apply to the use of the item;
                        </li>
                        <li>
                          Any instructions or notices that may reasonably be
                          required to use the item safely.
                        </li>
                      </ul>
                    </li>
                    <li>
                      The items you advertise on the RentAbout Service:
                      <ul>
                        <li>
                          Conform in all material respects to any pictures or
                          descriptions that you upload;
                        </li>
                        <li>
                          Are safe to use in accordance with any reasonable
                          instructions you provide to the renter;
                        </li>
                        <li>
                          Are fit for any purpose for which such items would
                          normally be used, or any purpose communicated to you
                          by the renter.
                        </li>
                      </ul>
                    </li>
                  </ul>
                </li>
                <li>
                  Handover:
                  <ul>
                    <li>
                      Any rental item is only handed over to the renter after
                      the transaction(s) are approved by the RentAbout
                      Verification process. You must only hand over the item to
                      the person verified by RentAbout, not third parties. To be
                      eligible for the Protection Guarantee as outlined in our
                      Protection Guarantee Policy you must check out according
                      to the processes outlined in it. Using the barcode and
                      checklist before handing over items. This reduces risk and
                      ensures that your items are more secure.
                    </li>
                  </ul>
                </li>
                <li>
                  Storage Space:{" "}
                  <ul>
                    <li>
                      If you offer storage space for hire, you must ensure that:
                      <ul>
                        <li>The space is accessible safely and legally;</li>
                        <li>
                          The space is secure and free from leaks and/or
                          excessive heat or cold;
                        </li>
                        <li>
                          You will be responsible for any damage to any of the
                          renter's items that are left in your storage area.
                        </li>
                      </ul>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>

            <p className="mb-0">You will be responsible for:</p>
            <div className="p-0">
              <ul>
                <li>
                  Any damage the Renter or any other person may suffer as a
                  result of any defect in the item they have rented from you;
                </li>
                <li>
                  Any failure to comply with the requirements outlined in this
                  section.
                </li>
              </ul>
            </div>

            <p>
              You are free to agree on any other terms with the Renter,
              including the price (the "Hire Fee"). When posting items for hire,
              ensure that the Hire Fee is the total price payable, including any
              applicable taxes or costs of delivery. Once terms are agreed upon,
              you must not amend them (including the price) unless you have a
              valid, justifiable reason and the Renter agrees to the amended
              terms. You can remove a listing or cancel your agreement to lend
              an item to a Renter at any time up to 48 hours before the start of
              the relevant hire period. If you cancel less than 48 hours before
              the start of the hire period, we may charge you the full Hire Fee.
            </p>

            <h4>RENTER SPECIFIC TERMS</h4>
            <p>
              This section applies to you if you are a Renter on the RentAbout
              Service. When you agree to hire an item with an Owner, the Owner
              grants you a limited right to use that item for the relevant hire
              period. This right is personal to you, and you are not allowed to
              transfer this right to any other person.
            </p>
            <p className="mb-0">You are responsible for ensuring that:</p>
            <div className="p-0">
              <ul>
                <li>
                  You are legally allowed to use any item that you rent through
                  the RentAbout Service;
                </li>
                <li>
                  You comply with all applicable laws when using the item;
                </li>
                <li>
                  You comply with any reasonable directions provided by the
                  owner to use the item safely;
                </li>
                <li>
                  You return the item in the same condition as it was when you
                  collected it from the owner, except for any reasonable wear
                  and tear.
                </li>
              </ul>
            </div>

            <p className="mb-0">
              If you hire a storage space through the RentAbout Service, you
              must ensure that the items you store:
            </p>
            <div className="p-0">
              <ul>
                <li>
                  Are not flammable, dangerous, or hazardous to people or
                  animals;
                </li>
                <li>
                  Do not exceed £25,000 in value. You will be responsible for
                  any damage caused to the storage space, the owner, or any
                  other person or property as a result of your use of any
                  storage space.
                </li>
              </ul>
            </div>

            <p>
              <b>Return of Items:</b> You are free to agree with the owner how
              you will return any items you have hired. You must ensure that you
              return any items you have hired to the owner before your hire
              period ends.
            </p>

            <p>
              <b>Liability:</b> You will be responsible for any loss of or
              damage to the item you have hired due to: negligence,
              carelessness, improper use, not having the appropriate skills or
              experience to operate those items, and theft. The RentAbout
              Service will determine if you are liable under these
              circumstances.
            </p>

            <p>
              <b>Cancellation:</b> You can cancel a request to rent an item at
              any time before the request is accepted by the owner or up to 48
              hours after the request is submitted, known as the “cooling off
              period”. If you cancel within the cooling off period, you will
              receive a full refund. If you fail to return an item by the agreed
              deadline, you must notify the owner and/or RentAbout immediately.
              You will be liable to pay late fees as determined by RentAbout.
              RentAbout reserves the right to charge late fees from your card or
              bank account without further permission.
            </p>

            <p>
              <b>Holding Deposit:</b> If you miss the agreed deadline for return
              and are uncommunicative with the owner or RentAbout, or if there
              is reason to believe you have caused damage to the item, RentAbout
              can take a holding deposit from your account up to the full value
              of the items you have rented. This deposit will be fully
              refundable, less any fees owed to the company or owner, once the
              items are returned, replaced, or repaired. Otherwise, the deposit
              will not be refunded.
            </p>

            <h4>FEES AND PAYMENT</h4>
            <p>
              If you are an Owner, we will collect the Hire Fee from the Renter
              on your behalf. Unless we are unable to obtain payment from the
              Renter, such as where a Buyer's payment method is refused or our
              payment services provider determines that there is a risk of
              fraud, we will transfer you the Hire Fee after 24 hours of the end
              date of the rental. We will also charge you a fee of 15% of the
              Hire Fee ("owner Fee"), which we will deduct from the amount we
              transfer to you.
            </p>

            <p>
              If you are a Renter, once you have agreed to hire an item from the
              Owner, we will charge you the full Hire Fee on the Owner's behalf.
              In addition to the Hire Fee, we will also charge you an additional
              fee for your use of the RentAbout Service equal to 15% of the
              price you pay to the owner to hire an item ("Renter Fee").
            </p>

            <p>
              If we are unsuccessful in charging the Hire Fee, Renter Fee, Late
              Fee, Settlement Fee or any other amount to your credit or debit
              card, and have still not received payment within seven (7) days
              after informing you, we may suspend or temporarily disable all or
              part of your access to the RentAbout Service (without any
              responsibility to you), and we shall be under no obligation to
              provide any or all of the RentAbout Service while the amount
              concerned is unpaid. This does not affect any other rights and
              remedies available to us or the Owner. If you chargeback a payment
              you were obliged to pay under these Terms, your account will be
              immediately suspended until the payment is re-paid, or the
              chargeback is cancelled.
            </p>

            <h4>USER CONTENT</h4>
            <p>
              You confirm that any images, text or information that you upload
              to the RentAbout Service, including any reviews that you post
              about other users or items (collectively, your "User Content")
              will meet the Rules of Acceptable Use. We do not claim ownership
              of your User Content, and ownership will remain with you and any
              third party whose content you include in your User Content.
              Instead, you grant us a worldwide, non-exclusive, royalty-free and
              perpetual licence to use, copy, reproduce, distribute, adapt,
              re-format, modify, publish, translate, licence, sub-license and
              otherwise make available the User Content anywhere and in any form
              for the purposes of providing the RentAbout Service (including
              allowing users that you give access to any User Content to view
              and use your User Content). You must ensure that you are able to
              grant us the above licence for any content owned by a third party
              that you include in your User Content. Our right to use your User
              Content does not in any way affect your privacy rights. Please see
              our Privacy Policy on our website which provides information on
              how we use your personal information. We have the right but not
              the obligation to monitor any User Content and to reject, refuse
              or delete any User Content where we think that it breaks any of
              the Rules of Acceptable Use. We are not liable for any statements
              or representations in the User Content provided by you in any area
              on the RentAbout Service. You are solely responsible for the User
              Content you post on the RentAbout Service and you expressly agree
              to exonerate us from any and all responsibility and to refrain
              from any legal action against us regarding the User Content.
            </p>
            <p className="mb-0">
              When you post any User Content, you thereby represent and warrant
              that:
            </p>
            <div className="p-0">
              <ul>
                <li>
                  The creation, distribution, transmission, public display, or
                  performance, and the accessing, downloading, or copying of the
                  Content do not and will not infringe the proprietary rights,
                  including but not limited to the copyright, patent, trademark,
                  trade secret, or moral rights of any third party;
                </li>
                <li>
                  You are the creator and owner of or have the necessary
                  licences, rights, consents, releases, and permissions to use
                  and to authorise us, the platform, and other users of the
                  platform to use the Content in any manner contemplated by the
                  platform and these Terms;
                </li>
                <li>
                  You have the written consent, release, and/or permission of
                  each and every identifiable individual person in the User
                  Content to use the name or likeness of each and every such
                  identifiable individual person to enable inclusion and use of
                  your contributions in any manner contemplated by the platform
                  and these Terms;
                </li>
                <li>
                  The Content is not unsolicited or unauthorised advertising,
                  promotional materials, pyramid schemes, chain letters, spam,
                  mass mailings, or other forms of solicitation;
                </li>
                <li>
                  The Content is not obscene, lewd, lascivious, filthy, violent,
                  harassing, libelous, slanderous, or otherwise objectionable
                  (as determined by us);
                </li>
                <li>
                  The Content does not ridicule, mock, disparage, intimidate, or
                  abuse anyone;
                </li>
                <li>
                  The Content is not used to harass or threaten (in the legal
                  sense of those terms) any other person and to promote violence
                  against a specific person or class of people;
                </li>
                <li>
                  The Content does not violate any applicable law, regulation,
                  or rule, and do not violate the privacy or publicity rights of
                  any third party;
                </li>
                <li>
                  The Content does not include any offensive comments that are
                  connected to race, national origin, gender, sexual preference,
                  or physical handicap;
                </li>
                <li>
                  The Content does not otherwise violate, or link to material
                  that violates, any provision of these Terms, or any applicable
                  law or regulation. Any use of the RentAbout Service in
                  violation of the foregoing violates these Terms and may result
                  in, among other things, termination or suspension of your
                  rights to use the Service.
                </li>
              </ul>
            </div>

            <h4>RULES OF ACCEPTABLE USE</h4>
            <p>
              In addition to the other requirements within these Terms, this
              section describes specific rules that apply to your use of the
              RentAbout Service (the "Rules of Acceptable Use").
            </p>
            <p className="mb-0">
              When using the RentAbout Service you must not:
            </p>
            <div className="p-0">
              <ul>
                <li>
                  circumvent, disable or otherwise interfere with any security
                  related features of the RentAbout Service;
                </li>
                <li>
                  give any false or misleading information, impersonate any
                  person or permit any other person to use the RentAbout Service
                  under your name or on your behalf unless such person is
                  authorised by you;
                </li>
                <li>
                  use the RentAbout Service if we have suspended or banned you
                  from using it;
                </li>
                <li>
                  advocate, promote or engage in any illegal or unlawful conduct
                  or conduct that causes theft, loss, damage or injury to any
                  person or property;
                </li>
                <li>
                  promote or advertise any goods or services, other than items
                  you, as a owner or seller, make available for hire through the
                  RentAbout Service;
                </li>
                <li>
                  send any unsolicited marketing communications through the
                  RentAbout Service;
                </li>
                <li>
                  modify, interfere, intercept, disrupt or hack the RentAbout
                  Service;
                </li>
                <li>
                  misuse the RentAbout Service by knowingly introducing viruses,
                  Trojans, worms, logic bombs or other material which would harm
                  any of the RentAbout Service or any user of the RentAbout
                  Service's own equipment;
                </li>
                <li>
                  collect any data from the RentAbout Service other than in
                  accordance with these Terms and Conditions;
                </li>
                <li>
                  submit or contribute any User Content that contains nudity or
                  violence or is abusive, threatening, obscene, misleading,
                  untrue or offensive;
                </li>
                <li>
                  submit or contribute any User Content that you do not own or
                  have the right to use or otherwise infringe the copyright,
                  trademark or other rights of third parties;
                </li>
                <li>
                  use any User Content in violation of any licensing terms
                  specified by the owner;
                </li>
                <li>
                  other than leaving reviews about owners or items, submit or
                  contribute any information or commentary about another person
                  without that person's permission;
                </li>
                <li>
                  threaten, abuse or invade another's privacy, or cause
                  annoyance, inconvenience or needless anxiety or be likely to
                  harass, upset, embarrass, alarm or annoy any other person
                  (including but not limited to other users, and RentAbout
                  employees);
                </li>
                <li>
                  use any automated system, including without limitation
                  "robots", "spiders" or "offline readers" to access the
                  RentAbout Service in a manner that send more request messages
                  to the RentAbout Service than a human can reasonably produce
                  in the same period of time;
                </li>
                <li>
                  enter into any agreement to buy, sell, lend or rent any item
                  other than through the RentAbout platform with any other user
                  who you initially met through the RentAbout Service.
                </li>
              </ul>
            </div>

            <p>
              Doing so is “Fee Avoidance” and you will be liable for double the
              fees avoided, or a £200 fine (whichever is more) for each instance
              of doing so.
            </p>

            <p className="mb-0">
              Failure to comply with the Rules of Acceptable Use constitutes a
              serious breach of these Terms and Conditions, and may result in
              our taking all or any of the following actions (with or without
              notice):
            </p>
            <div className="p-0">
              <ul>
                <li>
                  immediate, temporary or permanent withdrawal of your right to
                  use the RentAbout App or any other portion of the RentAbout
                  Service;
                </li>
                <li>
                  immediate, temporary or permanent removal of any User Content;
                </li>
                <li>issuing of a warning to you;</li>
                <li>
                  legal action against you including proceedings for
                  reimbursement of all costs (including, but not limited to,
                  reasonable administrative and legal costs) resulting from the
                  breach;
                </li>
                <li>
                  disclosure of such information to law enforcement authorities
                  as we reasonably feel is necessary.
                </li>
              </ul>
            </div>

            <p>
              The remedies described in this Section are not limited, and we may
              take any other action we reasonably deem appropriate.
            </p>

            <h4>NOTICE AND TAKEDOWN POLICY</h4>
            <p>
              Any person may contact us by sending us a notice (an "Infringement
              Notice") if any content available through the RentAbout Service
              infringes their rights. The Infringement Notice should be sent by
              email to <HelloEmailLink />.
            </p>
            <p className="mb-0">
              Please provide the following information in the Infringement
              Notice:
            </p>
            <div className="p-0">
              <ul>
                <li>
                  Your Information including your name and contact details;
                </li>
                <li>
                  A statement explaining in sufficient detail why you consider
                  that the content available through the RentAbout Service
                  infringes your rights or fails to comply with our Rules of
                  Acceptable Use;
                </li>
                <li>
                  A link to or such other means of identifying the problematic
                  content.
                </li>
              </ul>
            </div>

            <p>
              We will take the action that we believe is appropriate depending
              on the nature of the Infringement Notice and will aim to respond
              to you within a reasonable period of time on the action we propose
              to take. Please be advised that pursuant to applicable law you may
              be held liable for damages if you make material misrepresentations
              in a notification. Thus, if you are not sure that material located
              on or linked to by the RentAbout Service infringes your copyright
              or that of a third party, you should consider first contacting an
              attorney.
            </p>

            <h4>RESOLVING DISPUTES BETWEEN RENTERS AND OWNERS</h4>

            <p>
              We strongly advocate for direct resolution of any disputes between
              renters and owners. If an item is lost or damaged by a renter, the
              renter must promptly reimburse the owner for the full repair or
              replacement cost. Owners may be required to provide evidence as
              outlined in our protection policy which can be found on our
              website. By exchanging you agree that you have read the Owner
              Protection Guarantee and agree to its terms and conditions in
              full.
            </p>

            <p className="mb-0">
              In cases where resolution cannot be reached directly:
            </p>
            <div className="p-0">
              <ul>
                <li>
                  <b>Mediation by RentAbout:</b> Either party can request
                  RentAbout to mediate the dispute. Upon mediation, RentAbout
                  may charge a mediation fee of up to 30% of the compensation
                  determined to be payable by the renter to the owner for any
                  damages. This fee, termed as the “Settlement Fee,” will be in
                  addition to any amounts owed by the renter to the owner.
                </li>
                <li>
                  <b>Acceptance of RentAbout's Decision:</b> Parties agree to
                  accept RentAbout’s decision in mediating disputes and abide by
                  its conclusions.
                </li>
              </ul>
            </div>

            <p>
              Users are required to promptly settle any owed amounts as per the
              Terms of Service, within 48 hours of being requested. Failure to
              comply within this timeframe will result in RentAbout debiting the
              owed amount from the user’s card. By agreeing to these terms,
              users waive their right to initiate a chargeback for this
              transaction with their bank.
            </p>

            <h4>OWNER GUARANTEE</h4>
            <p>
              Should you fail to recover the cost of repairing or replacing an
              item, or its estimated value, RentAbout may consider reimbursing
              you under the Owner Guarantee, subject to meeting specific
              criteria outlined in the full Owner Protection Guarantee document
              which can be accessed on the RentAbout website. Upon RentAbout's
              agreement to reimburse you under the Owner Guarantee, it is your
              responsibility to inform the Renter that any outstanding amounts
              are now payable to RentAbout. If RentAbout reimburses the owner
              under the Owner Guarantee, the Renter's obligation to compensate
              for lost, stolen, or damaged items will remain unchanged. However,
              this obligation will be redirected to RentAbout rather than the
              owner.
            </p>

            <h4>TERMINATING OUR RELATIONSHIP</h4>
            <p>
              These Terms shall remain in full force and effect while you use
              the RentAbout Service. If at any time you do not feel that you can
              agree to these Terms or any changes made to these Terms or the
              RentAbout Service, you must immediately stop using the RentAbout
              Service. Deleting the RentAbout App may not close any Account you
              have created in relation to the RentAbout Service. You must notify
              us if you wish to close your Account by contacting us using the
              details and functionality on your account, and we will end your
              use of the RentAbout Service. We may immediately end your use of
              the RentAbout Service if you break the Rules of Acceptable Use,
              any other important rule(s), or terms and conditions we set for
              accessing and using the RentAbout Service including these Terms.
              We may also withdraw any part of the RentAbout Service at any time
              and will notify you if we feel it will significantly affect your
              usage of the RentAbout Service. If you or we end your use of the
              RentAbout Service or we withdraw RentAbout Service as described in
              this section, we may delete your User Content, any other
              information that you have uploaded to the RentAbout Service or any
              other information we hold about you. You will also lose any rights
              you have to use the RentAbout Service or to access our content or
              your User Content. You should therefore ensure that you keep a
              copy of any information or content you use on the RentAbout
              Service, as well as your User Content, as we will not offer you
              compensation for any losses you might suffer if you lose your
              rights to access and use the RentAbout Service or any such
              information, content or User Content. The termination of your use
              of the RentAbout Service and the cancellation of your Account
              shall not affect any of your obligations to pay any sums due to
              us. Nothing in this Section shall affect any legal rights you may
              have under the law of the country in which you are resident.
            </p>

            <h4>OUR LIABILITY TO YOU</h4>
            <p>
              RentAbout shall not be liable to you for any indirect,
              consequential, or incidental damages arising out of or in
              connection with your use of the RentAbout Service, including but
              not limited to loss of profits, loss of data, or loss of business
              opportunity. The RentAbout Service is provided on an "as is" and
              "as available" basis, without any warranties of any kind, whether
              express or implied. RentAbout makes no representations or
              warranties regarding the reliability, availability, accuracy, or
              completeness of the RentAbout Service. In no event shall
              RentAbout's total liability to you for all damages, losses, and
              causes of action (whether in contract, tort, or otherwise) exceed
              a total of the actual fees earned by us for the service giving
              rise to the claim and, in the event that you have not paid us any
              money, we shall have no responsibility whatsoever to you. You
              agree to indemnify and hold RentAbout harmless from and against
              any and all claims, liabilities, damages, losses, costs, expenses,
              or fees (including reasonable attorneys' fees) arising out of or
              in connection with your use of the RentAbout Service, your
              violation of these Terms of Service, or your violation of any
              rights of any third party. RentAbout shall not be liable for any
              failure or delay in performing its obligations under these Terms
              of Service to the extent that such failure or delay is caused by
              circumstances beyond its reasonable control, including but not
              limited to acts of God, natural disasters, war, terrorism, riots,
              government actions, or labor disputes. You are responsible for
              ensuring that your use of the RentAbout Service complies with all
              applicable laws and regulations in your jurisdiction. RentAbout
              shall not be liable for any actions or conduct of any users of the
              RentAbout Service, whether online or offline. You acknowledge and
              agree that you are solely responsible for your interactions with
              other users of the RentAbout Service. RentAbout reserves the right
              to modify, suspend, or discontinue the RentAbout Service at any
              time without notice. In no event shall RentAbout be liable to you
              or to any third party for any modification, suspension, or
              discontinuance of the RentAbout Service.
            </p>

            <h4>RESOLVING DISPUTES WITH US</h4>
            <p>
              If you have a dispute with us relating to the RentAbout Service,
              in the first instance please contact us at <HelloEmailLink /> and
              attempt to resolve the dispute with us informally. In the unlikely
              event that we have not been able to resolve a dispute informally,
              we will discuss and agree with you the most effective way of
              resolving our dispute. All disputes under these Terms will be
              governed and construed in accordance with the laws of England and
              Wales.
            </p>

            <h4>CHANGES TO THE RENT ABOUT SERVICE</h4>
            <p>
              We reserve the right to change, modify, or remove the contents of
              the RentAbout Service at any time or for any reason at our sole
              discretion without notice. However, we have no obligation to
              update any information on our Services. We will not be liable to
              you or any third party for any modification, price change,
              suspension, or discontinuance of the RentAbout Service. We cannot
              guarantee that the Service will be available at all times. We may
              experience hardware, software, or other problems or need to
              perform maintenance related to the Service resulting in
              interruptions, delays, or errors. We reserve the right to change,
              revise, update, suspend, discontinue, or otherwise modify the
              Service at any time or for any reason without notice to you. You
              agree that we have no liability whatsoever for any loss, damage,
              or inconvenience caused by your inability to access or use the
              RentAbout Service during any downtime or discontinuance of the
              Services. Nothing in these Terms will be construed to obligate us
              to maintain and support the RentAbout Service or to supply any
              corrections, updates, or releases in connection therewith.
            </p>

            <h4>APPLE APP STORE PROVISIONS</h4>
            <p>
              This Section applies where the RentAbout App has been downloaded
              from the Apple App Store. You acknowledge and agree that these
              Terms and Conditions are solely between you and RentAbout, not
              Apple, Inc. ("Apple") and that Apple has no responsibility for the
              RentAbout App or content thereof. Your use of the RentAbout App
              must comply with the App Store Terms of Service. You acknowledge
              that Apple has no obligation whatsoever to furnish any maintenance
              and support services with respect to the RentAbout App. In the
              event of any failure of the RentAbout App to conform to any
              applicable warranty, you may notify Apple, and Apple will refund
              the purchase price for the RentAbout App to you; to the maximum
              extent permitted by applicable law, Apple will have no other
              warranty obligation whatsoever with respect to the RentAbout App,
              and any other claims, losses, liabilities, damages, costs or
              expenses attributable to any failure to conform to any warranty
              will be solely governed by these Terms and any law applicable to
              RentAbout as provider of the RentAbout App.
            </p>
            <p className="mb-0">
              You acknowledge that Apple is not responsible for addressing any
              claims of you or any third party relating to the RentAbout App or
              your possession and/or use of the RentAbout App, including, but
              not limited to:{" "}
            </p>
            <div className="p-0">
              <ul>
                <li>product liability claims;</li>
                <li>
                  any claim that the RentAbout App fails to conform to any
                  applicable legal or regulatory requirement;
                </li>
                <li>
                  claims arising under consumer protection or similar
                  legislation;
                </li>
                <li>
                  all such claims are governed solely by these Terms and
                  Conditions and any law applicable to RentAbout as provider of
                  the software.
                </li>
              </ul>
            </div>

            <p>
              You acknowledge that, in the event of any third party claim that
              the RentAbout App or your possession and use of that RentAbout App
              infringes that third party’s intellectual property rights,
              RentAbout, not Apple, will be solely responsible for the
              investigation, defence, settlement and discharge of any such
              intellectual property infringement claim to the extent required by
              these Terms.
            </p>
            <p className="mb-0">You represent and warrant that: </p>
            <div className="p-0">
              <ul>
                <li>
                  you are not located in a country that is subject to a U.S.
                  Government embargo, or that has been designated by the U.S.
                  Government as a "terrorist supporting" country;
                </li>
                <li>
                  you are not listed on any U.S. Government list of prohibited
                  or restricted parties.
                </li>
              </ul>
            </div>

            <p>
              You and RentAbout acknowledge and agree that Apple, and Apple’s
              subsidiaries, are third-party beneficiaries of these Terms and
              Conditions as relates to your licence of the RentAbout App, and
              that, upon your acceptance of the terms and conditions of these
              Terms and Conditions, Apple will have the right (and will be
              deemed to have accepted the right) to enforce these Terms and
              Conditions as relates to your licence of the RentAbout App against
              you as a third-party beneficiary thereof.
            </p>

            <h4>OTHER APP MARKETPLACES AND PLATFORMS</h4>

            <p className="mb-0">
              This Section applies where the RentAbout App has been downloaded
              from any app store or distribution platform other than the Apple
              App Store, including the Google Play Store (the "Distribution
              Platform "):
            </p>
            <div className="p-0">
              <ul>
                <li>
                  you acknowledge that these Terms are between you and
                  RentAbout, and not with the provider of the Distribution
                  Platform ("Store Provider");
                </li>
                <li>
                  your use of the RentAbout App must comply with the Store
                  Provider’s then-current Distribution Platform Terms of
                  Service;
                </li>
                <li>
                  the Store Provider is only a provider of the Distribution
                  Platform where you obtained the RentAbout App;
                </li>
                <li>
                  RentAbout, and not the Store Provider, is solely responsible
                  for the RentAbout App;
                </li>
                <li>
                  the Store Provider has no obligation or liability to you with
                  respect to the RentAbout App or these Terms and Conditions;
                </li>
                <li>
                  you acknowledge and agree that the Store Provider is a
                  third-party beneficiary to these Terms and Conditions as it
                  relates to the RentAbout App.
                </li>
              </ul>
            </div>

            <h4>ELECTRONIC COMMUNICATIONS, TRANSACTIONS, AND SIGNATURES</h4>

            <p>
              You consent to receive electronic communications, and you agree
              that all agreements, notices, disclosures, and other
              communications we provide to you electronically, via email and on
              the RentAbout Service, satisfy any legal requirement that such
              communication be in writing. YOU HEREBY AGREE TO THE USE OF
              ELECTRONIC SIGNATURES, CONTRACTS, ORDERS, AND OTHER RECORDS, AND
              TO ELECTRONIC DELIVERY OF NOTICES, POLICIES, AND RECORDS OF
              TRANSACTIONS INITIATED OR COMPLETED BY US OR VIA THE SERVICE. You
              hereby waive any rights or requirements under any statutes,
              regulations, rules, ordinances, or other laws in any jurisdiction
              which require an original signature or delivery or retention of
              non-electronic records, or to payments or the granting of credits
              by any means other than electronic means.
            </p>

            <h4>CHANGES TO THESE TERMS</h4>

            <p>
              We may revise these Terms from time to time but the most current
              version will always be on our website or in the relevant section
              of the RentAbout App. Changes may occur because of new features
              being added to the RentAbout Service, changes in the law or where
              we need to clarify our position on something. We strive to notify
              you before the new terms become effective. However, sometimes
              changes will need to be made immediately and if this happens we
              will not give you any notice. It is your responsibility to review
              these Terms periodically for any updates or modifications. If you
              continue to use the services after any changes to these Terms, it
              will signify your acceptance of the modified terms. If you do not
              agree with the updated terms, you may choose to discontinue your
              use of the services. We may also provide you with notice of any
              significant changes to these Terms via e-mail or other appropriate
              means. Such notice will specify the nature of the changes and the
              effective date. Your continued use of the services following the
              receipt of such notice constitutes your agreement to the revised
              terms.
            </p>

            <h4>GOVERNING LAW</h4>

            <p>
              English law will apply to all disputes and the interpretation of
              these. If we need to apply to court to enforce any part of these
              Terms and Conditions against you or resolve any other dispute
              between us arising from or related to your use of the RentAbout
              Service, we will initially seek to apply to the English courts.
              This does not affect your rights under the law of the country in
              which you are resident, including your right to have a dispute in
              relation to your use of the RentAbout Service heard in the courts
              of that country.
            </p>

            <h4>MISCELLANEOUS</h4>

            <p>
              These Terms and any policies or operating rules posted by us on
              our website or in respect to our services constitute the entire
              agreement and understanding between you and us. Our failure to
              exercise or enforce any right or provision of these Terms shall
              not operate as a waiver of such right or provision. These Terms
              operate to the fullest extent permissible by law. We may assign
              any or all of our rights and obligations to others at any time. We
              shall not be responsible or liable for any loss, damage, delay, or
              failure to act caused by any cause beyond our reasonable control.
              If any provision or part of a provision of these Terms is
              determined to be unlawful, void, or unenforceable, that provision
              or part of the provision is deemed severable from these Terms and
              does not affect the validity and enforceability of any remaining
              provisions. There is no joint venture, partnership, employment or
              agency relationship created between you and us as a result of
              these Terms or use of our website. You agree that these Terms will
              not be construed against us by virtue of having drafted them. You
              hereby waive any and all defenses you may have based on the
              electronic form of these Terms and the lack of execution by the
              parties hereto to these Terms.
            </p>

            <h4>BINDING EFFECT</h4>

            <p>
              These Terms constitute a legally binding agreement between you and
              us, governing your use of the RentAbout Service. Your use of the
              Service is subject to compliance with these Terms, as well as our
              Privacy Policy and any other guidelines or policies referenced
              herein. These Terms are applicable to all Owners, Renters,
              visitors, and others who access or use our Services. Please review
              these Terms carefully to ensure your understanding of your
              obligations, rights, and responsibilities when using the Services.
              Your access to and use of our Services imply your acceptance of
              these Terms. If you have any concerns or disagreements with any
              part of these Terms, please do not proceed with using our
              services.
            </p>

            <h4>CONTACT, FEEDBACK AND COMPLAINTS</h4>
            <p>
              If you need to contact us in relation to these Terms or any other
              document mentioned in them, please email us at <HelloEmailLink />.
              We value hearing from our users, and are always interested in
              learning about ways we can improve the RentAbout Service. By
              providing your feedback you agree that you are giving up any
              rights you have in your feedback so that we may use and allow
              others to use it without any restriction and without any payment
              to you.
            </p>
          </div>
        </div>
      </div>
      <Footer bgColor="bg-f5f5f5" />
    </>
  );
};

const boostServerSideProps = async () => {
  const options = await getViewPageWithCategoriesOptions();
  return { ...options };
};

export const getServerSideProps = (context) =>
  userSideProps({
    context,
    callback: boostServerSideProps,
    baseProps: { pageTitle: "Terms of service" },
  });

export default TermsOfService;
