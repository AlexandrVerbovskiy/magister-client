import Footer from "../components/_App/Footer";
import Navbar from "../components/_App/Navbar";
import { userSideProps } from "../middlewares";
import { getViewPageWithCategoriesOptions } from "../services";
import PageBanner from "../components/Common/PageBanner";
import SupportEmailLink from "../components/SupportEmailLink";
import HelloEmailLink from "../components/HelloEmailLink";

const PrivacyPolicy = () => {
  return (
    <>
      <Navbar canShowSearch={false} />

      <PageBanner pageTitle="Privacy Policy" pageName="Privacy Policy" />

      <div className="listings-area ptb-70 inform-page">
        <div className="container mt-4">
          <div className="row m-0">
            <h3>PRIVACY POLICY – RENTABOUT LIMITED</h3>
            <p>
              <strong>LAST UPDATED: 10.06.2024</strong>
            </p>
            <p className="mb-1">
              This Privacy Policy (“Policy”) for RentAbout Limited (“Company”
              "we," "us," or "our"), describes how and why we might collect,
              store, use, and/or share ("process") your information when you
              register to use the Rent About application, available for download
              on your mobile device (the "Rent About App"), and our website
              available at https://rentabout.com (together, the "Rent About
              Service" or the “Service”), or otherwise engage with us in other
              related ways. Reading this Policy will help you understand your
              privacy rights and choices. If you do not agree with our policies
              and practices, please do not use the Service. If you still have
              any questions or concerns after reading this Policy, please
              contact us at <HelloEmailLink />.
            </p>

            <h4>INFORMATION WE COLLECT</h4>

            <p>
              <b>Personal Information:</b> We collect personal information that
              you voluntarily provide to us when you register on the RentAbout
              Service or otherwise express an interest in obtaining information
              about us or our services. The Personal Data that we collect
              depends on the context of your interactions with us and the
              Service, the choices you make, and the features you use. The
              Personal Data we collect may include your full name, ID, selfie,
              employment and education details, phone number, email and address.
              This processing will be carried out in accordance with applicable
              privacy laws and regulations to ensure the confidentiality and
              security of your Personal Data. We are committed to maintaining
              the privacy and protection of your information, and any processing
              will be conducted in compliance with this Policy and relevant
              legal requirements.
            </p>

            <p>
              <b>Information Automatically Collected:</b> We automatically
              collect certain information when you visit, use, or navigate the
              RentAbout Service. This information does not reveal your specific
              identity (like your name or contact information) but may include
              device and usage information, such as your IP address, browser and
              device characteristics, operating system, language preferences,
              referring URLs, device name, country, location, information about
              how and when you use the Service, and other technical information.
              This information is primarily needed to maintain the security and
              operation the Service, and for our internal analytics and
              reporting purposes. The information we collect includes:
            </p>

            <p>
              <b>Log and Usage Data:</b> Log and usage data is service-related,
              diagnostic, usage, and performance information our servers
              automatically collect when you access or use the Rent About App
              (the "App") and which we record in log files. Depending on how you
              interact with us, this log data may include your IP address,
              device information, browser type, and settings and information
              about your activity in the App (such as the date/time stamps
              associated with your usage, pages and files viewed, searches, and
              other actions you take such as which features you use), device
              event information (such as system activity, error reports
              (sometimes called "crash dumps”), and hardware settings).
            </p>

            <p>
              <b>Device Data:</b> We collect device data such as information
              about your mobile phone, tablet, or other device you use to access
              the App. Depending on the device used, this device data may
              include information such as your IP address (or proxy server),
              device and application identification numbers, location, browser
              type, hardware model, Internet service provider and/or mobile
              carrier, operating system, and system configuration information.
            </p>

            <p>
              <b>Permissions:</b> We may request access to your camera and photo
              gallery. This is solely to enable you to upload photos of items
              you wish to rent or share. We will only access these features with
              your explicit consent, and you can manage or withdraw this
              permission at any time through your device settings.
            </p>

            <p>
              <b>Geolocation:</b> With your explicit consent, we may collect and
              use your geolocation data. This allows us to show you items
              available for rent in your vicinity, enhancing your experience by
              providing more relevant and localized options. You can control and
              adjust geolocation permissions through your device's settings at
              any time.
            </p>

            <p>
              <b>Social Media Accounts:</b> If you choose to sign up or log in
              using a social media account (e.g., Facebook, Google, Apple etc.),
              we may collect basic information from your social media profile,
              such as your name, profile picture, and email address. This helps
              streamline your registration and enhances your user experience. We
              only access this information with your consent, and you can always
              review and modify your privacy settings on the respective social
              media platforms.
            </p>

            <h4>PROCESSING YOUR INFORMATION</h4>
            <p className="mb-0">
              We process your personal information for a variety of reasons,
              depending on how you interact with the Rent About Service
              including:
            </p>
            <div className="p-0">
              <ul>
                <li>
                  to enable you create and log in to your account, as well as
                  keep your account in working order;
                </li>
                <li>to provide you with the requested services;</li>
                <li>
                  to respond to your inquiries and solve any potential issues
                  you might have in connection with the Service;
                </li>
                <li>
                  to send you details about the Services and our related
                  products and services, changes to our terms and policies, and
                  other similar information via email SMS or your RentAbout
                  Account;
                </li>
                <li>
                  to enable user-user communication if you choose to use any of
                  our features that allow for communication with other users;
                </li>
                <li>
                  to request feedback and to contact you about your use of the
                  Service;
                </li>
                <li>
                  as part of our efforts to keep the Services safe and secure,
                  including fraud monitoring and prevention;
                </li>
                <li>
                  when we believe it is necessary to identify usage trends, and
                  to evaluate and improve our services, products, and your
                  experience;
                </li>
                <li>
                  to comply with our legal obligations, respond to legal
                  requests, and exercise, establish, or defend our legal rights;
                </li>
                <li>
                  to save or protect an individual's vital interest, such as to
                  prevent harm.
                </li>
              </ul>
            </div>
            <p>
              In addition to the foregoing, we may use and process your
              information to comply with our legal obligations, respond to
              lawful requests or court orders, and enforce our terms and
              conditions. This includes protecting our rights, safety, and
              property, as well as the rights, safety, and property of our users
              or any other third parties. We may aggregate and anonymize your
              information to create statistical or aggregated data that does not
              personally identify you. This aggregated and anonymized data may
              be used for various purposes, such as analyzing usage patterns,
              improving our Services, or conducting market research, or sharing
              with third parties for lawful purposes.
            </p>

            <h4>SHARING YOUR INFORMATION</h4>

            <p>
              At Rent About, we prioritize your privacy and take the security of
              your Personal Data very seriously. Below, we outline how and with
              whom we share your information.
            </p>

            <p>
              <b>Our Employees:</b> Your information is accessible only to Rent
              About employees who need it to perform their job functions. We
              enforce strict access controls and confidentiality agreements to
              ensure that your data is handled securely and only used for
              legitimate business purposes. Employees are trained to understand
              the importance of privacy and the handling of personal
              information.
            </p>

            <p>
              <b>With Other Users:</b> When you enter into a rental agreement
              with another user on our platform, we facilitate the sharing of
              necessary contact information to enable smooth and effective
              communication between parties. Specifically, your phone number
              will be shared with the other party involved in the rental
              agreement. This sharing is essential for coordinating pick-ups,
              drop-offs, and other logistics related to the rental.
            </p>

            <p>
              <b>Service Providers:</b> We work with a range of trusted service
              providers to deliver and enhance our services. These organizations
              may require access to your data to fulfill their roles. We may
              share your payment information with payment processing companies,
              such as Paypal and Stripe, to facilitate transactions securely and
              efficiently. These processors handle your payment details
              according to industry standards for security and privacy. We also
              utilize customer communication tools, such as Twilio, to manage
              and streamline our interactions with you. These platforms may
              process your contact information to help us provide timely support
              and respond to your inquiries. Each of these service providers is
              carefully vetted and bound by contracts to ensure they maintain
              the confidentiality and security of your information. They are
              only permitted to use your data for the specific services they
              provide on our behalf.
            </p>

            <p>
              <b>Business Transfers:</b> We may share or transfer your
              information in connection with, or during negotiations of, any
              merger, sale of company assets, financing, or acquisition of all
              or a portion of our business to another company. We will notify
              you via email or through a prominent notice on our website of any
              change in ownership or the use of your personal information. The
              acquiring entity will be required to comply with the terms of this
              Policy, unless you are provided with a new privacy policy and
              given the opportunity to opt-out.
            </p>

            <p className="mb-0">
              <b>Regulatory Authorities:</b> In certain circumstances, we may be
              required to share your information with regulatory authorities or
              law enforcement agencies. This can occur in situations where we
              must comply with legal obligations, such as court orders or
              subpoenas, or when it is necessary to:
            </p>

            <div className="p-0">
              <ul>
                <li>
                  safeguard the rights, property, or safety of Rent About, our
                  users, or others;
                </li>
                <li>address suspected fraud or security issues;</li>
                <li>
                  respond to requests from public authorities and government
                  agencies. We carefully review such requests to ensure they
                  have a legitimate basis and comply with applicable laws. We
                  strive to disclose only the information that is legally
                  required or necessary for the specified purpose.
                </li>
              </ul>
            </div>

            <h4>LEGAL BASIS FOR PROCESSING YOUR INFORMATION</h4>

            <p>
              The General Data Protection Regulations (GDPR) 2016 requires us to
              explain the valid legal bases we rely on in order to process your
              Personal Data. As such, we may rely on the following legal bases
              to process your personal information:
            </p>

            <p>
              <b>With your consent.</b> We may process your information if you
              have given us express permission (i.e. consent) to use your
              personal information for a specific purpose. You may withdraw your
              consent at any time by contacting us at <HelloEmailLink />.
            </p>

            <p>
              <b>Performance of a Contract.</b> We may process your Personal
              Data when we believe it is necessary to fulfil our contractual
              obligations to you, including providing our Services or at your
              request prior to entering into a contract with you.
            </p>

            <p>
              <b>Legitimate Interests.</b> We may process your information when
              we believe it is reasonably necessary to achieve our legitimate
              business interests and those interests do not outweigh your
              interests and fundamental rights and freedoms.
            </p>

            <p className="mb-0">
              For example, we may process your personal information for some of
              the purposes described in order to:
            </p>

            <div className="p-0">
              <ul>
                <li>
                  send users information about special offers on our services;
                </li>
                <li>
                  develop and display personalised and relevant advertising
                  content for our users;
                </li>
                <li>
                  analyse how the Services are used so we can improve them to
                  engage and retain users;
                </li>
                <li>support our marketing activities;</li>
                <li>diagnose problems and/or prevent fraudulent activities;</li>
                <li>
                  understand how our users use the Services so we can improve
                  user experience.
                </li>
              </ul>
            </div>

            <p>
              <b>Legal Obligations.</b> We may process your information where we
              believe it is necessary for compliance with our legal obligations,
              such as to cooperate with a law enforcement body or regulatory
              agency, exercise or defend our legal rights, or disclose your
              information as evidence in litigation in which we are involved. We
              may also process your information where we believe it is necessary
              to protect your vital interests or the vital interests of a third
              party such as situations involving potential threats to the safety
              of any person.
            </p>

            <h4>YOUR PRIVACY RIGHTS</h4>

            <p className="mb-0">
              You have certain rights under applicable data protection laws.
              These may include the right:
            </p>

            <div className="p-0">
              <ul>
                <li>
                  to request access and obtain a copy of your personal
                  information;
                </li>
                <li>to request rectification or erasure;</li>
                <li>
                  to restrict the processing of your personal information;
                </li>
                <li>if applicable, to data portability;</li>
                <li>not to be subject to automated decision-making.</li>
              </ul>
            </div>

            <p>
              In certain circumstances, you may also have the right to object to
              the processing of your Personal Data. You can make such a request
              by contacting us via <HelloEmailLink />. We will consider and act
              upon any request in accordance with applicable data protection
              laws. If you believe we are unlawfully processing your Personal
              Data, you also have the right to complain to your local data
              protection authority.
            </p>

            <p>
              If we rely on your consent to process your personal information,
              you have the right to withdraw this consent at any time. You may
              withdraw your consent at any time by contacting us{" "}
              <HelloEmailLink />. Please note however that this will not affect
              the lawfulness of the processing before its withdrawal nor, will
              it affect the processing of your Personal Data conducted in
              reliance on lawful processing grounds other than consent.
            </p>

            <p>
              You can unsubscribe from our marketing and promotional
              communications at any time by clicking on the unsubscribe link in
              the emails that we send, or by contacting us. You will then be
              removed from the marketing lists. However, we may still
              communicate with you, for example, to send you service-related
              messages that are necessary for the administration and use of your
              account, to respond to service requests, or for other
              non-marketing purposes.
            </p>

            <p>
              Most Web browsers are set to accept cookies by default. If you
              prefer, you can usually choose to set your browser to remove
              cookies and to reject cookies. If you choose to remove cookies or
              reject cookies, this could affect certain features or services of
              our Services.
            </p>

            <p>
              If you have questions or concerns about your privacy rights, you
              may email us at <HelloEmailLink />.
            </p>

            <h4>DATA SECURITY</h4>

            <p>
              <b>SSL Encryption:</b> All data transmitted between your device
              and our servers is encrypted using Secure Sockets Layer (SSL)
              technology. This encryption method ensures that any information
              you send or receive through our platform is secure and cannot be
              intercepted by unauthorized parties. Whether you’re entering
              payment details or personal information, SSL encryption keeps your
              data safe during transmission.
            </p>

            <p>
              <b>Secure Data Storage:</b> Any verification information you
              provide, such as identity documents or payment details, is stored
              in an encrypted format. This means that even if the data is
              accessed by unauthorized individuals, it remains unreadable
              without the appropriate decryption keys. Access to this encrypted
              information is strictly limited to authorized employees who need
              it to perform their job functions. These employees are subject to
              rigorous data protection policies and confidentiality agreements.
            </p>

            <p>
              <b>Cross-Border Data Transfers:</b> While we primarily collect and
              store your data within the European Economic Area (EEA), we may
              sometimes need to transfer your information to service providers
              or partners located outside the EEA. In such cases, we ensure that
              appropriate safeguards are in place to protect your data. These
              safeguards include standard contractual clauses, data protection
              shields and adequate country assessments. These measures ensure
              that your data remains protected no matter where it is processed
              or stored.
            </p>

            <p>
              <b>Ongoing Security Commitment:</b> We are continuously monitoring
              and updating our security practices to meet the evolving standards
              of data protection. Our commitment to your privacy and security
              means that we will always strive to implement the best possible
              measures to safeguard your information. If you have any concerns
              or questions about the security of your data, please contact us at{" "}
              <HelloEmailLink />.
            </p>

            <h4>COOKIES</h4>
            <p>
              We use cookies to track your activity on our website to improve
              your experience. You can turn cookies off in your browser or phone
              settings, but this may reduce the quality of your experience. For
              more information about cookies and how to manage them, please
              contact us at <HelloEmailLink />.
            </p>

            <h4>CREDIT ASSESSMENTS FOR LONG-TERM RENTALS</h4>
            <p>
              For qualifying long-term rental plans, Rent About may need to
              assess your creditworthiness to ensure that you meet our financial
              criteria. This assessment helps us make informed decisions about
              your rental application and manage financial risks effectively. To
              evaluate your creditworthiness, we may conduct a credit check
              through reputable credit reference agencies, such as Experian.
              These agencies provide us with a detailed report on your credit
              history and financial behavior. The credit report may include
              information such as your credit score, existing credit
              obligations, payment history, and any records of bankruptcy or
              defaults. This data helps us understand your financial stability
              and ability to meet the obligations of a long-term rental
              agreement. The information obtained from the credit reference
              agency is used solely for the purpose of assessing your
              eligibility for long-term rental plans. It helps us determine
              whether you meet the required criteria and aids in making fair and
              responsible lending decisions. We will always obtain your explicit
              consent before performing a credit check. You will be informed
              about the purpose of the check and how the information will be
              used. If you have any concerns about this process, you can contact
              us for more details before consenting. Performing a credit check
              through Rent About is considered a “soft inquiry” and does not
              impact your credit score. This means that while we obtain the
              necessary information to assess your creditworthiness, it will not
              affect your overall credit rating. You have the right to access
              the information we receive from credit reference agencies. If you
              believe any data in your credit report is inaccurate or outdated,
              you can request corrections from the credit reference agency. All
              credit information we collect is handled with confidentiality and
              is used only for the purpose stated. We store this data securely
              and limit access to authorized personnel only.
            </p>

            <h4>CHANGES TO THIS POLICY</h4>
            <p>
              We may update this Privacy Policy from time to time. The updated
              version will be indicated by an updated 'Revised' date and the
              updated version will be effective as soon as it is accessible. If
              we make material changes to this privacy policy, we may notify you
              either by prominently posting a notice of such changes or by
              directly sending you a notification. We encourage you to review
              this Privacy Policy frequently to be informed of how we are
              processing your information.
            </p>

            <h4>CONTACT US</h4>
            <p>
              If you have questions, comments or complaints about this Privacy
              Policy or the way we process your information, you may contact us
              via email at <HelloEmailLink /> or through the “CONTACT US”
              section on our website or mobile application.
            </p>
            <p className="mb-0">
              Alternatively, you may contact us by post to the following
              address:
            </p>

            <div className="p-0">
              <ul>
                <li>RENT ABOUT LTD.</li>
                <li>
                  The Innovation Centre, Sci-Tech Daresbury, Keckwick Lane,
                  Daresbury WA4 4FS. Company number (15277425).
                </li>
              </ul>
            </div>

            <h4>HOW TO SUBMIT A QUERY OR LODGE A COMPLAINT</h4>
            <p>
              If you have any questions or need to raise a concern, feel free to
              contact us at <HelloEmailLink />. Our team is dedicated to
              assisting you and will work to resolve any issues you may have.
              Should you feel that your concerns have not been fully addressed,
              you can take your complaint further by reaching out to the
              Financial Ombudsman Service. You can find more details on their
              website at www.financial-ombudsman.org.uk.
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
    baseProps: { pageTitle: "Privacy policy" },
  });

export default PrivacyPolicy;
