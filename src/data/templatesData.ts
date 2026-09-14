import { escapeHtml } from '@/lib/escapeHtml';
export interface TemplateField {
  key: string;
  label: string;
  placeholder?: string;
  defaultValue: string;
  type?: 'text' | 'date' | 'textarea' | 'number';
}

export interface TemplateItem {
  id: string;
  title: string;
  category: 'Business' | 'Legal' | 'Career' | 'Academic' | 'Matrimonial';
  badge?: string;
  formats: ('DOCX' | 'PDF' | 'HTML' | 'PRINT')[];
  description: string;
  tags: string[];
  downloadsCount: number;
  popular?: boolean;
  fields: TemplateField[];
  generateText: (values: Record<string, string>) => string;
  generateHtml: (values: Record<string, string>) => string;
}

export const TEMPLATE_CATEGORIES = [
  'All Categories',
  'Business',
  'Legal',
  'Career',
  'Academic',
  'Matrimonial'
] as const;

export const TEMPLATES: TemplateItem[] = [
  // ================= BUSINESS =================
  {
    id: 'commercial-invoice',
    title: 'Standard Commercial Invoice & GST Bill',
    category: 'Business',
    badge: 'Popular',
    formats: ['DOCX', 'PDF', 'PRINT'],
    description: 'Clean, printable tax invoice format with itemized billing, subtotal, tax rate, and bank details.',
    tags: ['Invoice', 'Billing', 'GST', 'Accounts', 'Commercial', 'Tax Receipt'],
    downloadsCount: 14200,
    popular: true,
    fields: [
      { key: 'companyName', label: 'Company / Business Name', defaultValue: 'Nexus Horizon Technologies Ltd.' },
      { key: 'companyAddress', label: 'Company Address', defaultValue: 'Office 402, Blue Area, Islamabad, Pakistan' },
      { key: 'clientName', label: 'Client / Billed To', defaultValue: 'Alpha Solutions Corp' },
      { key: 'clientAddress', label: 'Client Address', defaultValue: 'Suite 101, Main Boulevard, Gulberg III, Lahore' },
      { key: 'invoiceNumber', label: 'Invoice No.', defaultValue: 'INV-2026-089' },
      { key: 'invoiceDate', label: 'Invoice Date', type: 'date', defaultValue: '2026-09-14' },
      { key: 'dueDate', label: 'Payment Due Date', type: 'date', defaultValue: '2026-09-28' },
      { key: 'item1Description', label: 'Item 1 Description', defaultValue: 'Full-Stack Web Development & API Integration' },
      { key: 'item1Amount', label: 'Item 1 Amount ($ / PKR)', defaultValue: '120,000' },
      { key: 'item2Description', label: 'Item 2 Description', defaultValue: 'Cloud Server Setup, Security Audit & Deployment' },
      { key: 'item2Amount', label: 'Item 2 Amount ($ / PKR)', defaultValue: '45,000' },
      { key: 'totalAmount', label: 'Total Payable Amount', defaultValue: '165,000' },
      { key: 'bankDetails', label: 'Bank Account / IBAN', defaultValue: 'HBL Bank - A/C: 00427901234567 (Title: Nexus Horizon)' }
    ],
    generateText: (v) => `
COMMERCIAL INVOICE
----------------------------------------------------------------------
${escapeHtml(v.companyName)}
${escapeHtml(v.companyAddress)}

Invoice Number: ${escapeHtml(v.invoiceNumber)}
Date: ${escapeHtml(v.invoiceDate)}
Payment Due Date: ${escapeHtml(v.dueDate)}

BILLED TO:
${escapeHtml(v.clientName)}
${escapeHtml(v.clientAddress)}

----------------------------------------------------------------------
ITEMS & SERVICES                                      AMOUNT
----------------------------------------------------------------------
1. ${escapeHtml(v.item1Description)}            Rs. ${escapeHtml(v.item1Amount)}
2. ${escapeHtml(v.item2Description)}            Rs. ${escapeHtml(v.item2Amount)}
----------------------------------------------------------------------
TOTAL AMOUNT DUE:                                    Rs. ${escapeHtml(v.totalAmount)}
----------------------------------------------------------------------

PAYMENT INSTRUCTIONS:
Bank Details: ${escapeHtml(v.bankDetails)}

Thank you for your valued business!
Terms: Payment expected within 14 days of invoice date.
`.trim(),
    generateHtml: (v) => `
<div style="font-family: Arial, sans-serif; color: #1e293b; max-width: 700px; margin: auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 8px;">
  <div style="display: flex; justify-content: space-between; border-bottom: 2px solid #2563eb; padding-bottom: 16px; margin-bottom: 20px;">
    <div>
      <h2 style="margin: 0; color: #1e3a8a; font-size: 22px;">${escapeHtml(v.companyName)}</h2>
      <p style="margin: 4px 0 0; color: #64748b; font-size: 13px;">${escapeHtml(v.companyAddress)}</p>
    </div>
    <div style="text-align: right;">
      <h1 style="margin: 0; color: #2563eb; font-size: 24px; text-transform: uppercase;">INVOICE</h1>
      <p style="margin: 4px 0 0; font-size: 13px;"><strong>#${escapeHtml(v.invoiceNumber)}</strong></p>
      <p style="margin: 2px 0 0; color: #64748b; font-size: 12px;">Date: ${escapeHtml(v.invoiceDate)}</p>
    </div>
  </div>

  <div style="margin-bottom: 20px; background: #f8fafc; padding: 12px; border-radius: 6px;">
    <strong style="color: #475569; font-size: 11px; text-transform: uppercase;">Billed To:</strong>
    <p style="margin: 4px 0 0; font-weight: bold; font-size: 15px;">${escapeHtml(v.clientName)}</p>
    <p style="margin: 2px 0 0; color: #64748b; font-size: 13px;">${escapeHtml(v.clientAddress)}</p>
    <p style="margin: 4px 0 0; font-size: 12px; color: #dc2626;"><strong>Due Date:</strong> ${escapeHtml(v.dueDate)}</p>
  </div>

  <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
    <thead>
      <tr style="background: #1e293b; color: #ffffff; text-align: left; font-size: 13px;">
        <th style="padding: 10px;">Description</th>
        <th style="padding: 10px; text-align: right;">Amount</th>
      </tr>
    </thead>
    <tbody style="font-size: 13px;">
      <tr style="border-bottom: 1px solid #e2e8f0;">
        <td style="padding: 10px;">${escapeHtml(v.item1Description)}</td>
        <td style="padding: 10px; text-align: right; font-weight: 600;">${escapeHtml(v.item1Amount)}</td>
      </tr>
      <tr style="border-bottom: 1px solid #e2e8f0;">
        <td style="padding: 10px;">${escapeHtml(v.item2Description)}</td>
        <td style="padding: 10px; text-align: right; font-weight: 600;">${escapeHtml(v.item2Amount)}</td>
      </tr>
      <tr style="background: #f1f5f9; font-weight: bold; font-size: 15px;">
        <td style="padding: 12px; color: #0f172a;">Total Payable</td>
        <td style="padding: 12px; text-align: right; color: #2563eb;">${escapeHtml(v.totalAmount)}</td>
      </tr>
    </tbody>
  </table>

  <div style="background: #eff6ff; border-left: 4px solid #3b82f6; padding: 12px; border-radius: 4px; font-size: 12px;">
    <strong>Remittance / Bank Details:</strong><br />
    ${escapeHtml(v.bankDetails)}
  </div>
</div>
`
  },
  {
    id: 'quotation-estimate',
    title: 'Formal Business Quotation & Estimate',
    category: 'Business',
    badge: 'Verified',
    formats: ['DOCX', 'PDF', 'PRINT'],
    description: 'Professional commercial estimate proposal with scope of work, validity period, and terms.',
    tags: ['Quotation', 'Estimate', 'Proposal', 'Pricing', 'Client Pitch'],
    downloadsCount: 8900,
    fields: [
      { key: 'companyName', label: 'Company / Agency Name', defaultValue: 'Apex Digital & Creative Studios' },
      { key: 'quotationNo', label: 'Quotation Ref No.', defaultValue: 'QUO-2026-512' },
      { key: 'date', label: 'Date Issued', type: 'date', defaultValue: '2026-09-14' },
      { key: 'validity', label: 'Validity (Days)', defaultValue: '30 Days from issue' },
      { key: 'clientName', label: 'Prepared For (Client Name)', defaultValue: 'Prime Hospitality Ventures' },
      { key: 'scopeSummary', label: 'Scope Summary', type: 'textarea', defaultValue: 'Brand identity redesign, complete UI/UX prototyping, cross-platform web deployment, and 3 months technical support.' },
      { key: 'estimatedCost', label: 'Estimated Total Cost', defaultValue: '250,000 PKR' },
      { key: 'paymentTerms', label: 'Payment Terms', defaultValue: '50% upfront deposit upon contract signing, 50% upon final signoff and delivery.' }
    ],
    generateText: (v) => `
BUSINESS QUOTATION & PROJECT ESTIMATE
----------------------------------------------------------------------
ISSUED BY: ${escapeHtml(v.companyName)}
QUOTATION REF: ${escapeHtml(v.quotationNo)}
DATE: ${escapeHtml(v.date)}
VALIDITY: ${escapeHtml(v.validity)}

CLIENT INFORMATION:
Prepared For: ${escapeHtml(v.clientName)}

PROJECT SCOPE & DELIVERABLES:
${escapeHtml(v.scopeSummary)}

ESTIMATED INVESTMENT:
Total Estimated Price: ${escapeHtml(v.estimatedCost)}

TERMS & CONDITIONS:
- ${escapeHtml(v.paymentTerms)}
- Any additional feature requests beyond the agreed scope will be billed at an hourly rate.

Authorized Signatory: _________________________
`.trim(),
    generateHtml: (v) => `
<div style="font-family: Arial, sans-serif; color: #1e293b; max-width: 700px; margin: auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 8px;">
  <div style="display: flex; justify-content: space-between; border-bottom: 2px solid #059669; padding-bottom: 14px; margin-bottom: 18px;">
    <div>
      <h2 style="margin: 0; color: #065f46; font-size: 20px;">${escapeHtml(v.companyName)}</h2>
      <p style="margin: 3px 0 0; color: #64748b; font-size: 12px;">Official Project Quotation</p>
    </div>
    <div style="text-align: right;">
      <span style="background: #d1fae5; color: #065f46; font-size: 11px; font-weight: bold; padding: 4px 8px; border-radius: 4px;">Ref: ${escapeHtml(v.quotationNo)}</span>
      <p style="margin: 5px 0 0; color: #64748b; font-size: 12px;">Date: ${escapeHtml(v.date)}</p>
    </div>
  </div>

  <div style="margin-bottom: 16px;">
    <p style="margin: 0; font-size: 12px; color: #64748b; text-transform: uppercase;">Prepared For:</p>
    <h3 style="margin: 4px 0; color: #0f172a; font-size: 16px;">${escapeHtml(v.clientName)}</h3>
  </div>

  <div style="background: #f8fafc; padding: 14px; border-radius: 6px; margin-bottom: 16px; border: 1px solid #e2e8f0;">
    <h4 style="margin: 0 0 6px; font-size: 13px; color: #0f172a;">Scope of Work:</h4>
    <p style="margin: 0; font-size: 13px; line-height: 1.5; color: #334155;">${escapeHtml(v.scopeSummary)}</p>
  </div>

  <div style="display: flex; justify-content: space-between; align-items: center; background: #ecfdf5; border: 1px solid #a7f3d0; padding: 14px; border-radius: 6px; margin-bottom: 16px;">
    <span style="font-weight: bold; font-size: 14px; color: #065f46;">Total Estimated Investment:</span>
    <span style="font-size: 20px; font-weight: bold; color: #059669;">${escapeHtml(v.estimatedCost)}</span>
  </div>

  <div style="font-size: 12px; color: #475569; border-top: 1px solid #e2e8f0; padding-top: 12px;">
    <strong>Payment & Terms:</strong> ${escapeHtml(v.paymentTerms)}<br />
    <em>Quotation is valid for: ${escapeHtml(v.validity)}</em>
  </div>
</div>
`
  },
  {
    id: 'cash-payment-voucher',
    title: 'Cash Payment Voucher & Official Receipt',
    category: 'Business',
    badge: '100% Free',
    formats: ['DOCX', 'PDF', 'PRINT'],
    description: 'Double receipt format (Office Copy & Customer Copy) for daily cash transactions and rent.',
    tags: ['Cash Voucher', 'Receipt', 'Accounts', 'Petty Cash', 'Slip'],
    downloadsCount: 11200,
    fields: [
      { key: 'organization', label: 'Company / Landlord / Issuer', defaultValue: 'Al-Madina Trading & Enterprises' },
      { key: 'receiptNo', label: 'Receipt No.', defaultValue: 'REC-9041' },
      { key: 'receiptDate', label: 'Date', type: 'date', defaultValue: '2026-09-14' },
      { key: 'receivedFrom', label: 'Received From (Person / Co.)', defaultValue: 'Mr. Usman Tariq' },
      { key: 'sumOf', label: 'The Sum Of (Amount in Words)', defaultValue: 'Fifty Thousand Rupees Only' },
      { key: 'numericAmount', label: 'Amount (Digits)', defaultValue: '50,000' },
      { key: 'onAccountOf', label: 'On Account Of / Purpose', defaultValue: 'Advance booking payment for Office Space Lease #14' },
      { key: 'modeOfPayment', label: 'Payment Mode', defaultValue: 'Cash / Bank Transfer' },
      { key: 'authorizedBy', label: 'Receiver / Signature', defaultValue: 'Accounts Department' }
    ],
    generateText: (v) => `
CASH PAYMENT RECEIPT / VOUCHER
----------------------------------------------------------------------
${escapeHtml(v.organization)}
Receipt No: ${escapeHtml(v.receiptNo)}                        Date: ${escapeHtml(v.receiptDate)}

Received with thanks from: ${escapeHtml(v.receivedFrom)}
The sum of Rupees: ${escapeHtml(v.sumOf)}
Amount in Figures: Rs. ${escapeHtml(v.numericAmount)} /-
On Account of: ${escapeHtml(v.onAccountOf)}
Mode of Payment: ${escapeHtml(v.modeOfPayment)}

----------------------------------------------------------------------
Received By: ___________________        Customer Signature: ___________
`.trim(),
    generateHtml: (v) => `
<div style="font-family: Arial, sans-serif; color: #1e293b; max-width: 650px; margin: auto; padding: 20px; border: 2px dashed #94a3b8; border-radius: 8px;">
  <div style="display: flex; justify-content: space-between; border-bottom: 2px solid #0284c7; padding-bottom: 8px; margin-bottom: 12px;">
    <div>
      <h3 style="margin: 0; color: #0369a1; font-size: 18px;">${escapeHtml(v.organization)}</h3>
      <span style="font-size: 11px; color: #64748b;">OFFICIAL MONEY RECEIPT</span>
    </div>
    <div style="text-align: right;">
      <p style="margin: 0; font-size: 13px; font-weight: bold; color: #dc2626;">No: ${escapeHtml(v.receiptNo)}</p>
      <p style="margin: 2px 0 0; font-size: 12px; color: #64748b;">Date: ${escapeHtml(v.receiptDate)}</p>
    </div>
  </div>

  <table style="width: 100%; font-size: 13px; line-height: 1.8;">
    <tr>
      <td style="width: 25%; color: #64748b;">Received From:</td>
      <td style="font-weight: bold; border-bottom: 1px dotted #cbd5e1;">${escapeHtml(v.receivedFrom)}</td>
    </tr>
    <tr>
      <td style="color: #64748b;">The Sum of:</td>
      <td style="font-style: italic; border-bottom: 1px dotted #cbd5e1;">${escapeHtml(v.sumOf)}</td>
    </tr>
    <tr>
      <td style="color: #64748b;">On Account of:</td>
      <td style="border-bottom: 1px dotted #cbd5e1;">${escapeHtml(v.onAccountOf)}</td>
    </tr>
    <tr>
      <td style="color: #64748b;">Payment Method:</td>
      <td style="border-bottom: 1px dotted #cbd5e1;">${escapeHtml(v.modeOfPayment)}</td>
    </tr>
  </table>

  <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-top: 24px; padding-top: 12px;">
    <div style="background: #f1f5f9; padding: 8px 16px; border-radius: 4px; border: 1px solid #cbd5e1;">
      <span style="font-size: 11px; color: #64748b;">AMOUNT:</span><br />
      <strong style="font-size: 18px; color: #0284c7;">Rs. ${escapeHtml(v.numericAmount)} /-</strong>
    </div>
    <div style="text-align: center;">
      <div style="width: 140px; border-top: 1px solid #475569; margin-bottom: 4px;"></div>
      <span style="font-size: 11px; color: #475569;">${escapeHtml(v.authorizedBy)}</span>
    </div>
  </div>
</div>
`
  },

  // ================= LEGAL =================
  {
    id: 'rent-agreement',
    title: 'House & Shop Rent Agreement (Urdu / English)',
    category: 'Legal',
    badge: 'Govt Standard',
    formats: ['DOCX', 'PDF', 'PRINT'],
    description: 'Legally vetted residential and commercial lease agreement with security deposit, rent cycle, and utility clauses.',
    tags: ['Rent Agreement', 'Tenancy Contract', 'Kirayanama', 'Stamp Paper', 'Property Lease'],
    downloadsCount: 19500,
    popular: true,
    fields: [
      { key: 'landlordName', label: 'Landlord Full Name (Malik-e-Makaan)', defaultValue: 'Muhammad Riaz Khan' },
      { key: 'landlordCnic', label: 'Landlord CNIC / ID No.', defaultValue: '37405-1234567-1' },
      { key: 'tenantName', label: 'Tenant Full Name (Kirayedar)', defaultValue: 'Ahmed Hassan Siddiqui' },
      { key: 'tenantCnic', label: 'Tenant CNIC / ID No.', defaultValue: '37405-7654321-3' },
      { key: 'propertyAddress', label: 'Rented Premises Full Address', defaultValue: 'House No. 45-B, Street 12, F-10/2, Islamabad' },
      { key: 'monthlyRent', label: 'Monthly Rent (PKR)', defaultValue: '75,000' },
      { key: 'securityDeposit', label: 'Security Deposit (Refundable)', defaultValue: '150,000' },
      { key: 'tenancyDuration', label: 'Duration of Tenancy', defaultValue: '11 Months (Renewable)' },
      { key: 'startDate', label: 'Agreement Start Date', type: 'date', defaultValue: '2026-10-01' }
    ],
    generateText: (v) => `
RESIDENTIAL / COMMERCIAL TENANCY AGREEMENT
(MUAHDANAMA KIRAYADARI / کرایہ نامہ)
----------------------------------------------------------------------
This Tenancy Agreement is executed on ${escapeHtml(v.startDate)} between:

1. FIRST PARTY (LANDLORD / LESSOR):
Name: ${escapeHtml(v.landlordName)}
CNIC / Identity No: ${escapeHtml(v.landlordCnic)}
(Hereinafter called the "Landlord" which term includes his heirs, successors & assigns).

AND

2. SECOND PARTY (TENANT / LESSEE):
Name: ${escapeHtml(v.tenantName)}
CNIC / Identity No: ${escapeHtml(v.tenantCnic)}
(Hereinafter called the "Tenant" which term includes his heirs & legal representatives).

WHEREAS the Landlord is absolute owner and in possession of the premises situated at:
${escapeHtml(v.propertyAddress)}

NOW THEREFORE BOTH PARTIES MUTUALLY AGREE AS FOLLOWS:
1. TERM: The tenancy is granted for a period of ${escapeHtml(v.tenancyDuration)} commencing from ${escapeHtml(v.startDate)}.
2. MONTHLY RENT: The monthly rent agreed is Rs. ${escapeHtml(v.monthlyRent)} /- payable in advance on or before the 5th of each calendar month.
3. SECURITY DEPOSIT: The Tenant has paid a refundable security deposit of Rs. ${escapeHtml(v.securityDeposit)} /- to the Landlord.
4. UTILITY BILLS: Electricity, gas, water, and society maintenance bills shall be paid promptly by the Tenant.
5. SUB-LETTING: The Tenant shall NOT sublet, assign, or part with the possession of the premises to any third party.
6. TERMINATION / NOTICE: Either party may terminate this agreement by serving one (1) month prior written notice.

IN WITNESS WHEREOF, the parties hereto have set their hands on this agreement:

___________________________                 ___________________________
Landlord Signature                          Tenant Signature
CNIC: ${escapeHtml(v.landlordCnic)}                     CNIC: ${escapeHtml(v.tenantCnic)}

Witness 1: ___________________              Witness 2: ___________________
CNIC: ________________________              CNIC: ________________________
`.trim(),
    generateHtml: (v) => `
<div style="font-family: 'Times New Roman', serif; color: #1e293b; max-width: 720px; margin: auto; padding: 28px; border: 1px solid #cbd5e1; line-height: 1.6;">
  <div style="text-align: center; border-bottom: 2px double #334155; padding-bottom: 12px; margin-bottom: 20px;">
    <h2 style="margin: 0; text-transform: uppercase; font-size: 20px; letter-spacing: 1px;">TENANCY AGREEMENT (کرایہ نامہ)</h2>
    <p style="margin: 4px 0 0; font-size: 13px; color: #64748b;">Governed under the Urban Rent Restriction Ordinance</p>
  </div>

  <p style="font-size: 13px;">This Agreement of Tenancy is executed on <strong>${escapeHtml(v.startDate)}</strong> by and between:</p>

  <div style="background: #f8fafc; padding: 12px; border-left: 3px solid #1e3a8a; margin-bottom: 12px; font-size: 13px;">
    <strong>1. LANDLORD (FIRST PARTY):</strong><br />
    Name: <strong>${escapeHtml(v.landlordName)}</strong> | CNIC: <strong>${escapeHtml(v.landlordCnic)}</strong>
  </div>

  <div style="background: #f8fafc; padding: 12px; border-left: 3px solid #0284c7; margin-bottom: 16px; font-size: 13px;">
    <strong>2. TENANT (SECOND PARTY):</strong><br />
    Name: <strong>${escapeHtml(v.tenantName)}</strong> | CNIC: <strong>${escapeHtml(v.tenantCnic)}</strong>
  </div>

  <p style="font-size: 13px;">
    <strong>Premises Location:</strong> The Landlord hereby lets out premises situated at <strong>${escapeHtml(v.propertyAddress)}</strong>.
  </p>

  <ol style="font-size: 13px; padding-left: 20px;">
    <li style="margin-bottom: 6px;"><strong>Duration:</strong> The tenancy period is fixed for <strong>${escapeHtml(v.tenancyDuration)}</strong> starting <strong>${escapeHtml(v.startDate)}</strong>.</li>
    <li style="margin-bottom: 6px;"><strong>Monthly Rent:</strong> The monthly rent is agreed at <strong>Rs. ${escapeHtml(v.monthlyRent)} /-</strong> payable before 5th of each month.</li>
    <li style="margin-bottom: 6px;"><strong>Security Deposit:</strong> The tenant deposited a refundable security sum of <strong>Rs. ${escapeHtml(v.securityDeposit)} /-</strong>.</li>
    <li style="margin-bottom: 6px;"><strong>Utilities:</strong> Tenant is responsible for clearing all electricity, gas, water, and internet bills promptly.</li>
    <li style="margin-bottom: 6px;"><strong>Notice Period:</strong> One month notice in writing is mandatory for vacation by either party.</li>
  </ol>

  <div style="display: flex; justify-content: space-between; margin-top: 36px; padding-top: 16px;">
    <div>
      <p style="margin: 0; border-top: 1px solid #475569; width: 180px; text-align: center; font-size: 12px; padding-top: 4px;">
        <strong>First Party (Landlord)</strong><br />${escapeHtml(v.landlordName)}
      </p>
    </div>
    <div>
      <p style="margin: 0; border-top: 1px solid #475569; width: 180px; text-align: center; font-size: 12px; padding-top: 4px;">
        <strong>Second Party (Tenant)</strong><br />${escapeHtml(v.tenantName)}
      </p>
    </div>
  </div>
</div>
`
  },
  {
    id: 'general-affidavit',
    title: 'General Stamp Paper Affidavit / Declaration',
    category: 'Legal',
    badge: 'Stamp Paper',
    formats: ['DOCX', 'PDF', 'PRINT'],
    description: 'Court-ready affidavit format for lost documents, name verification, address proof, or general oath statements.',
    tags: ['Affidavit', 'Bayan-e-Halfi', 'Oath', 'Stamp Paper', 'Notary Public', 'Court Declaration'],
    downloadsCount: 16400,
    fields: [
      { key: 'deponentName', label: 'Deponent Name (Halfi Bayan-kuninda)', defaultValue: 'Muhammad Bilal Arshad' },
      { key: 'fatherName', label: 'Father / Guardian Name', defaultValue: 'Arshad Mehmood' },
      { key: 'deponentCnic', label: 'Deponent CNIC', defaultValue: '35202-9876543-1' },
      { key: 'deponentAddress', label: 'Permanent Address', defaultValue: 'Flat 12, Block C, Garden Town, Lahore' },
      { key: 'subject', label: 'Subject / Purpose of Affidavit', defaultValue: 'Affidavit for Verification of Lost Educational Certificates' },
      { key: 'statementPoint1', label: 'Statement 1', defaultValue: 'That I am a lawful citizen of Pakistan and fully competent to swear this affidavit.' },
      { key: 'statementPoint2', label: 'Statement 2', defaultValue: 'That my original Matriculation certificate bearing Roll No. 441029 has been lost during transit.' },
      { key: 'statementPoint3', label: 'Statement 3', defaultValue: 'That the same has not been misused anywhere, and whatever stated above is true and correct.' }
    ],
    generateText: (v) => `
BEFORE THE NOTARY PUBLIC / OATH COMMISSIONER
AFFIDAVIT (بیانِ حلفی)
----------------------------------------------------------------------
SUBJECT: ${escapeHtml(v.subject)}

I, ${escapeHtml(v.deponentName)}, Son/Daughter of ${escapeHtml(v.fatherName)},
Holding CNIC No: ${escapeHtml(v.deponentCnic)},
Resident of: ${escapeHtml(v.deponentAddress)},

Do solemnly affirm and declare on oath as under:

1. ${escapeHtml(v.statementPoint1)}
2. ${escapeHtml(v.statementPoint2)}
3. ${escapeHtml(v.statementPoint3)}

VERIFICATION:
Verified on oath this day at that the contents of the above affidavit are true and correct to the best of my knowledge and belief, and nothing has been concealed or falsely stated.

DEPONENT: _________________________
Name: ${escapeHtml(v.deponentName)}
CNIC: ${escapeHtml(v.deponentCnic)}
`.trim(),
    generateHtml: (v) => `
<div style="font-family: 'Times New Roman', serif; color: #1e293b; max-width: 700px; margin: auto; padding: 28px; border: 1px solid #94a3b8; line-height: 1.6;">
  <div style="text-align: center; margin-bottom: 24px;">
    <h3 style="margin: 0; font-size: 18px; text-transform: uppercase; text-decoration: underline;">AFFIDAVIT (بیانِ حلفی)</h3>
    <p style="margin: 4px 0 0; font-size: 13px; font-weight: bold; color: #475569;">BEFORE THE NOTARY PUBLIC / OATH COMMISSIONER</p>
  </div>

  <p style="font-size: 13px; margin-bottom: 12px;">
    I, <strong>${escapeHtml(v.deponentName)}</strong>, S/o <strong>${escapeHtml(v.fatherName)}</strong>, CNIC No. <strong>${escapeHtml(v.deponentCnic)}</strong>, resident of <strong>${escapeHtml(v.deponentAddress)}</strong>, do hereby solemnly declare on oath as follows:
  </p>

  <ol style="font-size: 13px; padding-left: 20px; line-height: 1.8;">
    <li>${escapeHtml(v.statementPoint1)}</li>
    <li>${escapeHtml(v.statementPoint2)}</li>
    <li>${escapeHtml(v.statementPoint3)}</li>
  </ol>

  <div style="margin-top: 24px; padding: 12px; background: #f8fafc; border: 1px solid #e2e8f0; font-size: 12px;">
    <strong>VERIFICATION:</strong><br />
    Verified at the station on this date that the contents of this affidavit are true to the best of my knowledge and belief and nothing has been concealed therein.
  </div>

  <div style="margin-top: 36px; text-align: right;">
    <div style="display: inline-block; text-align: center; border-top: 1px solid #1e293b; width: 180px; padding-top: 6px;">
      <strong style="font-size: 13px;">DEPONENT</strong><br />
      <span style="font-size: 11px;">${escapeHtml(v.deponentName)}</span>
    </div>
  </div>
</div>
`
  },
  {
    id: 'nda-agreement',
    title: 'Standard Non-Disclosure Agreement (NDA)',
    category: 'Legal',
    badge: 'Pro Legal',
    formats: ['DOCX', 'PDF', 'PRINT'],
    description: 'Mutual non-disclosure contract protecting proprietary business ideas, source code, and client trade secrets.',
    tags: ['NDA', 'Confidentiality', 'Contract', 'Startup', 'Software', 'Intellectual Property'],
    downloadsCount: 13100,
    fields: [
      { key: 'disclosingParty', label: 'Disclosing Party Name', defaultValue: 'Innovate AI Labs Inc.' },
      { key: 'receivingParty', label: 'Receiving Party / Contractor Name', defaultValue: 'Hamza Khan Consultancy' },
      { key: 'effectiveDate', label: 'Effective Date', type: 'date', defaultValue: '2026-09-14' },
      { key: 'purpose', label: 'Purpose of Disclosure', defaultValue: 'Evaluating collaborative AI software architecture, source code review, and commercial partnership.' },
      { key: 'termYears', label: 'Non-Disclosure Period (Years)', defaultValue: '2 Years' }
    ],
    generateText: (v) => `
MUTUAL NON-DISCLOSURE AGREEMENT (NDA)
----------------------------------------------------------------------
This Non-Disclosure Agreement is entered into on ${escapeHtml(v.effectiveDate)} by:

PARTY A: ${escapeHtml(v.disclosingParty)}
AND
PARTY B: ${escapeHtml(v.receivingParty)}

1. PURPOSE: The parties wish to explore a business relationship regarding:
${escapeHtml(v.purpose)}

2. CONFIDENTIAL INFORMATION: Includes all technical data, trade secrets, software code, source files, and commercial specifications.
3. OBLIGATIONS: The Receiving Party agrees to hold all confidential info in strictest confidence and not disclose to third parties without prior written consent.
4. DURATION: These obligations shall remain in effect for a period of ${escapeHtml(v.termYears)} from the date of disclosure.

Signed by Authorized Representatives:
Party A: _________________________       Party B: _________________________
`.trim(),
    generateHtml: (v) => `
<div style="font-family: Arial, sans-serif; color: #1e293b; max-width: 700px; margin: auto; padding: 24px; border: 1px solid #cbd5e1; line-height: 1.6;">
  <h2 style="text-align: center; color: #0f172a; border-bottom: 2px solid #2563eb; padding-bottom: 8px;">NON-DISCLOSURE AGREEMENT (NDA)</h2>
  <p style="font-size: 13px;">This Agreement is entered into on <strong>${escapeHtml(v.effectiveDate)}</strong> between <strong>${escapeHtml(v.disclosingParty)}</strong> and <strong>${escapeHtml(v.receivingParty)}</strong>.</p>
  <p style="font-size: 13px;"><strong>Purpose:</strong> ${escapeHtml(v.purpose)}</p>
  <p style="font-size: 13px;"><strong>Term:</strong> The confidentiality terms shall bind both parties for <strong>${escapeHtml(v.termYears)}</strong>.</p>
  <div style="display: flex; justify-content: space-between; margin-top: 40px;">
    <div><strong>${escapeHtml(v.disclosingParty)}</strong><br />Sign: ___________________</div>
    <div><strong>${escapeHtml(v.receivingParty)}</strong><br />Sign: ___________________</div>
  </div>
</div>
`
  },

  // ================= CAREER =================
  {
    id: 'resignation-letter',
    title: 'Professional Resignation Letter (2-Week Notice)',
    category: 'Career',
    badge: 'Popular',
    formats: ['DOCX', 'PDF', 'PRINT'],
    description: 'Polite, standard formal resignation notice with gratitude, last working day notice, and handover commitment.',
    tags: ['Resignation', 'Job Exit', 'Notice Period', 'HR', 'Formal Letter', 'Corporate'],
    downloadsCount: 22000,
    popular: true,
    fields: [
      { key: 'employeeName', label: 'Your Name', defaultValue: 'Zainab Fatima' },
      { key: 'employeeDesignation', label: 'Your Designation', defaultValue: 'Senior Software Engineer' },
      { key: 'managerName', label: 'Reporting Manager / HR Head', defaultValue: 'Mr. Tariq Masood' },
      { key: 'companyName', label: 'Company Name', defaultValue: 'CloudSync Digital Technologies' },
      { key: 'currentDate', label: 'Today’s Date', type: 'date', defaultValue: '2026-09-14' },
      { key: 'lastWorkingDay', label: 'Proposed Last Working Day', type: 'date', defaultValue: '2026-09-28' },
      { key: 'reasonSummary', label: 'Reason / Next Step (Optional)', defaultValue: 'to pursue an exciting new career growth opportunity' }
    ],
    generateText: (v) => `
Date: ${escapeHtml(v.currentDate)}

To:
${escapeHtml(v.managerName)}
${escapeHtml(v.companyName)}

Subject: Resignation Letter - ${escapeHtml(v.employeeName)} (${escapeHtml(v.employeeDesignation)})

Dear ${escapeHtml(v.managerName)},

Please accept this letter as formal notification that I am resigning from my position as ${escapeHtml(v.employeeDesignation)} at ${escapeHtml(v.companyName)}. My last working day will be ${escapeHtml(v.lastWorkingDay)}, providing the standard two weeks' notice.

I have decided to take this step ${escapeHtml(v.reasonSummary)}. 

I am sincerely grateful for the opportunities, mentorship, and professional support extended to me during my tenure with ${escapeHtml(v.companyName)}. Working with the team has been an enriching experience that I will always value.

During my remaining notice period, I am fully committed to ensuring a smooth transition of my duties, documentation of ongoing projects, and handover to my colleagues.

I wish ${escapeHtml(v.companyName)} continued growth and success in all future endeavors.

Sincerely,

${escapeHtml(v.employeeName)}
${escapeHtml(v.employeeDesignation)}
`.trim(),
    generateHtml: (v) => `
<div style="font-family: Arial, sans-serif; color: #1e293b; max-width: 680px; margin: auto; padding: 28px; border: 1px solid #e2e8f0; line-height: 1.6;">
  <p style="margin: 0; color: #64748b; font-size: 13px;">Date: ${escapeHtml(v.currentDate)}</p>
  <div style="margin: 16px 0;">
    <strong style="font-size: 14px; color: #0f172a;">To:</strong><br />
    <span style="font-size: 14px;">${escapeHtml(v.managerName)}</span><br />
    <span style="font-size: 13px; color: #475569;">${escapeHtml(v.companyName)}</span>
  </div>

  <div style="background: #f1f5f9; padding: 10px 14px; border-left: 4px solid #2563eb; margin-bottom: 16px;">
    <strong style="color: #1e3a8a; font-size: 14px;">Subject: Resignation from the position of ${escapeHtml(v.employeeDesignation)}</strong>
  </div>

  <p style="font-size: 13px;">Dear ${escapeHtml(v.managerName)},</p>
  <p style="font-size: 13px;">
    Please accept this letter as formal notification that I am resigning from my position as <strong>${escapeHtml(v.employeeDesignation)}</strong> with <strong>${escapeHtml(v.companyName)}</strong>. In accordance with company policy, my last working day will be <strong>${escapeHtml(v.lastWorkingDay)}</strong>.
  </p>
  <p style="font-size: 13px;">
    I have decided to take this step ${escapeHtml(v.reasonSummary)}. I want to express my genuine appreciation for the guidance and opportunities I have received during my time with your organization.
  </p>
  <p style="font-size: 13px;">
    During the transition period, I will do everything possible to wrap up my responsibilities and train other team members to ensure minimal disruption.
  </p>

  <div style="margin-top: 32px;">
    <p style="margin: 0; font-size: 13px;">Yours sincerely,</p>
    <p style="margin: 18px 0 0; font-weight: bold; font-size: 15px; color: #0f172a;">${escapeHtml(v.employeeName)}</p>
    <p style="margin: 0; font-size: 13px; color: #64748b;">${escapeHtml(v.employeeDesignation)}</p>
  </div>
</div>
`
  },
  {
    id: 'leave-application',
    title: 'Formal Leave Application (Office / School / College)',
    category: 'Career',
    badge: '100% Free',
    formats: ['DOCX', 'PDF', 'PRINT'],
    description: 'Polite formal leave application suitable for sick leave, urgent personal affair, or exam preparation.',
    tags: ['Leave Application', 'Sick Leave', 'HR Request', 'School Leave', 'Urgent Piece of Work'],
    downloadsCount: 18700,
    fields: [
      { key: 'applicantName', label: 'Applicant Name', defaultValue: 'Shahmeer Ali' },
      { key: 'roleOrClass', label: 'Designation / Roll No.', defaultValue: 'Marketing Associate (ID: 9021)' },
      { key: 'authorityName', label: 'Addressed To (Principal / Manager)', defaultValue: 'The General Manager' },
      { key: 'orgName', label: 'Organization / Institution', defaultValue: 'Horizon Global Logistics' },
      { key: 'fromDate', label: 'Leave Start Date', type: 'date', defaultValue: '2026-09-18' },
      { key: 'toDate', label: 'Leave End Date', type: 'date', defaultValue: '2026-09-21' },
      { key: 'reason', label: 'Reason for Leave', defaultValue: 'due to sudden severe fever and medical rest advised by physician' }
    ],
    generateText: (v) => `
To:
${escapeHtml(v.authorityName)}
${escapeHtml(v.orgName)}

Subject: Application for Leave of Absence

Respected Sir/Madam,

Most respectfully, I wish to state that I am unable to attend my duties from ${escapeHtml(v.fromDate)} to ${escapeHtml(v.toDate)} ${escapeHtml(v.reason)}.

I request you to kindly grant me leave for the aforementioned dates. I will ensure that any urgent tasks are addressed upon my return.

Thanking you in anticipation.

Yours obediently,

${escapeHtml(v.applicantName)}
${escapeHtml(v.roleOrClass)}
Date: ${new Date().toISOString().split('T')[0]}
`.trim(),
    generateHtml: (v) => `
<div style="font-family: Arial, sans-serif; color: #1e293b; max-width: 650px; margin: auto; padding: 24px; border: 1px solid #e2e8f0; line-height: 1.6;">
  <p style="margin: 0; font-size: 13px;"><strong>To:</strong><br />${escapeHtml(v.authorityName)}<br />${escapeHtml(v.orgName)}</p>
  <h4 style="margin: 16px 0; color: #1e3a8a; border-bottom: 1px solid #cbd5e1; padding-bottom: 6px;">Subject: Application for Leave of Absence</h4>
  <p style="font-size: 13px;">Respected Sir/Madam,</p>
  <p style="font-size: 13px;">
    Most respectfully, I beg to submit that I cannot attend office from <strong>${escapeHtml(v.fromDate)}</strong> to <strong>${escapeHtml(v.toDate)}</strong> ${escapeHtml(v.reason)}.
  </p>
  <p style="font-size: 13px;">
    Kindly sanction my leave for the stated period. I will be deeply grateful.
  </p>
  <div style="margin-top: 30px;">
    <p style="margin: 0; font-size: 13px;">Yours obediently,</p>
    <p style="margin: 10px 0 0; font-weight: bold;">${escapeHtml(v.applicantName)}</p>
    <p style="margin: 0; font-size: 12px; color: #64748b;">${escapeHtml(v.roleOrClass)}</p>
  </div>
</div>
`
  },
  {
    id: 'experience-certificate',
    title: 'Work Experience & Relieving Certificate',
    category: 'Career',
    badge: 'HR Standard',
    formats: ['DOCX', 'PDF', 'PRINT'],
    description: 'Official corporate certificate verifying employee tenure, job performance, and character upon departure.',
    tags: ['Experience Letter', 'Relieving Letter', 'Service Certificate', 'HR Proof', 'Job Verification'],
    downloadsCount: 14800,
    fields: [
      { key: 'companyName', label: 'Company Name', defaultValue: 'Vertex Global Solutions Pvt. Ltd.' },
      { key: 'employeeName', label: 'Employee Full Name', defaultValue: 'Muhammad Asif Raza' },
      { key: 'fatherName', label: 'Father’s Name', defaultValue: 'Raza Muhammad' },
      { key: 'designation', label: 'Last Held Designation', defaultValue: 'Assistant Accounts Officer' },
      { key: 'startDate', label: 'Joining Date', type: 'date', defaultValue: '2023-01-15' },
      { key: 'endDate', label: 'Relieving Date', type: 'date', defaultValue: '2026-08-31' },
      { key: 'conductSummary', label: 'Conduct & Performance Note', defaultValue: 'sincere, hardworking, diligent and bore excellent moral character' }
    ],
    generateText: (v) => `
TO WHOM IT MAY CONCERN
EXPERIENCE & RELIEVING CERTIFICATE
----------------------------------------------------------------------
This is to certify that ${escapeHtml(v.employeeName)}, S/o ${escapeHtml(v.fatherName)}, was employed with ${escapeHtml(v.companyName)} from ${escapeHtml(v.startDate)} to ${escapeHtml(v.endDate)}.

During his tenure, he served as ${escapeHtml(v.designation)}.

Throughout his service with us, we found him to be ${escapeHtml(v.conductSummary)}. He has fulfilled all his obligations and has been formally relieved of all duties with no outstanding dues.

We wish him every success in all his future personal and professional endeavors.

For ${escapeHtml(v.companyName)}

_________________________
Head of Human Resources
`.trim(),
    generateHtml: (v) => `
<div style="font-family: Arial, sans-serif; color: #1e293b; max-width: 680px; margin: auto; padding: 32px; border: 2px solid #cbd5e1; border-radius: 8px;">
  <div style="text-align: center; border-bottom: 2px solid #0284c7; padding-bottom: 12px; margin-bottom: 20px;">
    <h2 style="margin: 0; color: #0369a1; font-size: 22px; text-transform: uppercase;">${escapeHtml(v.companyName)}</h2>
    <p style="margin: 4px 0 0; font-size: 13px; color: #64748b; font-weight: 600;">CERTIFICATE OF WORK EXPERIENCE</p>
  </div>

  <div style="text-align: center; margin-bottom: 20px;">
    <span style="background: #f1f5f9; padding: 4px 16px; border-radius: 20px; font-size: 12px; font-weight: bold; letter-spacing: 1px;">TO WHOM IT MAY CONCERN</span>
  </div>

  <p style="font-size: 14px; line-height: 1.8; text-align: justify;">
    This is to certify that <strong>${escapeHtml(v.employeeName)}</strong>, S/o <strong>${escapeHtml(v.fatherName)}</strong>, has been an employee of <strong>${escapeHtml(v.companyName)}</strong> from <strong>${escapeHtml(v.startDate)}</strong> to <strong>${escapeHtml(v.endDate)}</strong>, holding the designation of <strong>${escapeHtml(v.designation)}</strong>.
  </p>

  <p style="font-size: 14px; line-height: 1.8; text-align: justify;">
    During his tenure with our organization, he demonstrated exemplary dedication and was found to be ${escapeHtml(v.conductSummary)}. All company assets and clearance formalities have been completed successfully.
  </p>

  <p style="font-size: 14px; line-height: 1.8;">
    We appreciate his contributions and wish him the very best in his future career.
  </p>

  <div style="margin-top: 40px; display: flex; justify-content: flex-end;">
    <div style="text-align: center; border-top: 1px solid #334155; width: 180px; padding-top: 6px;">
      <strong style="font-size: 13px;">Authorized Signatory</strong><br />
      <span style="font-size: 11px; color: #64748b;">Human Resources Division</span>
    </div>
  </div>
</div>
`
  },

  // ================= ACADEMIC =================
  {
    id: 'certificate-achievement',
    title: 'Certificate of Achievement & Completion',
    category: 'Academic',
    badge: 'Ornate Gold',
    formats: ['DOCX', 'PDF', 'PRINT'],
    description: 'Gold-bordered diploma certificate suitable for workshops, academic honors, IT bootcamps, and sports.',
    tags: ['Certificate', 'Award', 'Appreciation', 'Diploma', 'Course Completion', 'Gold Border'],
    downloadsCount: 17200,
    popular: true,
    fields: [
      { key: 'institutionName', label: 'Awarding Institution / Organization', defaultValue: 'Quaid Institute of Science & Technology' },
      { key: 'recipientName', label: 'Recipient Full Name', defaultValue: 'Ayesha Noor' },
      { key: 'courseTitle', label: 'Award Title / Course Name', defaultValue: 'Advanced Full-Stack Web Engineering & Cloud Architecture' },
      { key: 'gradeOrHonor', label: 'Honor / Grade (Optional)', defaultValue: 'with Grade A+ (Outstanding Performance)' },
      { key: 'awardDate', label: 'Date of Award', type: 'date', defaultValue: '2026-09-14' },
      { key: 'signatory1', label: 'Left Signatory (e.g. Program Director)', defaultValue: 'Prof. Dr. Tariq Aziz (Director)' },
      { key: 'signatory2', label: 'Right Signatory (e.g. Dean / Principal)', defaultValue: 'Engr. Nadeem Sheikh (Dean of Academics)' }
    ],
    generateText: (v) => `
CERTIFICATE OF ACHIEVEMENT
----------------------------------------------------------------------
${escapeHtml(v.institutionName)}

PROUDLY PRESENTED TO:
${escapeHtml(v.recipientName)}

In recognition of successfully completing the program:
"${escapeHtml(v.courseTitle)}"
${escapeHtml(v.gradeOrHonor)}

Awarded on: ${escapeHtml(v.awardDate)}

${escapeHtml(v.signatory1)}                                      ${escapeHtml(v.signatory2)}
Director                                             Dean
`.trim(),
    generateHtml: (v) => `
<div style="font-family: 'Georgia', serif; color: #1e293b; max-width: 760px; margin: auto; padding: 32px; border: 8px double #d97706; background: #fffbeb; text-align: center;">
  <p style="margin: 0; font-size: 14px; text-transform: uppercase; letter-spacing: 2px; color: #b45309; font-weight: bold;">
    ${escapeHtml(v.institutionName)}
  </p>
  <div style="margin: 16px 0 6px;">
    <span style="font-size: 28px; font-weight: bold; color: #78350f; text-transform: uppercase; letter-spacing: 1px;">CERTIFICATE OF ACHIEVEMENT</span>
  </div>
  <p style="margin: 0 0 16px; font-size: 13px; color: #92400e; font-style: italic;">This certificate is proudly awarded to</p>

  <h1 style="margin: 10px 0; font-size: 32px; color: #1e3a8a; font-family: 'Times New Roman', serif; text-decoration: underline;">
    ${escapeHtml(v.recipientName)}
  </h1>

  <p style="margin: 12px auto; max-width: 540px; font-size: 14px; line-height: 1.6; color: #451a03;">
    For successfully completing the rigorous curriculum and practical project milestones in <strong>${escapeHtml(v.courseTitle)}</strong>, demonstrating exceptional dedication ${escapeHtml(v.gradeOrHonor)}.
  </p>

  <p style="font-size: 12px; color: #78350f; margin-top: 16px;">Awarded on this day: <strong>${escapeHtml(v.awardDate)}</strong></p>

  <div style="display: flex; justify-content: space-between; margin-top: 40px; padding: 0 40px;">
    <div style="border-top: 1px solid #78350f; width: 180px; padding-top: 6px; font-size: 12px;">
      ${escapeHtml(v.signatory1)}
    </div>
    <div style="border-top: 1px solid #78350f; width: 180px; padding-top: 6px; font-size: 12px;">
      ${escapeHtml(v.signatory2)}
    </div>
  </div>
</div>
`
  },
  {
    id: 'assignment-cover',
    title: 'University Assignment & Thesis Front Page',
    category: 'Academic',
    badge: '100% Free',
    formats: ['DOCX', 'PDF', 'PRINT'],
    description: 'Clean university title page featuring course name, assignment topic, student ID, and instructor name.',
    tags: ['Assignment Cover', 'Thesis Title Page', 'University', 'College Project', 'Front Page'],
    downloadsCount: 13400,
    fields: [
      { key: 'universityName', label: 'University / Board Name', defaultValue: 'The Islamia University of Bahawalpur' },
      { key: 'departmentName', label: 'Department / Faculty', defaultValue: 'Department of Computer Science & IT' },
      { key: 'assignmentTitle', label: 'Assignment / Project Title', defaultValue: 'Design & Implementation of Distributed Microservice Systems' },
      { key: 'courseTitle', label: 'Course Name & Code', defaultValue: 'Advanced Software Architecture (CS-601)' },
      { key: 'submittedBy', label: 'Student Name & Roll No.', defaultValue: 'Muhammad Ansar (Roll No. MSCS-F24-102)' },
      { key: 'submittedTo', label: 'Submitted To (Professor Name)', defaultValue: 'Dr. Muhammad Kashif (Associate Professor)' },
      { key: 'submissionDate', label: 'Submission Date', type: 'date', defaultValue: '2026-09-14' }
    ],
    generateText: (v) => `
${escapeHtml(v.universityName)}
${escapeHtml(v.departmentName)}

ASSIGNMENT SUBMISSION
----------------------------------------------------------------------
TITLE:
"${escapeHtml(v.assignmentTitle)}"

COURSE:
${escapeHtml(v.courseTitle)}

SUBMITTED BY:
${escapeHtml(v.submittedBy)}

SUBMITTED TO:
${escapeHtml(v.submittedTo)}

DATE OF SUBMISSION:
${escapeHtml(v.submissionDate)}
`.trim(),
    generateHtml: (v) => `
<div style="font-family: Arial, sans-serif; color: #1e293b; max-width: 650px; margin: auto; padding: 40px 24px; border: 1px solid #cbd5e1; text-align: center;">
  <h2 style="margin: 0; color: #0f172a; font-size: 20px; text-transform: uppercase;">${escapeHtml(v.universityName)}</h2>
  <h4 style="margin: 6px 0 30px; color: #475569; font-size: 14px; font-weight: normal;">${escapeHtml(v.departmentName)}</h4>

  <div style="border-top: 2px solid #2563eb; border-bottom: 2px solid #2563eb; padding: 24px 10px; margin: 30px 0;">
    <span style="font-size: 12px; font-weight: bold; color: #2563eb; text-transform: uppercase;">Assignment Title</span>
    <h1 style="margin: 8px 0; font-size: 22px; color: #0f172a;">${escapeHtml(v.assignmentTitle)}</h1>
    <p style="margin: 4px 0 0; font-size: 13px; color: #475569;">Course: <strong>${escapeHtml(v.courseTitle)}</strong></p>
  </div>

  <div style="display: flex; justify-content: space-around; text-align: left; margin-top: 40px; font-size: 13px;">
    <div style="background: #f8fafc; padding: 14px 20px; border-radius: 6px; border: 1px solid #e2e8f0;">
      <span style="font-size: 11px; color: #64748b; text-transform: uppercase; font-weight: bold;">Submitted By:</span>
      <p style="margin: 4px 0 0; font-weight: bold; color: #0f172a;">${escapeHtml(v.submittedBy)}</p>
    </div>
    <div style="background: #f8fafc; padding: 14px 20px; border-radius: 6px; border: 1px solid #e2e8f0;">
      <span style="font-size: 11px; color: #64748b; text-transform: uppercase; font-weight: bold;">Submitted To:</span>
      <p style="margin: 4px 0 0; font-weight: bold; color: #0f172a;">${escapeHtml(v.submittedTo)}</p>
    </div>
  </div>

  <p style="margin-top: 40px; font-size: 12px; color: #64748b;">Date: ${escapeHtml(v.submissionDate)}</p>
</div>
`
  },

  // ================= MATRIMONIAL =================
  {
    id: 'shaadi-biodata-profile',
    title: 'Royal Matrimonial Shaadi Biodata Sheet',
    category: 'Matrimonial',
    badge: 'Royal Design',
    formats: ['DOCX', 'PDF', 'PRINT'],
    description: 'Elegant personal, family, and partner preference sheet formatted for marriage proposals.',
    tags: ['Biodata', 'Shaadi Profile', 'Rishta', 'Matrimonial', 'Family Details'],
    downloadsCount: 24500,
    popular: true,
    fields: [
      { key: 'fullName', label: 'Full Name', defaultValue: 'Engr. Daniyal Ahmed' },
      { key: 'dob', label: 'Date of Birth & Age', defaultValue: '14 Oct 1997 (29 Years)' },
      { key: 'height', label: 'Height & Complexion', defaultValue: '5 ft 10 in | Fair' },
      { key: 'education', label: 'Highest Education', defaultValue: 'BS Software Engineering (NUST Islamabad)' },
      { key: 'profession', label: 'Occupation & Income', defaultValue: 'Lead Software Architect at Tech Venture ($3500/mo)' },
      { key: 'religionCaste', label: 'Religion & Caste / Sect', defaultValue: 'Islam / Sunni (Ansari / Sheikh)' },
      { key: 'fatherInfo', label: 'Father Details', defaultValue: 'Haji Tariq Mehmood (Businessman - Textile Imports)' },
      { key: 'motherInfo', label: 'Mother Details', defaultValue: 'Homemaker' },
      { key: 'siblingsInfo', label: 'Siblings', defaultValue: '2 Brothers (1 Married, 1 Studying) & 1 Sister (Married)' },
      { key: 'partnerExpectations', label: 'Partner Preferences', defaultValue: 'Well-educated, family-oriented, practicing Muslimah with high moral values.' },
      { key: 'contactDetails', label: 'Contact Phone / Address', defaultValue: '+92 300 1234567 | DHA Phase 5, Lahore' }
    ],
    generateText: (v) => `
ROYAL MATRIMONIAL BIODATA (شادی بائیو ڈیٹا)
----------------------------------------------------------------------
PERSONAL DETAILS:
Name: ${escapeHtml(v.fullName)}
Date of Birth: ${escapeHtml(v.dob)}
Height / Complexion: ${escapeHtml(v.height)}
Religion / Caste: ${escapeHtml(v.religionCaste)}

EDUCATION & CAREER:
Qualification: ${escapeHtml(v.education)}
Occupation: ${escapeHtml(v.profession)}

FAMILY BACKGROUND:
Father: ${escapeHtml(v.fatherInfo)}
Mother: ${escapeHtml(v.motherInfo)}
Siblings: ${escapeHtml(v.siblingsInfo)}

PARTNER EXPECTATIONS:
${escapeHtml(v.partnerExpectations)}

CONTACT:
${escapeHtml(v.contactDetails)}
`.trim(),
    generateHtml: (v) => `
<div style="font-family: Arial, sans-serif; color: #1e293b; max-width: 680px; margin: auto; padding: 26px; border: 3px solid #be123c; border-radius: 12px; background: #fff1f2;">
  <div style="text-align: center; border-bottom: 2px solid #e11d48; padding-bottom: 10px; margin-bottom: 16px;">
    <p style="margin: 0; font-family: serif; color: #9f1239; font-size: 16px;">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
    <h2 style="margin: 4px 0 0; color: #881337; font-size: 22px; font-family: serif;">MATRIMONIAL BIODATA</h2>
  </div>

  <div style="background: #ffffff; padding: 14px; border-radius: 8px; border: 1px solid #fecdd3; margin-bottom: 12px;">
    <h4 style="margin: 0 0 8px; color: #be123c; font-size: 13px; text-transform: uppercase;">1. Personal Information</h4>
    <table style="width: 100%; font-size: 13px; line-height: 1.8;">
      <tr><td style="width: 35%; color: #64748b;">Full Name:</td><td><strong>${escapeHtml(v.fullName)}</strong></td></tr>
      <tr><td style="color: #64748b;">Date of Birth & Age:</td><td>${escapeHtml(v.dob)}</td></tr>
      <tr><td style="color: #64748b;">Height & Complexion:</td><td>${escapeHtml(v.height)}</td></tr>
      <tr><td style="color: #64748b;">Religion & Sect:</td><td>${escapeHtml(v.religionCaste)}</td></tr>
    </table>
  </div>

  <div style="background: #ffffff; padding: 14px; border-radius: 8px; border: 1px solid #fecdd3; margin-bottom: 12px;">
    <h4 style="margin: 0 0 8px; color: #be123c; font-size: 13px; text-transform: uppercase;">2. Education & Profession</h4>
    <table style="width: 100%; font-size: 13px; line-height: 1.8;">
      <tr><td style="width: 35%; color: #64748b;">Highest Qualification:</td><td><strong>${escapeHtml(v.education)}</strong></td></tr>
      <tr><td style="color: #64748b;">Current Profession:</td><td>${escapeHtml(v.profession)}</td></tr>
    </table>
  </div>

  <div style="background: #ffffff; padding: 14px; border-radius: 8px; border: 1px solid #fecdd3; margin-bottom: 12px;">
    <h4 style="margin: 0 0 8px; color: #be123c; font-size: 13px; text-transform: uppercase;">3. Family Background</h4>
    <p style="margin: 3px 0; font-size: 13px;"><strong>Father:</strong> ${escapeHtml(v.fatherInfo)}</p>
    <p style="margin: 3px 0; font-size: 13px;"><strong>Mother:</strong> ${escapeHtml(v.motherInfo)}</p>
    <p style="margin: 3px 0; font-size: 13px;"><strong>Siblings:</strong> ${escapeHtml(v.siblingsInfo)}</p>
  </div>

  <div style="background: #ffffff; padding: 14px; border-radius: 8px; border: 1px solid #fecdd3; font-size: 13px;">
    <h4 style="margin: 0 0 6px; color: #be123c; font-size: 13px; text-transform: uppercase;">4. Preferences & Contact</h4>
    <p style="margin: 0 0 6px;"><strong>Expectations:</strong> ${escapeHtml(v.partnerExpectations)}</p>
    <p style="margin: 0; color: #881337;"><strong>Contact:</strong> ${escapeHtml(v.contactDetails)}</p>
  </div>
</div>
`
  }
];
