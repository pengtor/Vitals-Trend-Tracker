// LOINC codes
export const LOINC_CODES = {
  A1C: '4548-4',
  GLUCOSE: '2339-0',
};

export const REFERENCE_RANGES = {
  A1C: { low: 0, high: 5.7 },       // >= 5.7% flagged
  GLUCOSE: { low: 70, high: 99 },   // outside 70-99 mg/dL flagged
};

export async function fetchLabObservations(client, patientId) {
  const codes = `${LOINC_CODES.A1C},${LOINC_CODES.GLUCOSE}`;

  const bundle = await client.request(
    `Observation?patient=${patientId}&code=${codes}&_sort=-date`
  );
    return bundle;
}

export function parseObs(bundle) {
    const entries = bundle.entry || [];
    console.log('entries found: ', entries.length);
    const parsed = entries.map(entry => {
        const obs = entry.resource;
        const code = obs.code.coding[0].code;
        const date = obs.effectiveDateTime;
        const num = obs.valueQuantity.value;
        const unit = obs.valueQuantity.unit;

        let type;
        if (code === LOINC_CODES.A1C) {
            type = 'A1C';
        } else if (code === LOINC_CODES.GLUCOSE) {
            type = 'GLUCOSE';
        }
        return { type, num, date, unit };
    });
    console.log('first parsed(raw) item: ', parsed[0]);
    return parsed.sort((a, b) => new Date (a.date) - new Date (b.date));
}


