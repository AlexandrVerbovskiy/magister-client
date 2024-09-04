import Footer from "../components/_App/Footer";
import Navbar from "../components/_App/Navbar";
import PageBanner from "../components/Common/PageBanner";
import { userSideProps } from "../middlewares";
import { getViewPageWithCategoriesOptions } from "../services";

const InsuranceGuarantee = () => {
  return (
    <>
      <Navbar canShowSearch={false} />

      <PageBanner pageTitle="Owner Guarantee" pageName="Owner Guarantee" />

      <div className="listings-area ptb-70">
        <div className="container mt-4">
          <div className="row m-0">
            <h3>RentAbout Owner Protection Plan</h3>

            <h4>Overview</h4>
            <p className="mb-1">
              This protection plan is governed by our General Terms of Service
              and Privacy Policy.
            </p>

            <h4>What Does This Plan Cover?</h4>
            <p>
              Your listed items are protected against damage that occurs during
              the rental period. Coverage applies to each item up to its
              replacement value, provided the item’s value does not exceed the
              specified limits and meets the criteria in this document. Coverage
              limits are £1,500 in the UK.
            </p>

            <h4>What is Not Covered?</h4>
            <p>We will not cover the following:</p>
            <p className="mb-0">Damage:</p>
            <div className="p-0">
              <ul>
                <li>Due to mechanical or electrical failure or breakdown.</li>
                <li>
                  Resulting from inherent defects, such as corrosion, pest
                  damage, humidity, or extreme temperatures.
                </li>
                <li>
                  Linked to pre-existing damage, including structural issues
                  from prior impacts.
                </li>
                <li>
                  Caused by prior modifications, such as extensions, cleaning,
                  repairs, or restorations.
                </li>
                <li>
                  Due to normal wear and tear that doesn’t impair the item's
                  functionality.
                </li>
                <li>
                  Where the damage cannot be confirmed as occurring during the
                  rental period.
                </li>
                <li>
                  To sensitive or delicate items not rented with appropriate
                  protective covers, such as lens caps or cases.
                </li>
                <li>
                  Due to lack of regular maintenance or servicing of the item.
                </li>
                <li>
                  To items classified as “vintage” or no longer in circulation.
                </li>
                <li>
                  Minor cosmetic damage that does not affect functionality, such
                  as small dents or scratches.
                </li>
                <li>
                  Resulting from war, terrorism, disease, or natural disasters,
                  including floods, earthquakes, hurricanes, or pandemics.
                </li>
                <li>To flat tires or punctures on electric scooters.</li>
              </ul>
            </div>
            <p>
              Loss of income due to late returns or inability to fulfill work
              because of the temporary absence of a functioning item.
            </p>
            <p>
              Public or product liability incidents, such as injury or property
              damage caused by your equipment during a RentAbout rental.
            </p>
            <p>
              Real estate, motorhomes, campervans, people, services, chemicals,
              consumables, or any item that could reasonably be classified as a
              weapon.
            </p>
            <p>Items that are still under a claim process.</p>
            <p>Items handed over to anyone other than the verified Renter.</p>
            <p>
              Items handed over during the exchange process that do not follow
              the barcode and verification of condition process from both the
              Owner and the Renter. RentAbout cannot guarantee where no damage
              or other issues were reported as part of that process at the time
              of the exchange.
            </p>

            <h4>Eligibility to Claim</h4>
            <p className="mb-0">
              To be eligible to make a claim under this protection plan, you
              must:
            </p>
            <div className="p-0">
              <ul>
                <li>
                  Be the account holder on RentAbout who rented out the item.
                </li>
                <li>
                  Have provided the correct verification documents when
                  requested.
                </li>
                <li>
                  Have no criminal convictions (other than minor traffic
                  violations) in the past 5 years.
                </li>
                <li>
                  Have no history of county court judgments (CCJs), debt relief
                  orders (DROs), individual voluntary arrangements (IVAs), or
                  bankruptcy.
                </li>
                <li>
                  Never have had insurance cancelled, refused, or had special
                  terms imposed.
                </li>
                <li>
                  Have made no more than two insurance claims in the past 5
                  years.
                </li>
                <li>
                  Ensure the transaction was approved by RentAbout's
                  verification process before handing over the item.
                </li>
                <li>Only hand over the item to the verified Renter.</li>
              </ul>
            </div>

            <h4>Compensation Details</h4>
            <p>
              We will pay for repair costs, replacement value, or original value
              (considering depreciation), whichever is less. The "original
              value" is based on your proof of purchase. Depreciation is
              determined by our Claims Team.
            </p>
            <p>
              Our Customer Service Team will decide whether an item can be
              reasonably repaired or is irreparable. If uncertain, you may need
              to obtain a third-party appraisal.
            </p>
            <p>
              The Customer Service Team will determine when to initiate the
              claims process, after compensation has been sought from the
              Renter.
            </p>

            <h4>Owner Responsibilities</h4>
            <p className="mb-0">
              We will only make payment under this protection plan if you:
            </p>
            <div className="p-0">
              <ul>
                <li>
                  Seek compensation from the Renter for any damage, loss, or
                  theft during the rental period.
                </li>
                <li>
                  In case of theft, report the incident to the police promptly
                  and obtain a crime reference number.
                </li>
                <li>
                  Include all items in your original listing used by the Renter
                  to rent the items.
                </li>
                <li>
                  Ensure the estimated value is accurate within a 10% margin.
                </li>
                <li>
                  Provide necessary documentation to support the claim, such as:
                  <ul>
                    <li>An itemized breakdown of damages or losses.</li>
                    <li>Proof of purchase value.</li>
                    <li>Serial numbers, especially for electronics.</li>
                    <li>
                      Photos or videos of the item before and after the rental
                      to prove the condition.
                    </li>
                  </ul>
                </li>
                <li>
                  Refrain from posting information about your claim on social
                  media or online before the claim process is completed.
                </li>
                <li>
                  If your items are business-owned, you must first try to claim
                  on your existing insurance before claiming under this
                  protection plan. Provide written evidence if the claim is
                  denied.
                </li>
                <li>
                  If the item is under warranty, attempt to use it to cover
                  repairs or replacements before making a claim under this plan.
                  Provide written evidence if the warranty claim is denied.
                </li>
                <li>
                  Report any incident that may lead to a claim within 24 hours
                  of the rental end date.
                </li>
                <li>
                  Provide all required information for the claim within 3 months
                  of initiating the process. Failure to do so will result in the
                  claim being closed.
                </li>
              </ul>
            </div>

            <h4>Fraud</h4>
            <p className="mb-0">
              If you or anyone on your behalf attempts to deceive us with false
              information or a fraudulent claim:
            </p>
            <div className="p-0">
              <ul>
                <li>
                  We will refuse payment for the claim and all future claims.
                </li>
                <li>
                  You must reimburse all payments made after the fraudulent act.
                </li>
                <li>We may take legal action.</li>
                <li>Your platform access will be permanently suspended.</li>
              </ul>
            </div>
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
    baseProps: { pageTitle: "Owner Guarantee" },
  });

export default InsuranceGuarantee;
