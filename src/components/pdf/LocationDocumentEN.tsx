import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { ContactDTO } from "@/dto/contact.dto";
import type { LocationDTO } from "@/dto/location.dto";

const GREEN = "#1D9E75";
const DARK = "#1a1a1a";
const MUTED = "#555";

const styles = StyleSheet.create({
  page: { padding: 50, fontFamily: "Helvetica", fontSize: 10, color: DARK, lineHeight: 1.5 },
  title: { fontSize: 16, fontFamily: "Helvetica-Bold", textAlign: "center", marginBottom: 20, textTransform: "uppercase", letterSpacing: 1 },
  section: { marginBottom: 12 },
  sectionTitle: { fontSize: 10, fontFamily: "Helvetica-Bold", textDecoration: "underline", marginBottom: 6 },
  row: { flexDirection: "row", flexWrap: "wrap", marginBottom: 3 },
  label: { color: MUTED },
  value: { fontFamily: "Helvetica-Bold" },
  twoCol: { flexDirection: "row", gap: 20 },
  col: { flex: 1 },
  divider: { borderBottomWidth: 0, borderBottomColor: "#ccc", marginVertical: 3 },
  sigBlock: { flexDirection: "row", marginTop: 15, gap: 20 },
  sigBox: { flex: 1, borderWidth: 0, borderColor: "#aaa", borderRadius: 4, padding: 5, minHeight: 80 },
  sigLabel: { fontSize: 9, fontFamily: "Helvetica-Bold", marginBottom: 4 },
  sigSub: { fontSize: 8, color: MUTED, marginBottom: 20 },
  footer: { position: "absolute", bottom: 30, left: 50, right: 50, fontSize: 8, color: "#aaa", textAlign: "center", borderTopWidth: 0.5, borderTopColor: "#ddd", paddingTop: 4 },
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
  return new Date(d).toLocaleDateString("en-GB"); // DD/MM/YYYY
}

function nuits(a: string | Date, b: string | Date) {
  return Math.max(0, Math.round((new Date(b).getTime() - new Date(a).getTime()) / 86400000));
}

type Props = { contact: ContactDTO; location: LocationDTO };

function Field({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}: </Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

function Divider() {
  return <View style={styles.divider} />;
}

export function LocationDocumentEN({ contact, location }: Props) {
  const n = nuits(location.dateArrivee, location.depart);
  const prixBase = parseFloat(String(location.prixBase)) || 0;
  const taxeParNuit = parseFloat(String(location.taxeParNuit)) || 0;
  const frais = parseFloat(String(location.frais)) || 0;
  const acompte = parseFloat(String(location.acompte)) || 0;
  const caution = parseFloat(String(location.caution)) || 0;
  const taxeTotale = taxeParNuit * location.adultes * n;
  const prixTotal = prixBase + frais + taxeTotale;
  const solde = prixTotal - acompte;
  const today = new Date().toLocaleDateString("en-GB");
  const m = (v: number) => v.toFixed(2);

  return (
    <Document>
      {/* ── PAGE 1: RENTAL AGREEMENT ── */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Rental Agreement</Text>

        {/* Owner */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Between the owner:</Text>
          <Text style={{ fontFamily: "Helvetica-Bold" }}>BRODER Emeline</Text>
          <Text>10 rue du gros noyer</Text>
          <Text>77220 Tournan en Brie, France</Text>
          <Text>+33 6 33 20 30 04</Text>
          <Text>emeline.broder@gmail.com</Text>
        </View>

        <Divider />

        {/* Tenant */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>And the tenant:</Text>
          <View style={styles.twoCol}>
            <View style={styles.col}>
              <Field label="Last name" value={contact.nom} />
              <Field label="First name" value={contact.prenom} />
              <Field label="Address" value={contact.adresse ?? "—"} />
            </View>
            <View style={styles.col}>
              <Field label="Email" value={contact.email ?? "—"} />
              <Field label="Phone" value={contact.telephone ?? "—"} />
            </View>
          </View>
        </View>

        <Divider />

        {/* Occupants */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Number of occupants:</Text>
          <View style={{ flexDirection: "row", gap: 30 }}>
            <Field label="Adult(s)" value={String(location.adultes)} />
            <Field label="Child(ren)" value={String(location.enfants)} />
            <Field label="Pet(s)" value={String(location.animaux)} />
          </View>
        </View>

        <Divider />

        {/* Stay */}
        <View style={styles.section}>
          <Text style={{ marginBottom: 4 }}>
            A short-term rental is agreed for the following period:
          </Text>
          <View style={{ flexDirection: "row", gap: 10 }}>
            <Text style={styles.label}>from </Text>
            <Text style={styles.value}>{fmt(location.dateArrivee)}</Text>
            <Text style={styles.label}> to </Text>
            <Text style={styles.value}>{fmt(location.depart)}</Text>
          </View>
          <Text style={{ marginTop: 4 }}>
            At the following address: <Text style={styles.value}>1659 Promenade Marie Paradis, 74400 Chamonix-Mont-Blanc, France</Text>
          </Text>
        </View>

        <Divider />

        {/* Pricing */}
        <View style={styles.section}>
          <Field label="Rental price" value={`€${m(prixBase)}`} />
          <Field label="Cleaning/laundry fees" value={`€${m(frais)}`} />
          <Field label="Tourist tax" value={`€${m(taxeTotale)} for the duration of the stay`} />
          <View style={{ marginTop: 4 }}>
            <Field label="Total price" value={`€${m(prixTotal)}`} />
          </View>
        </View>

        <Divider />

        {/* Deposit & advance */}
        <View style={styles.section}>
          <Text style={{ marginBottom: 4 }}>
            A security deposit of <Text style={styles.value}>€{m(caution)}</Text> must be paid on the day of key handover, i.e. <Text style={styles.value}>{fmt(location.dateArrivee)}</Text>. It will be returned upon departure following the exit inspection.
          </Text>
          <Text style={{ marginBottom: 4 }}>
            An advance payment of <Text style={styles.value}>€{m(acompte)}</Text> is required by bank transfer to confirm the booking.
          </Text>
          <Text>
            The balance must be received 48 hours before check-in by bank transfer.
          </Text>
        </View>

        <Divider />

        <View style={styles.section}>
          <Text style={{ fontSize: 9, color: MUTED }}>
            This rental agreement and a copy of the general terms and conditions must be returned to us completed, dated and signed by email along with the transfer payment. We will return a signed copy by email. Please keep the property description for your records.
          </Text>
        </View>

        {/* Signatures */}
        <Text style={{ marginTop: 10 }}>Done in two copies in Tournan en Brie, on {today}</Text>
        <View style={styles.sigBlock}>
          <View style={styles.sigBox}>
            <Text style={styles.sigLabel}>The Owner</Text>
            <Text style={styles.sigSub}>Signature preceded by "Read and approved"</Text>
          </View>
          <View style={styles.sigBox}>
            <Text style={styles.sigLabel}>The Tenant</Text>
            <Text style={styles.sigSub}>Signature preceded by "Read and approved"</Text>
          </View>
        </View>
      </Page>

      {/* ── PAGE 2: GENERAL TERMS AND CONDITIONS ── */}
      <Page size="A4" orientation="landscape" style={styles.cgPage}>
        <Text style={styles.cgTitle}>General Terms and Conditions of Rental</Text>

        <View style={styles.cgColumns}>
          {/* LEFT COLUMN */}
          <View style={styles.cgCol}>
            <Text style={{ ...styles.cgText, marginBottom: 8 }}>
              This rental is made under the ordinary and statutory conditions applicable in such matters, and in particular the following conditions which the tenant undertakes to fulfil, failing which the owner may claim damages and even terminate this agreement without the tenant being able to claim any reduction in rent.
            </Text>

            <View style={styles.cgSection}>
              <Text style={styles.cgSectionTitle}>Inspection of premises:</Text>
              <Text style={styles.cgText}>A joint inspection of the premises will be carried out at the time of key handover to the tenant and again upon their return.</Text>
            </View>

            <View style={styles.cgSection}>
              <Text style={styles.cgSectionTitle}>Inventory:</Text>
              <Text style={styles.cgText}>A joint inventory will be carried out on the day the tenant takes possession of the property. At the end of the rental period, this schedule will be re-checked and signed by both parties.</Text>
            </View>

            <View style={styles.cgSection}>
              <Text style={styles.cgSectionTitle}>Duration of rental:</Text>
              <Text style={styles.cgText}>
                This rental is agreed and accepted for a period of <Text style={{ fontFamily: "Helvetica-Bold" }}>{n} night{n > 1 ? "s" : ""}</Text> from <Text style={{ fontFamily: "Helvetica-Bold" }}>{fmt(location.dateArrivee)}</Text> at 4:00 PM to <Text style={{ fontFamily: "Helvetica-Bold" }}>{fmt(location.depart)}</Text> at 10:00 AM.{"\n"}
                It may not be extended without prior written agreement from the owner. The initial contract or any extension may not exceed a maximum of eighty days.{"\n"}
                For taking possession of the property and the required formalities (inspection, inventory, key handover, payment of amounts due), an appointment is agreed on <Text style={{ fontFamily: "Helvetica-Bold" }}>{fmt(location.dateArrivee)}</Text> at 4:00 PM. These appointments may be changed provided both parties are duly informed.
              </Text>
            </View>

            <View style={styles.cgSection}>
              <Text style={styles.cgSectionTitle}>Rent and charges:</Text>
              <Text style={styles.cgText}>
                This rental is agreed at a price of <Text style={{ fontFamily: "Helvetica-Bold" }}>€{m(prixBase)}</Text> inclusive of charges (water, electricity, internet connection). In addition, <Text style={{ fontFamily: "Helvetica-Bold" }}>€{m(frais)}</Text> of cleaning/laundry fees apply.
              </Text>
            </View>

            <View style={styles.cgSection}>
              <Text style={styles.cgSectionTitle}>Security deposit:</Text>
              <Text style={styles.cgText}>
                As a security deposit to cover any damage to the property or its contents, the tenant will pay <Text style={{ fontFamily: "Helvetica-Bold" }}>€{m(caution)}</Text> by cheque on the day of check-in. This amount will be returned once it is confirmed that:{"\n"}
              </Text>
              <Text style={styles.cgBullet}>• No furniture, item or linen is missing, damaged or soiled — or, if so, that its repair or replacement has been agreed and accepted by the owner.</Text>
              <Text style={styles.cgBullet}>• The property has not suffered any damage and is left in a clean condition (cupboards, bins and fridge empty of waste, bathrooms, appliances, dishes, etc.)</Text>
              <Text style={{ ...styles.cgText, marginTop: 4 }}>Should this deposit prove insufficient, the tenant agrees to make up the difference.</Text>
            </View>

            <View style={styles.cgSection}>
              <Text style={styles.cgSectionTitle}>Insurance:</Text>
              <Text style={styles.cgText}>
                The tenant agrees to take out insurance against rental risks (fire, water damage). Failure to do so will give rise to damages. The tenant must report any incident within 24 hours and provide proof of third-party liability insurance 48 hours before check-in, failing which the booking may be cancelled without refund of the deposit.
              </Text>
            </View>
          </View>

          {/* SEPARATOR */}
          <View style={styles.cgSep} />

          {/* RIGHT COLUMN */}
          <View style={styles.cgCol}>
            <View style={styles.cgSection}>
              <Text style={styles.cgSectionTitle}>Payment schedule:</Text>
              <Text style={styles.cgText}>
                On signing: <Text style={{ fontFamily: "Helvetica-Bold" }}>€{m(acompte)}</Text> advance payment.{"\n"}
                48 hours before check-in, by bank transfer: balance of <Text style={{ fontFamily: "Helvetica-Bold" }}>€{m(solde)}</Text> + tourist tax of <Text style={{ fontFamily: "Helvetica-Bold" }}>€{m(taxeParNuit)}</Text>/adult/night, totalling <Text style={{ fontFamily: "Helvetica-Bold" }}>€{m(taxeTotale)}</Text>.
                The booking will be confirmed upon receipt of the transfer and this signed agreement.
              </Text>
            </View>

            <View style={styles.cgSection}>
              <Text style={styles.cgSectionTitle}>Penalty clause — deposit:</Text>
              <Text style={styles.cgText}>In the event of cancellation:</Text>
              <Text style={{ ...styles.cgText, fontFamily: "Helvetica-Bold" }}>By the tenant:</Text>
              <Text style={styles.cgBullet}>• More than 3 weeks before: the tenant forfeits the advance payment</Text>
              <Text style={styles.cgBullet}>• Less than 3 weeks before check-in: the tenant must additionally pay the difference between the advance and the full rental amount</Text>
              <Text style={{ ...styles.cgText, fontFamily: "Helvetica-Bold", marginTop: 4 }}>By the owner:</Text>
              <Text style={styles.cgBullet}>• Full refund of the advance within 7 days of cancellation.</Text>
            </View>

            <View style={styles.cgSection}>
              <Text style={styles.cgSectionTitle}>Termination clause:</Text>
              <Text style={styles.cgText}>
                In the event of non-payment or breach of any clause, the agreement will be terminated and the owner may retain the advance payment as initial compensation (Art. 1590 French Civil Code).
              </Text>
            </View>

            <View style={styles.cgSection}>
              <Text style={styles.cgSectionTitle}>Tenant's obligations:</Text>
              <Text style={styles.cgText}>The tenant agrees to:</Text>
              {[
                "respect the maximum occupancy",
                "enjoy the property peacefully without disturbance or nuisance to neighbours",
                "not sublet or transfer the agreement to a third party",
                "report any damage as soon as possible",
                "respect the residential purpose of the property and make no alterations to it",
                "allow the owner or their representative to carry out any urgent repairs during the rental period, waiving any claim to compensation or rent reduction on this account",
                "respect the key handover procedures",
                "leave the property clean upon departure, free of all rubbish and waste. Failing this, the tenant is informed that cleaning will be arranged by a third party at their expense",
              ].map((item, i) => (
                <Text style={styles.cgBullet} key={i}>• {item}</Text>
              ))}
            </View>

            <Text style={{ marginTop: 12, fontSize: 7 }}>Done in two copies in Tournan en Brie, on {today}</Text>
            <View style={styles.sigBlock}>
              <View style={styles.sigBox}>
                <Text style={styles.sigLabel}>The Landlord (owner)</Text>
                <Text style={styles.sigSub}>Signature preceded by "Read and approved"</Text>
              </View>
              <View style={styles.sigBox}>
                <Text style={styles.sigLabel}>The Tenant</Text>
                <Text style={styles.sigSub}>Signature preceded by "Read and approved"</Text>
              </View>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}