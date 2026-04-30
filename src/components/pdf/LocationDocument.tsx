import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: "Helvetica", fontSize: 10, color: "#1a1a1a" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", borderBottomWidth: 2, borderBottomColor: "#1D9E75", paddingBottom: 10, marginBottom: 20 },
  title: { fontSize: 20, fontFamily: "Helvetica-Bold", color: "#1D9E75" },
  date: { fontSize: 9, color: "#888" },
  section: { marginBottom: 16 },
  sectionTitle: { fontSize: 9, textTransform: "uppercase", letterSpacing: 0.5, color: "#888", borderBottomWidth: 0.5, borderBottomColor: "#ddd", paddingBottom: 4, marginBottom: 8 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 4 },
  row: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 4, borderBottomWidth: 0.5, borderBottomColor: "#f0f0f0" },
  label: { color: "#666" },
  value: { fontFamily: "Helvetica-Bold" },
  totalBox: { backgroundColor: "#f0faf6", borderRadius: 4, padding: 10, flexDirection: "row", justifyContent: "space-between", marginBottom: 6 },
  totalLabel: { fontFamily: "Helvetica-Bold", fontSize: 12, color: "#0F6E56" },
  totalValue: { fontFamily: "Helvetica-Bold", fontSize: 12, color: "#0F6E56" },
  soldeBox: { backgroundColor: "#fef9f0", borderRadius: 4, padding: 10, flexDirection: "row", justifyContent: "space-between" },
  soldeLabel: { fontFamily: "Helvetica-Bold", fontSize: 12, color: "#854F0B" },
  soldeValue: { fontFamily: "Helvetica-Bold", fontSize: 12, color: "#854F0B" },
  footer: { position: "absolute", bottom: 30, left: 40, right: 40, textAlign: "center", fontSize: 8, color: "#bbb", borderTopWidth: 0.5, borderTopColor: "#eee", paddingTop: 6 },
});

function fmt(d: string | Date) {
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleDateString("fr-FR");
}

function nuits(a: string | Date, b: string | Date) {
  const da = typeof a === "string" ? new Date(a) : a;
  const db = typeof b === "string" ? new Date(b) : b;
  return Math.max(0, Math.round((db.getTime() - da.getTime()) / 86400000));
}

type Location = {
  dateArrivee: string | Date;
  depart: string | Date;
  adultes: number;
  enfants: number;
  animaux: number;
  prixBase: number | string;
  taxeParNuit: number | string;
  frais: number | string;
  acompte: number | string;
  caution: number | string;
};

type Contact = {
  prenom: string;
  nom: string;
  email?: string | null;
  telephone?: string | null;
  adresse?: string | null;
};

type Props = { contact: Contact; location: Location };

export function LocationDocument({ contact, location }: Props) {
  const n = nuits(location.dateArrivee, location.depart);
  const taxeParNuit = parseFloat(String(location.taxeParNuit)) || 0;
  const prixBase = parseFloat(String(location.prixBase)) || 0;
  const frais = parseFloat(String(location.frais)) || 0;
  const acompte = parseFloat(String(location.acompte)) || 0;
  const caution = parseFloat(String(location.caution)) || 0;
  const taxeTotale = taxeParNuit * location.adultes * n;
  const prixTotal = prixBase + frais + taxeTotale;
  const solde = prixTotal - acompte;
  const money = (v: number) => v.toFixed(2) + " €";

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Confirmation de location</Text>
          <Text style={styles.date}>Généré le {new Date().toLocaleDateString("fr-FR")}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Locataire</Text>
          <Text style={{ fontFamily: "Helvetica-Bold", marginBottom: 2 }}>{contact.prenom} {contact.nom}</Text>
          {contact.email && <Text style={{ color: "#555" }}>{contact.email}</Text>}
          {contact.telephone && <Text style={{ color: "#555" }}>{contact.telephone}</Text>}
          {contact.adresse && <Text style={{ color: "#555" }}>{contact.adresse}</Text>}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Détails du séjour</Text>
          {[
            ["Arrivée", fmt(location.dateArrivee)],
            ["Départ", fmt(location.depart)],
            ["Durée", `${n} nuit${n > 1 ? "s" : ""}`],
            ["Adultes", String(location.adultes)],
            ["Enfants", String(location.enfants)],
            ["Animaux", String(location.animaux)],
          ].map(([label, value]) => (
            <View style={styles.row} key={label}>
              <Text style={styles.label}>{label}</Text>
              <Text style={styles.value}>{value}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Récapitulatif financier</Text>
          {[
            ["Prix séjour hors frais", money(prixBase)],
            ["Taxe de séjour / adulte / nuit", money(taxeParNuit)],
            ["Taxe de séjour totale", money(taxeTotale)],
            ["Frais", money(frais)],
            ["Caution", money(caution)],
            ["Acompte versé", money(acompte)],
          ].map(([label, value]) => (
            <View style={styles.row} key={label}>
              <Text style={styles.label}>{label}</Text>
              <Text style={styles.value}>{value}</Text>
            </View>
          ))}
        </View>

        <View style={styles.totalBox}>
          <Text style={styles.totalLabel}>Prix total</Text>
          <Text style={styles.totalValue}>{money(prixTotal)}</Text>
        </View>
        <View style={styles.soldeBox}>
          <Text style={styles.soldeLabel}>Solde à payer</Text>
          <Text style={styles.soldeValue}>{money(solde)}</Text>
        </View>

        <Text style={styles.footer}>Document confidentiel — LocGérer</Text>
      </Page>
    </Document>
  );
}
