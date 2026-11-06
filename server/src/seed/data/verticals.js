// src/seed/data/verticals.js
export default [
  {
    slug: 'ipr',
    name: 'IPR',
    positioningLine: 'Patent & IP services',
    services: ['Patent search', 'Drafting assistance'],
    workflowStages: ['New', 'Initial Review', 'Quotation Sent', 'Closed'],
    formSchema: [
      { name: 'applicantType', label: 'Applicant Type', type: 'text', required: true },
      { name: 'description', label: 'Description', type: 'textarea', required: true },
      { name: 'secureDoc', label: 'Secure Document', type: 'file', required: false },
    ],
    icon: 'file-text',
    accentColor: 'indigo-500',
  },
];