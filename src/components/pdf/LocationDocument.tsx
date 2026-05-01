import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { ContactDTO } from "@/dto/contact.dto";
import type { LocationDTO } from "@/dto/location.dto";

const GREEN = "#1D9E75";
const DARK = "#1a1a1a";
const MUTED = "#555";

const styles = StyleSheet.create({
  page: { padding: 50, fontFamily: "Helvetica", fontSize: 10, color: DARK, lineHeight: 1.5 },

  // Header
  title: { fontSize: 16, fontFamily: "Helvetica-Bold", textAlign: "center", marginBottom: 20, textTransform: "uppercase", letterSpacing: 1 },

  // Blocks
  section: { marginBottom: 12 },
  sectionTitle: { fontSize: 10, fontFamily: "Helvetica-Bold", textDecoration: "underline", marginBottom: 6, textTransform: "uppercase" },

  // Inline row: label + value
  row: { flexDirection: "row", flexWrap: "wrap", marginBottom: 3 },
  label: { color: MUTED },
  value: { fontFamily: "Helvetica-Bold" },

  // Two-column layout
  twoCol: { flexDirection: "row", gap: 20 },
  col: { flex: 1 },

  // Separator
  divider: { borderBottomWidth: 0.5, borderBottomColor: "#ccc", marginVertical: 10 },

  // Signature block
  sigBlock: { flexDirection: "row", marginTop: 30, gap: 20 },
  sigBox: { flex: 1, borderWidth: 0.5, borderColor: "#aaa", borderRadius: 4, padding: 10, minHeight: 80 },
  sigLabel: { fontSize: 9, fontFamily: "Helvetica-Bold", marginBottom: 4 },
  sigSub: { fontSize: 8, color: MUTED, marginBottom: 20 },

  // Footer
  footer: { position: "absolute", bottom: 30, left: 50, right: 50, fontSize: 8, color: "#aaa", textAlign: "center", borderTopWidth: 0.5, borderTopColor: "#ddd", paddingTop: 4 },

  // Conditions générales — page paysage
  cgPage: { padding: "30 40", fontFamily: "Helvetica", fontSize: 7.5, color: DARK, lineHeight: 1.5 },
  cgTitle: { fontSize: 11, fontFamily: "Helvetica-Bold", textAlign: "center", marginBottom: 10, textTransform: "uppercase", letterSpacing: 1 },
  cgColumns: { flexDirection: "row", gap: 0, flex: 1 },
  cgCol: { flex: 1, paddingHorizontal: 12 },
  cgSep: { width: 0.5, backgroundColor: "#ccc" },
  cgSection: { marginBottom: 8 },
  cgSectionTitle: { fontFamily: "Helvetica-Bold", fontSize: 7.5, marginBottom: 3, textDecoration: "underline" },
  cgText: { fontSize: 7.5, color: "#333", lineHeight: 1.6, textAlign: "justify" },
  cgBullet: { fontSize: 7.5, color: "#333", lineHeight: 1.6, marginLeft: 8 },
});

function fmt(d: string | Date) {
  return new Date(d).toLocaleDateString("fr-FR");
}

function nuits(a: string | Date, b: string | Date) {
  const da = new Date(a);
  const db = new Date(b);
  return Math.max(0, Math.round((db.getTime() - da.getTime()) / 86400000));
}

type Props = { contact: ContactDTO; location: LocationDTO };

function Field({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label} : </Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

function Divider() {
  return <View style={styles.divider} />;
}

export function LocationDocument({ contact, location }: Props) {
  const n = nuits(location.dateArrivee, location.depart);
  const prixBase = parseFloat(String(location.prixBase)) || 0;
  const taxeParNuit = parseFloat(String(location.taxeParNuit)) || 0;
  const frais = parseFloat(String(location.frais)) || 0;
  const acompte = parseFloat(String(location.acompte)) || 0;
  const caution = parseFloat(String(location.caution)) || 0;
  const taxeTotale = taxeParNuit * location.adultes * n;
  const prixTotal = prixBase + frais + taxeTotale;
  const solde = prixTotal - acompte;
  const today = new Date().toLocaleDateString("fr-FR");
  const m = (v: number) => v.toFixed(2);

  return (
    <Document>
      {/* ── PAGE 1 : CONTRAT ── */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Contrat de location</Text>

        {/* Propriétaire */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Entre le propriétaire :</Text>
          <Text style={{ fontFamily: "Helvetica-Bold" }}>BRODER Emeline</Text>
          <Text>10 rue du gros noyer</Text>
          <Text>77220 Tournan en Brie</Text>
          <Text>0633203004</Text>
          <Text>emeline.broder@gmail.com</Text>
        </View>

        <Divider />

        {/* Locataire */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Et le locataire :</Text>
          <View style={styles.twoCol}>
            <View style={styles.col}>
              <Field label="Nom" value={contact.nom} />
              <Field label="Prénom" value={contact.prenom} />
              <Field label="Adresse" value={contact.adresse ?? "—"} />
            </View>
            <View style={styles.col}>
              <Field label="E-mail" value={contact.email ?? "—"} />
              <Field label="Téléphone" value={contact.telephone ?? "—"} />
            </View>
          </View>
        </View>

        <Divider />

        {/* Occupants */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nombre de personnes dans le logement :</Text>
          <View style={{ flexDirection: "row", gap: 30 }}>
            <Field label="Adulte(s)" value={String(location.adultes)} />
            <Field label="Enfant(s)" value={String(location.enfants)} />
            <Field label="Animal" value={String(location.animaux)} />
          </View>
        </View>

        <Divider />

        {/* Séjour */}
        <View style={styles.section}>
          <Text style={{ marginBottom: 4 }}>
            Il est convenu d'une location saisonnière pour la période :
          </Text>
          <View style={{ flexDirection: "row", gap: 10 }}>
            <Text style={styles.label}>du </Text>
            <Text style={styles.value}>{fmt(location.dateArrivee)}</Text>
            <Text style={styles.label}> au </Text>
            <Text style={styles.value}>{fmt(location.depart)}</Text>
          </View>
          <Text style={{ marginTop: 4 }}>
            À l'adresse suivante : <Text style={styles.value}>1659 Promenade Marie Paradis 74400 Chamonix-Mont-Blanc</Text>
          </Text>
        </View>

        <Divider />

        {/* Tarifs */}
        <View style={styles.section}>
          <Field label="Prix du séjour" value={`${m(prixBase)} euros`} />
          <Field label="Frais de ménage/blanchisserie" value={`${m(frais)} euros`} />
          <Field label="Taxe de séjour" value={`${m(taxeTotale)} euros pour la durée du séjour`} />
          <View style={{ marginTop: 4 }}>
            <Field label="Prix total du séjour" value={`${m(prixTotal)} euros`} />
          </View>
        </View>

        <Divider />

        {/* Caution & acompte */}
        <View style={styles.section}>
          <Text style={{ marginBottom: 4 }}>
            Un dépôt de garantie de <Text style={styles.value}>{m(caution)} euros</Text> devra être versé le jour de la remise des clés, soit le <Text style={styles.value}>{fmt(location.dateArrivee)}</Text>. Il vous sera restitué à votre départ après l'état des lieux.
          </Text>
          <Text style={{ marginBottom: 4 }}>
            Un acompte d'un montant de <Text style={styles.value}>{m(acompte)} euros</Text> est demandé par virement pour la réservation.
          </Text>
          <Text>
            Le solde du séjour doit être réceptionné 48 heures avant l'entrée dans les lieux par virement bancaire.
          </Text>
        </View>

        <Divider />

        <View style={styles.section}>
          <Text style={{ fontSize: 9, color: MUTED }}>
            Ce contrat de location et un exemplaire des conditions générales sont à nous retourner complétés, datés et signés par email avec le paiement effectué par virement. Nous vous retournerons un exemplaire signé, par email. Le descriptif de la location est à conserver.
          </Text>
        </View>

        {/* Signatures */}
        <Text style={{ marginTop: 10 }}>Fait en deux exemplaires à Tournan en Brie, le {today}</Text>
        <View style={styles.sigBlock}>
          <View style={styles.sigBox}>
            <Text style={styles.sigLabel}>Le Propriétaire</Text>
            <Text style={styles.sigSub}>Signature précédée de la mention "Lu et approuvé"</Text>
          </View>
          <View style={styles.sigBox}>
            <Text style={styles.sigLabel}>Le Locataire</Text>
            <Text style={styles.sigSub}>Signature précédée de la mention "Lu et approuvé"</Text>
          </View>
        </View>

        <Text style={styles.footer}>LocGérer — Document confidentiel</Text>
      </Page>

      {/* ── PAGES 2 & 3 : CONDITIONS GÉNÉRALES — paysage 2 colonnes ── */}
      <Page size="A4" orientation="landscape" style={styles.cgPage}>
        <Text style={styles.cgTitle}>Conditions générales de location</Text>

        <View style={styles.cgColumns}>
          {/* COLONNE GAUCHE */}
          <View style={styles.cgCol}>
            <Text style={{ ...styles.cgText, marginBottom: 8 }}>
              La présente location est faite aux conditions ordinaires et de droit en pareille matière et notamment à celles-ci-après que le locataire s'oblige à exécuter, sous peine de tous dommages et intérêts et même de résiliations des présentes, si bon semble au propriétaire et sans pouvoir réclamer la diminution du loyer.
            </Text>

            <View style={styles.cgSection}>
              <Text style={styles.cgSectionTitle}>États des lieux :</Text>
              <Text style={styles.cgText}>Un état des lieux contradictoire sera établi lors de la remise des clés au locataire et lors de la restitution de celles-ci.</Text>
            </View>

            <View style={styles.cgSection}>
              <Text style={styles.cgSectionTitle}>Inventaire :</Text>
              <Text style={styles.cgText}>Un inventaire contradictoire sera établi le jour de l'entrée dans les lieux du locataire. À l'expiration de la location, cette annexe sera à nouveau vérifiée et signée par les deux parties.</Text>
            </View>

            <View style={styles.cgSection}>
              <Text style={styles.cgSectionTitle}>Durée de la location :</Text>
              <Text style={styles.cgText}>
                La présente location est consentie et acceptée pour une durée de <Text style={{ fontFamily: "Helvetica-Bold" }}>{n} nuit{n > 1 ? "s" : ""}</Text> à compter du <Text style={{ fontFamily: "Helvetica-Bold" }}>{fmt(location.dateArrivee)}</Text> à 16h00 pour se terminer le <Text style={{ fontFamily: "Helvetica-Bold" }}>{fmt(location.depart)}</Text> à 10h00.{"\n"}
                En aucun cas elle ne pourra être prorogée, sauf accord préalable et écrit du propriétaire. Le contrat initial ou le contrat prorogé ne pourront porter la durée de la location à plus de quatre-vingt jours maximum.{"\n"}
                Pour la prise de possession des lieux et les formalités d'usage, il est convenu d'un rendez-vous le <Text style={{ fontFamily: "Helvetica-Bold" }}>{fmt(location.dateArrivee)}</Text> à 16 heures. Ces rendez-vous pourront être modifiés en cas de force majeure.
              </Text>
            </View>

            <View style={styles.cgSection}>
              <Text style={styles.cgSectionTitle}>Loyer et charges :</Text>
              <Text style={styles.cgText}>
                La présente location est consentie moyennant le prix de <Text style={{ fontFamily: "Helvetica-Bold" }}>{m(prixBase)} euros</Text> charges comprises (eau, électricité, connexion internet). À ce montant s'ajoutent <Text style={{ fontFamily: "Helvetica-Bold" }}>{m(frais)} euros</Text> de frais de ménage/blanchisserie.
              </Text>
            </View>

            <View style={styles.cgSection}>
              <Text style={styles.cgSectionTitle}>Dépôt de garantie :</Text>
              <Text style={styles.cgText}>
                Le locataire versera le jour de l'entrée dans les lieux la somme de <Text style={{ fontFamily: "Helvetica-Bold" }}>{m(caution)} euros</Text> par chèque. Cette somme sera restituée dès la preuve que :{"\n"}
              </Text>
              <Text style={styles.cgBullet}>• Aucun meuble, objet ou linge n'est absent, dégradé ni sali.</Text>
              <Text style={styles.cgBullet}>• Les lieux n'ont subi aucune dégradation et sont remis en état propre.</Text>
              <Text style={{ ...styles.cgText, marginTop: 4 }}>Si ce dépôt s'avérait insuffisant, le locataire s'engage à en parfaire la somme.</Text>
            </View>
          </View>

          {/* SÉPARATEUR */}
          <View style={styles.cgSep} />

          {/* COLONNE DROITE */}
          <View style={styles.cgCol}>
            <View style={styles.cgSection}>
              <Text style={styles.cgSectionTitle}>Assurance :</Text>
              <Text style={styles.cgText}>
                Le locataire s'engage à s'assurer contre les risques locatifs (incendie, dégât des eaux). Le défaut d'assurance donnera lieu à des dommages et intérêts. Le locataire doit signaler tout sinistre dans les 24h et fournir une attestation de responsabilité civile 48h avant l'entrée dans les lieux, sous peine d'annulation sans remboursement des arrhes.
              </Text>
            </View>

            <View style={styles.cgSection}>
              <Text style={styles.cgSectionTitle}>Échéancier de paiement :</Text>
              <Text style={styles.cgText}>
                Le jour de la signature : <Text style={{ fontFamily: "Helvetica-Bold" }}>{m(acompte)} euros</Text> d'acompte.{"\n"}
                48h avant l'entrée : solde de <Text style={{ fontFamily: "Helvetica-Bold" }}>{m(solde)} euros</Text> + taxe de séjour de <Text style={{ fontFamily: "Helvetica-Bold" }}>{m(taxeParNuit)} €</Text>/adulte/nuit soit <Text style={{ fontFamily: "Helvetica-Bold" }}>{m(taxeTotale)} euros</Text> au total.
              </Text>
            </View>

            <View style={styles.cgSection}>
              <Text style={styles.cgSectionTitle}>Clause pénale - arrhes :</Text>
              <Text style={{ ...styles.cgText, fontFamily: "Helvetica-Bold" }}>Du locataire :</Text>
              <Text style={styles.cgBullet}>• À plus de 3 semaines : perte des arrhes versées.</Text>
              <Text style={styles.cgBullet}>• À moins de 3 semaines : versement de la différence jusqu'au loyer total.</Text>
              <Text style={{ ...styles.cgText, fontFamily: "Helvetica-Bold", marginTop: 4 }}>Du propriétaire :</Text>
              <Text style={styles.cgBullet}>• Restitution des arrhes dans les 7 jours suivant le désistement.</Text>
            </View>

            <View style={styles.cgSection}>
              <Text style={styles.cgSectionTitle}>Clause résolutoire :</Text>
              <Text style={styles.cgText}>
                À défaut de paiement ou en cas d'inexécution d'une clause, le contrat sera résilié et le propriétaire pourra conserver les arrhes à titre de premiers dommages-intérêts (art. 1590 C. civil).
              </Text>
            </View>

            <View style={styles.cgSection}>
              <Text style={styles.cgSectionTitle}>Obligation du locataire :</Text>
              <Text style={styles.cgText}>Le locataire s'engage :</Text>
              {[
                "à respecter la capacité d'accueil",
                "à jouir paisiblement des lieux sans trouble ni nuisance",
                "à ne pas sous-louer ni céder le contrat à un tiers",
                "à signaler tout dégât dans les plus brefs délais",
                "à respecter la destination de l'habitation",
                "à autoriser les réparations urgentes",
                "à respecter les modalités de remise des clefs",
                "à laisser les lieux propres à son départ",
              ].map((item, i) => (
                <Text style={styles.cgBullet} key={i}>• {item}</Text>
              ))}
            </View>

            <Text style={{ marginTop: 12, fontSize: 7 }}>Fait en deux exemplaires à Tournan en Brie, le {today}</Text>
            <View style={styles.sigBlock}>
              <View style={styles.sigBox}>
                <Text style={styles.sigLabel}>Le Bailleur (propriétaire)</Text>
                <Text style={styles.sigSub}>Signature précédée de "Lu et approuvé"</Text>
              </View>
              <View style={styles.sigBox}>
                <Text style={styles.sigLabel}>Le Preneur (locataire)</Text>
                <Text style={styles.sigSub}>Signature précédée de "Lu et approuvé"</Text>
              </View>
            </View>
          </View>
        </View>

        <Text style={styles.footer}>LocGérer — Document confidentiel</Text>
      </Page>
    </Document>
  );
}