import type { BasisdatenInputs, BasisdatenResults } from '../data/types';

export function calcBasisdaten(inputs: BasisdatenInputs): BasisdatenResults {
  const { anzahlMitarbeiterVZAE: ma, behandlungenProTagProMA: bpd, arbeitstageProMonat: apt,
    satzGkvDurchschnitt: gkv, satzPkvDurchschnitt: pkv, anteilPkv, ausfallquote } = inputs;

  if (ma <= 0 || bpd <= 0 || apt <= 0) {
    return { behandlungenProMonat: 0, effektiveBehandlungen: 0, umsatzProBehandlungGewichtet: 0, umsatzProMAProMonat: 0, gesamtumsatzMonat: 0, gesamtumsatzJahr: 0 };
  }

  const behandlungenProMonat = ma * bpd * apt;
  const effektiveBehandlungen = behandlungenProMonat * (1 - ausfallquote);
  const gkvBeh = effektiveBehandlungen * (1 - anteilPkv);
  const pkvBeh = effektiveBehandlungen * anteilPkv;
  const gesamtumsatzMonat = gkvBeh * gkv + pkvBeh * pkv;
  const umsatzProBehandlungGewichtet = effektiveBehandlungen > 0 ? gesamtumsatzMonat / effektiveBehandlungen : 0;
  const umsatzProMAProMonat = ma > 0 ? gesamtumsatzMonat / ma : 0;

  return {
    behandlungenProMonat,
    effektiveBehandlungen,
    umsatzProBehandlungGewichtet,
    umsatzProMAProMonat,
    gesamtumsatzMonat,
    gesamtumsatzJahr: gesamtumsatzMonat * 12,
  };
}
