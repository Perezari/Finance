/* Tests for the extraction heuristics. Run: npm test

   The payloads below are synthetic — we do not know the bank's real response
   shape. That is exactly the point: each test is a *different* plausible shape,
   including deliberately hostile ones with meaningless field names, and the
   extractor has to find the right number in all of them. Every payload is
   salted with decoys (account numbers, dates, ids) that sit in the same
   numeric range as a mortgage balance. */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { extractMortgage, extractFromText, toNumber, redact } from './extract.mjs';

const ANCHOR = 827934; // last month, from monthly_records
const TOTAL = 825260.14; // this month: 310,120.00 + 295,040.14 + 220,100.00

test('toNumber handles the formats banks actually send', () => {
  assert.equal(toNumber('827,934.00'), 827934);
  assert.equal(toNumber('₪ 825,260.14'), 825260.14);
  assert.equal(toNumber(825260.14), 825260.14);
  assert.equal(toNumber('לא צמוד'), null);
  assert.equal(toNumber('2041-06-01'), null);
  assert.equal(toNumber(null), null);
});

test('descriptive English keys — the easy case', () => {
  const captures = [
    {
      url: 'https://mto.example.co.il/api/mortgage/details',
      json: {
        header: { accountNumber: 123456789, branchId: 456, asOfDate: 20260910 },
        mortgage: {
          payoffAmount: '825,260.14',
          originalAmount: 1200000,
          loans: [
            { loanId: 1001, maslulName: 'פריים', currentBalance: '310,120.00', interestRate: 5.75, linkage: 'לא צמוד', monthlyPayment: 1820.5, lastPaymentDate: '2041-06-01' },
            { loanId: 1002, maslulName: 'ריבית קבועה לא צמודה (קל"צ)', currentBalance: '295,040.14', interestRate: 4.1, linkage: 'לא צמוד', monthlyPayment: 1610.2, lastPaymentDate: '2044-02-01' },
            { loanId: 1003, maslulName: 'ריבית משתנה צמודה', currentBalance: '220,100.00', interestRate: 3.2, linkage: 'צמוד מדד', monthlyPayment: 1240.9, lastPaymentDate: '2046-09-01' },
          ],
        },
      },
    },
  ];

  const r = extractMortgage(captures, { anchor: ANCHOR });
  assert.equal(r.balance, TOTAL);
  assert.equal(r.confidence, 'high');
  assert.equal(r.sumMatches, true);
  assert.equal(r.routes.length, 3);
  assert.equal(r.routes[0].name, 'פריים');
  assert.equal(r.routes[0].balance, 310120);
  assert.equal(r.routes[0].rate, 5.75);
  assert.equal(r.routes[0].linkage, 'לא צמוד');
  assert.equal(r.routes[0].monthly_payment, 1820.5);
  assert.equal(r.routes[0].end_date, '2041-06-01');
});

test('agorot integers are rescaled', () => {
  const captures = [
    {
      url: 'https://mto.example.co.il/api/loans',
      json: {
        mortgageDetails: {
          totalPayoff: 82526014,
          tracks: [
            { trackDesc: 'פריים', balanceAgorot: 31012000, ribitPercent: 5.75 },
            { trackDesc: 'קבועה לא צמודה', balanceAgorot: 29504014, ribitPercent: 4.1 },
            { trackDesc: 'משתנה צמודה', balanceAgorot: 22010000, ribitPercent: 3.2 },
          ],
        },
      },
    },
  ];

  const r = extractMortgage(captures, { anchor: ANCHOR });
  assert.equal(r.balance, TOTAL);
  assert.equal(r.sumMatches, true);
  assert.equal(r.routes.length, 3);
  assert.equal(r.routes[0].balance, 310120);
  assert.equal(r.routes[0].rate, 5.75);
});

test('meaningless field names — anchor + route sum still nail it', () => {
  const captures = [
    {
      url: 'https://mto.example.co.il/rt/q?x=88',
      json: {
        d: {
          f1: 825260.14,
          f2: 1200000, // original loan amount, a plausible-looking decoy
          f3: 20260910, // date
          items: [
            { a: 'פריים', b: 310120.0, c: 5.75 },
            { a: 'קבועה לא צמודה', b: 295040.14, c: 4.1 },
            { a: 'משתנה צמודה', b: 220100.0, c: 3.2 },
          ],
        },
      },
    },
  ];

  const r = extractMortgage(captures, { anchor: ANCHOR });
  assert.equal(r.balance, TOTAL);
  assert.equal(r.confidence, 'high');
  assert.equal(r.sumMatches, true);
  assert.equal(r.routes.length, 3);
  assert.equal(r.routes[0].name, 'פריים');
  assert.equal(r.routes[0].balance, 310120);
});

test('decoys near the anchor do not beat a properly named field', () => {
  const captures = [
    {
      url: 'https://mto.example.co.il/api/x',
      json: {
        customerId: 827930, // 4 ₪ from the anchor, but it is an id
        lastStatementDate: 20260810,
        mortgage: { payoffAmount: 825260.14 },
      },
    },
  ];
  const r = extractMortgage(captures, { anchor: ANCHOR });
  assert.equal(r.balance, TOTAL);
});

test('first run, no anchor — falls back to key names', () => {
  const captures = [
    {
      url: 'https://mto.example.co.il/api/mortgage/details',
      json: {
        mortgage: {
          payoffAmount: 825260.14,
          originalAmount: 1200000,
          loans: [
            { maslulName: 'פריים', currentBalance: 310120.0, interestRate: 5.75 },
            { maslulName: 'קבועה', currentBalance: 295040.14, interestRate: 4.1 },
            { maslulName: 'משתנה', currentBalance: 220100.0, interestRate: 3.2 },
          ],
        },
      },
    },
  ];
  const r = extractMortgage(captures, { anchor: null });
  assert.equal(r.balance, TOTAL);
  assert.equal(r.sumMatches, true);
});

test('DOM text fallback when nothing useful came back as JSON', () => {
  const pageText = [
    'פרטי המשכנתא שלי',
    'מספר חשבון 123-456789',
    'יתרה לסילוק   825,260.14 ₪',
    'מסלול פריים 310,120.00',
  ].join('\n');

  const r = extractMortgage([], { anchor: ANCHOR, pageText });
  assert.equal(r.balance, TOTAL);
  assert.equal(r.balanceSource.url, 'dom:text');
});

test('extractFromText ignores numbers far from the anchor', () => {
  const hit = extractFromText('יתרת המשכנתא 825,260.14', { anchor: ANCHOR });
  assert.equal(hit.value, TOTAL);
  assert.equal(extractFromText('סתם טקסט בלי מספרים', { anchor: ANCHOR }), null);
});

test('nothing found is reported as nothing, not as a wrong guess', () => {
  const r = extractMortgage([{ url: 'u', json: { greeting: 'shalom', ok: true } }], { anchor: ANCHOR });
  assert.equal(r.balance, null);
  assert.equal(r.confidence, 'low');
});

/* ── Mizrahi /api/mashkanta/profile ───────────────────
   Real field names and structure, invented amounts. The trap this guards
   against: sachItraLeSiluk is a well-named field sitting close to the anchor,
   but it is principal + accrued interest, so tracking it makes the mortgage
   look like it grows every month. Budgy tracks the principal. */

const MIZRAHI_PROFILE = {
  taarihNehonut: '2026-08-31T00:00Z',
  sachItraLeSiluk: 601500,
  sachItraAmlotLeSiluk: 5000,
  sachItraPigur: 0,
  isTefahotUser: true,
  ribitPrime: 5,
  mashkantaot: [
    {
      id: 111111111,
      schum: 400000,
      itraLeSiluk: 100250,
      itraAmlotSiluk: 0,
      maslulim: [
        /* repaid routes stay in the response with zeroed balances */
        { misparMaslul: 3, shemMaslul: 'פריים, לא צמוד', itratKrnSiluk: 0, itraLesiluk: 0, ahuzRbtHiuv: 0, teurSugHatzmada: 'לא צמוד' },
        { misparMaslul: 4, shemMaslul: 'משתנה, צמוד מדד', itratKrnSiluk: 0, itraLesiluk: 0, ahuzRbtHiuv: 0, teurSugHatzmada: 'צמוד מדד' },
        {
          misparMaslul: 7, shemMaslul: 'קבועה, לא צמוד', itratKrnSiluk: 100000, itraLesiluk: 100250,
          ahuzRbtHiuv: 3.78, teurSugHatzmada: 'לא צמוד', teurSugRbt: 'קבועה',
          schumEhzerAba: 1176.58, taarihHiuvAharon: '2041-06-10T00:00Z', sachAmlot: 0,
        },
      ],
    },
    {
      id: 222222222,
      schum: 500000,
      itraLeSiluk: 501250,
      itraAmlotSiluk: 5000,
      maslulim: [
        {
          misparMaslul: 5, shemMaslul: 'פריים, לא צמוד', itratKrnSiluk: 200000, itraLesiluk: 200500,
          ahuzRbtHiuv: 4.3, teurSugHatzmada: 'לא צמוד', teurSugRbt: 'פריים',
          schumEhzerAba: 1610.2, taarihHiuvAharon: '2044-02-10T00:00Z', sachAmlot: 0,
        },
        {
          misparMaslul: 7, shemMaslul: 'קבועה, לא צמוד', itratKrnSiluk: 300000, itraLesiluk: 300750,
          ahuzRbtHiuv: 4.92, teurSugHatzmada: 'לא צמוד', teurSugRbt: 'קבועה',
          schumEhzerAba: 2792.19, taarihHiuvAharon: '2046-09-10T00:00Z', sachAmlot: 5000,
        },
      ],
    },
  ],
};

test('mizrahi profile: reports principal, not principal + accrued interest', () => {
  const r = extractMortgage([{ url: 'https://mto.mizrahi-tefahot.co.il/Online/api/mashkanta/profile', json: MIZRAHI_PROFILE }], { anchor: 600000 });

  assert.equal(r.balance, 600000);        // Σ itratKrnSiluk
  assert.notEqual(r.balance, 601500);     // NOT sachItraLeSiluk
  assert.equal(r.payoff, 601500);
  assert.equal(r.fees, 5000);
  assert.equal(r.confidence, 'high');
  assert.equal(r.balanceSource.shape, 'mizrahi.profile');
});

test('mizrahi profile: repaid routes are dropped, live ones fully mapped', () => {
  const r = extractMortgage([{ url: 'u', json: MIZRAHI_PROFILE }], { anchor: 600000 });

  assert.equal(r.routes.length, 3); // 5 in the payload, 2 already repaid
  assert.deepEqual(r.routes.map((x) => x.balance), [100000, 200000, 300000]);
  assert.deepEqual(r.routes.map((x) => x.rate), [3.78, 4.3, 4.92]);
  assert.equal(r.routes[0].name, 'קבועה, לא צמוד');
  assert.equal(r.routes[1].linkage, 'לא צמוד');
  assert.equal(r.routes[1].monthly_payment, 1610.2);
  assert.equal(r.routes[2].end_date, '2046-09-10');
  assert.equal(r.routes[0].file_id, 111111111);
  assert.equal(r.routes[2].fees, 5000);
});

test('mizrahi profile: a payload of a different shape falls back to heuristics', () => {
  const r = extractMortgage(
    [{ url: 'u', json: { mortgage: { payoffAmount: 600000 } } }],
    { anchor: 600000 },
  );
  assert.equal(r.balance, 600000);
  assert.equal(r.balanceSource.shape, undefined); // heuristic path, not a known shape
});

test('redact strips anything credential-shaped before we persist it', () => {
  const out = redact({
    accessToken: 'eyJhb...',
    data: { password: 'hunter2', sessionId: 'abc', balance: 825260.14, nested: [{ authorization: 'Bearer x', v: 1 }] },
  });
  assert.equal(out.accessToken, '[redacted]');
  assert.equal(out.data.password, '[redacted]');
  assert.equal(out.data.sessionId, '[redacted]');
  assert.equal(out.data.balance, 825260.14);
  assert.equal(out.data.nested[0].authorization, '[redacted]');
  assert.equal(out.data.nested[0].v, 1);
});
