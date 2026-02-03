import { TaskStatus, UserRole, Jurisdiction, PatentCategory, PatentType } from './types';

export const STAGE_TEMPLATES = [
  { id: 'S1', name: 'Invention Disclosure', defaultPoc: 'IP Team', isMandatory: true, slaDays: 7, description: 'Initial submission of the technical disclosure form by the inventor.' },
  { id: 'S2', name: 'Novelty Search', defaultPoc: 'Arctic', isMandatory: true, slaDays: 14, description: 'Prior art search to determine if the invention meets novelty requirements.' },
  { id: 'S3', name: 'Patentability Report', defaultPoc: 'Arctic', isMandatory: true, slaDays: 5, description: 'Formal assessment report on the likelihood of patent grant.' },
  { id: 'S4', name: 'Internal IP Review', defaultPoc: 'IP Committee', isMandatory: true, slaDays: 10, description: 'Board review to decide on filing strategy and budget approval.' },
  { id: 'S5', name: 'Provisional Drafting', defaultPoc: 'Arctic', isMandatory: false, slaDays: 15, description: 'Drafting the temporary specification to secure a priority date.' },
  { id: 'S6', name: 'Provisional Filing', defaultPoc: 'NT', isMandatory: false, slaDays: 2, description: 'Submission to the patent office to establish earliest priority.' },
  { id: 'S7', name: 'Non-Provisional Drafting', defaultPoc: 'Arctic', isMandatory: true, slaDays: 20, description: 'Detailed full specification drafting including claims and drawings.' },
  { id: 'S8', name: 'Technical Review', defaultPoc: 'NT', isMandatory: true, slaDays: 7, description: 'Internal verification of technical accuracy of the draft.' },
  { id: 'S9', name: 'Formal Filing', defaultPoc: 'NT', isMandatory: true, slaDays: 3, description: 'Final submission of the complete application to the patent office.' },
  { id: 'S10', name: 'PCT International Filing', defaultPoc: 'Arctic', isMandatory: false, slaDays: 10, description: 'Filing the international application under the Patent Cooperation Treaty.' },
  { id: 'S11', name: 'Publication (18m)', defaultPoc: 'Auto', isMandatory: true, slaDays: 540, description: 'Official publication of the application in the patent journal.' },
  { id: 'S12', name: 'Request for Examination', defaultPoc: 'NT', isMandatory: true, slaDays: 30, description: 'Formal request to the patent office to begin technical examination.' },
  { id: 'S13', name: 'First Office Action (FER)', defaultPoc: 'Examining Office', isMandatory: true, slaDays: 180, description: 'Initial report from the examiner detailing objections or allowed claims.' },
  { id: 'S14', name: 'Response to FER', defaultPoc: 'Arctic', isMandatory: true, slaDays: 90, description: 'Drafting and filing arguments/amendments to overcome office objections.' },
  { id: 'S15', name: 'Subsequent Office Actions', defaultPoc: 'Arctic', isMandatory: false, slaDays: 60, description: 'Handling second or third reports from the examiner.' },
  { id: 'S16', name: 'Hearing Notice', defaultPoc: 'Examining Office', isMandatory: false, slaDays: 30, description: 'Appointment of an oral hearing with the patent controller.' },
  { id: 'S17', name: 'Oral Hearing', defaultPoc: 'Arctic', isMandatory: false, slaDays: 15, description: 'Representing the invention during the technical discussion with the controller.' },
  { id: 'S18', name: 'Post-Hearing Submission', defaultPoc: 'Arctic', isMandatory: false, slaDays: 15, description: 'Filing written summaries and final claim sets after the hearing.' },
  { id: 'S19', name: 'Notice of Allowance', defaultPoc: 'Examining Office', isMandatory: true, slaDays: 60, description: 'Official confirmation that the patent is ready for grant.' },
  { id: 'S20', name: 'Grant', defaultPoc: 'Examining Office', isMandatory: true, slaDays: 30, description: 'Issuance of the formal patent certificate.' },
];

export const getCurrencySymbol = (jurisdictions: Jurisdiction[]) => {
  if (jurisdictions.length === 1) {
    if (jurisdictions.includes(Jurisdiction.INDIA)) return '₹';
    if (jurisdictions.includes(Jurisdiction.US)) return '$';
    if (jurisdictions.includes(Jurisdiction.UK)) return '£';
    if (jurisdictions.includes(Jurisdiction.EUROPE)) return '€';
  }
  return '₹'; // Default to Rupees
};