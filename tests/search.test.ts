import { describe, expect, it } from 'vitest';
import { searchPatient, searchAcademy, expandQuery } from '@/lib/search';

const top = (q: string, n = 3) => searchPatient(q, n).map((r) => r.doc.id);

describe('patient search', () => {
  it('maps synonyms: hot flashes ↔ VMS', () => {
    expect(expandQuery('vms treatment').some((v) => v.includes('hot flash'))).toBe(true);
    expect(top('hot flashes')).toEqual(expect.arrayContaining(['hot-flashes']));
  });
  it('maps synonyms: HRT → hormone therapy', () => {
    const ids = top('is hrt safe', 5);
    expect(ids).toContain('q-is-ht-safe');
  });
  it('maps synonyms: vaginal atrophy → GSM topic', () => {
    expect(top('vaginal atrophy', 5)).toEqual(expect.arrayContaining(['vaginal-urinary']));
  });
  it('maps synonyms: bone density → DXA FAQ', () => {
    expect(top('bone density', 5)).toContain('q-bone-scan');
  });
  it('tolerates typos', () => {
    expect(top('menapause bleding', 5)).toContain('q-bleeding-after-menopause');
  });
  it('returns nothing (rather than guessing) for unrelated queries', () => {
    expect(searchPatient('quantum chromodynamics lattice', 5)).toHaveLength(0);
  });
});

describe('academy search', () => {
  it('finds drug-specific facts', () => {
    const ids = searchAcademy('denosumab', 5).map((r) => r.doc.id);
    expect(ids).toContain('f-denosumab');
  });
  it('finds modules by abbreviation', () => {
    const ids = searchAcademy('STRAW', 5).map((r) => r.doc.id);
    expect(ids).toContain('m1');
  });
});
