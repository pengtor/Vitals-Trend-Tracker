// LOINC codes
export const LOINC_CODES = {
  A1C: '4548-4',
  GLUCOSE: '2339-0',
};

export async function fetchLabObservations(client, patientId) {
  const codes = `${LOINC_CODES.A1C},${LOINC_CODES.GLUCOSE}`;

  const bundle = await client.request(
    `Observation?patient=${patientId}&code=${codes}&_sort=-date`
  );
    return bundle;
}
